"""Upload routes — POST /upload/csv, POST /upload/image"""
import os
import shutil
import tempfile
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
import pandas as pd

from app.database import get_db
from app.models.transaction import Transaction
from app.services.ocr import extract_text_from_image, parse_ocr_text

router = APIRouter(prefix="/upload", tags=["upload"])

# Default demo user_id (in production, extract from JWT)
DEMO_USER_ID = 1


def _classify_category(row: pd.Series) -> str:
    """Auto-classify based on description/category column if present."""
    if "category" in row.index and pd.notna(row["category"]):
        return str(row["category"]).lower()
    desc = str(row.get("description", "")).lower()
    for keyword, cat in [
        ("salary", "salary"), ("rent", "rent"), ("vendor", "vendor"),
        ("subscription", "subscription"), ("utility", "utility"),
        ("loan", "loan"), ("client", "income"),
    ]:
        if keyword in desc:
            return cat
    return "general"


@router.post("/csv")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    contents = await file.read()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".csv")
    tmp.write(contents)
    tmp.close()

    try:
        df = pd.read_csv(tmp.name)
        required = {"amount", "date"}
        missing = required - set(df.columns.str.lower())
        if missing:
            raise HTTPException(status_code=400, detail=f"Missing columns: {missing}")

        df.columns = df.columns.str.lower()
        added = 0
        for _, row in df.iterrows():
            tx = Transaction(
                user_id=DEMO_USER_ID,
                amount=float(row["amount"]),
                type=str(row.get("type", "expense")).lower(),
                category=_classify_category(row),
                date=str(row["date"]),
                description=str(row.get("description", "")),
            )
            db.add(tx)
            added += 1
        db.commit()
        return {"message": f"Imported {added} transactions successfully"}
    finally:
        os.unlink(tmp.name)


@router.post("/image")
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    allowed = {".jpg", ".jpeg", ".png", ".bmp", ".tiff"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    contents = await file.read()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
    tmp.write(contents)
    tmp.close()

    try:
        raw_text = extract_text_from_image(tmp.name)
        parsed = parse_ocr_text(raw_text)
        tx = Transaction(user_id=DEMO_USER_ID, **parsed)
        db.add(tx)
        db.commit()
        db.refresh(tx)
        return {"message": "OCR successful", "extracted": parsed, "id": tx.id}
    finally:
        os.unlink(tmp.name)
