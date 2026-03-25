"""Simulation route — POST /simulate (never writes to DB)"""
from copy import deepcopy
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.obligation import Obligation
from app.models.transaction import Transaction
from app.services.decision_engine import prioritize
from app.services.risk import compute_risk, label_risk

router = APIRouter(tags=["simulation"])

DEMO_USER_ID = 1


class SimulateRequest(BaseModel):
    target: str       # obligation name to delay
    days: int         # days to delay
    extra_income: float = 0.0  # optional extra cash injection


@router.post("/simulate")
def simulate(req: SimulateRequest, db: Session = Depends(get_db)):
    obligations = db.query(Obligation).filter(
        Obligation.user_id == DEMO_USER_ID,
        Obligation.status == "pending"
    ).all()
    transactions = db.query(Transaction).filter(Transaction.user_id == DEMO_USER_ID).all()

    # Clone into plain dicts — NEVER touch main DB
    raw = [
        {
            "id": o.id,
            "name": o.name,
            "amount": o.amount,
            "due_date": o.due_date,
            "urgency": o.urgency,
            "penalty": o.penalty,
            "relationship": o.relationship,
            "flexibility": o.flexibility,
        }
        for o in obligations
    ]
    cloned = deepcopy(raw)

    # Apply the simulated delay
    target_found = False
    for item in cloned:
        if item["name"].lower() == req.target.lower():
            # Shift urgency down to simulate delay effect
            item["urgency"] = max(1.0, item["urgency"] - (req.days / 3))
            target_found = True

    income = sum(t.amount for t in transactions if t.type == "income") + req.extra_income
    expense = sum(t.amount for t in transactions if t.type == "expense")
    balance = income - expense
    avg_daily = expense / 90 if expense > 0 else 1
    new_runway = round(balance / avg_daily) if avg_daily > 0 else 999

    ranked = prioritize(cloned)
    for item in ranked:
        rs = compute_risk(item)
        item["risk_score"] = rs
        item["risk_label"] = label_risk(rs)

    return {
        "scenario": f"Delay '{req.target}' by {req.days} days",
        "target_found": target_found,
        "simulated_balance": round(balance, 2),
        "simulated_runway_days": new_runway,
        "updated_priorities": ranked,
        "note": "⚠️ This is a simulation. No data was changed.",
    }
