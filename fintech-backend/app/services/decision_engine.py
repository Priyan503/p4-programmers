"""
Decision Engine Service
Formula: score = urgency * 0.4 + penalty * 0.4 + relationship * 0.2
"""
from copy import deepcopy


def calculate_score(obligation: dict) -> float:
    return (
        obligation.get("urgency", 5) * 0.4
        + obligation.get("penalty", 5) * 0.4
        + obligation.get("relationship", 5) * 0.2
    )


def determine_action(score: float) -> str:
    if score >= 7:
        return "Pay Immediately"
    elif score >= 4:
        return "Delay if Needed"
    else:
        return "Monitor"


def get_reason(obligation: dict) -> str:
    reasons = []
    if obligation.get("penalty", 5) >= 7:
        reasons.append("high penalty risk")
    if obligation.get("urgency", 5) >= 7:
        reasons.append("urgent due date")
    if obligation.get("relationship", 5) >= 7:
        reasons.append("key relationship")
    return ", ".join(reasons) if reasons else "standard priority"


def prioritize(obligations: list[dict]) -> list[dict]:
    result = []
    for o in obligations:
        o = o.copy()
        o["priority_score"] = round(calculate_score(o), 2)
        o["action"] = determine_action(o["priority_score"])
        o["reason"] = get_reason(o)
    return sorted(
        [
            {**o, "priority_score": round(calculate_score(o), 2),
             "action": determine_action(round(calculate_score(o), 2)),
             "reason": get_reason(o)}
            for o in obligations
        ],
        key=lambda x: x["priority_score"],
        reverse=True,
    )
