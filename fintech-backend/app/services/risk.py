"""
Risk Scoring Service
Formula: risk = penalty + urgency - flexibility
"""


def compute_risk(obligation: dict) -> float:
    penalty = obligation.get("penalty", 5)
    urgency = obligation.get("urgency", 5)
    flexibility = obligation.get("flexibility", 5)
    raw = penalty + urgency - flexibility
    # Normalise to 0-10
    normalised = max(0.0, min(10.0, raw / 1.5))
    return round(normalised, 2)


def label_risk(score: float) -> str:
    if score >= 7:
        return "High ❌"
    elif score >= 4:
        return "Medium ⚠️"
    return "Low ✅"
