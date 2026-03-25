"""Email generator route — POST /generate-email"""
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.email_generator import generate_email

router = APIRouter(tags=["email"])


class EmailRequest(BaseModel):
    recipient: str
    amount: float
    delay_days: int
    reason: str = "temporary cash flow issue"
    relationship: str = "formal"   # "formal" | "friendly"
    due_date: str = "the agreed date"
    name: str = "Invoice"


@router.post("/generate-email")
def create_email(req: EmailRequest):
    email_text = generate_email(
        recipient=req.recipient,
        amount=req.amount,
        delay_days=req.delay_days,
        reason=req.reason,
        relationship=req.relationship,
        due_date=req.due_date,
        name=req.name,
    )
    return {"email": email_text, "tone": req.relationship}
