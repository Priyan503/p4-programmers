"""Reports route — GET /reports?start=YYYY-MM-DD&end=YYYY-MM-DD"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from collections import defaultdict

from app.database import get_db
from app.models.transaction import Transaction

router = APIRouter(tags=["reports"])

DEMO_USER_ID = 1


@router.get("/reports")
def get_reports(
    start: str = Query(default="2025-01-01"),
    end: str = Query(default="2026-12-31"),
    category: str = Query(default=None),
    type: str = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Transaction).filter(
        Transaction.user_id == DEMO_USER_ID,
        Transaction.date >= start,
        Transaction.date <= end,
    )
    if category:
        query = query.filter(Transaction.category == category.lower())
    if type:
        query = query.filter(Transaction.type == type.lower())

    transactions = query.order_by(Transaction.date).all()

    # Summary by category
    by_category: dict[str, float] = defaultdict(float)
    for t in transactions:
        by_category[t.category] += t.amount

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")

    return {
        "period": {"start": start, "end": end},
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "net": round(total_income - total_expense, 2),
        "by_category": {k: round(v, 2) for k, v in by_category.items()},
        "transactions": [
            {
                "id": t.id,
                "amount": t.amount,
                "type": t.type,
                "category": t.category,
                "date": t.date,
                "description": t.description,
            }
            for t in transactions
        ],
    }
