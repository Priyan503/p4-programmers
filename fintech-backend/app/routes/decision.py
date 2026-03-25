"""Decision route — GET /decision"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
from datetime import datetime

from app.database import get_db
from app.models.obligation import Obligation
from app.models.decision import Decision
from app.services.decision_engine import prioritize
from app.services.risk import compute_risk, label_risk

router = APIRouter(tags=["decision"])

DEMO_USER_ID = 1


@router.get("/decision")
def get_decision(db: Session = Depends(get_db)):
    obligations = db.query(Obligation).filter(
        Obligation.user_id == DEMO_USER_ID,
        Obligation.status == "pending"
    ).all()

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

    ranked = prioritize(raw)

    # Add risk labels
    for item in ranked:
        rs = compute_risk(item)
        item["risk_score"] = rs
        item["risk_label"] = label_risk(rs)

    # Persist this decision snapshot
    decision_record = Decision(
        user_id=DEMO_USER_ID,
        decision_output=json.dumps(ranked),
        reasoning="Sorted by urgency*0.4 + penalty*0.4 + relationship*0.2",
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(decision_record)
    db.commit()

    return ranked


@router.get("/runway")
def get_runway(db: Session = Depends(get_db)):
    from app.models.transaction import Transaction
    transactions = db.query(Transaction).filter(Transaction.user_id == DEMO_USER_ID).all()
    income = sum(t.amount for t in transactions if t.type == "income")
    expense = sum(t.amount for t in transactions if t.type == "expense")
    balance = income - expense
    avg_daily = expense / 90 if expense > 0 else 1
    runway = round(balance / avg_daily) if avg_daily > 0 else 999
    alert = runway < 7
    return {
        "balance": round(balance, 2),
        "avg_daily_expense": round(avg_daily, 2),
        "runway_days": runway,
        "alert": alert,
        "message": f"⚠️ Cash will run out in {runway} days!" if alert else f"✅ {runway} days of runway remaining",
    }
