"""Dashboard route — GET /dashboard"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import defaultdict

from app.database import get_db
from app.models.transaction import Transaction
from app.models.obligation import Obligation
from app.models.receivable import Receivable

router = APIRouter(tags=["dashboard"])

DEMO_USER_ID = 1


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.user_id == DEMO_USER_ID).all()

    income = sum(t.amount for t in transactions if t.type == "income")
    expense = sum(t.amount for t in transactions if t.type == "expense")
    balance = income - expense

    obligations = db.query(Obligation).filter(
        Obligation.user_id == DEMO_USER_ID,
        Obligation.status == "pending"
    ).all()

    receivables = db.query(Receivable).filter(
        Receivable.user_id == DEMO_USER_ID,
        Receivable.status == "pending"
    ).all()

    avg_daily_expense = expense / 90 if expense > 0 else 1
    runway_days = round(balance / avg_daily_expense) if avg_daily_expense > 0 else 999

    # Build month-by-month history for chart
    monthly: dict[str, float] = defaultdict(float)
    for t in sorted(transactions, key=lambda x: x.date):
        month = t.date[:7]  # "YYYY-MM"
        if t.type == "income":
            monthly[month] += t.amount
        else:
            monthly[month] -= t.amount

    running = 0.0
    history = []
    for month in sorted(monthly):
        running += monthly[month]
        history.append({"date": month, "balance": round(running, 2)})

    return {
        "balance": round(balance, 2),
        "income": round(income, 2),
        "expense": round(expense, 2),
        "runway": runway_days,
        "upcoming_obligations": len(obligations),
        "upcoming_amount": round(sum(o.amount for o in obligations), 2),
        "incoming_receivables": len(receivables),
        "incoming_amount": round(sum(r.amount for r in receivables), 2),
        "history": history,
    }
