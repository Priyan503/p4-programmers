"""
Email Generator Service
Template-based for now; swap generate_email() with OpenAI call later.
"""


_FORMAL_TEMPLATE = """\
Subject: Request for Payment Extension — {name}

Dear {recipient},

I hope this message finds you well. I am writing to respectfully request an extension
of {days} day(s) for the payment of ₹{amount:,.0f} originally due on {due_date}.

Due to a temporary cash flow constraint, we are unable to meet the payment schedule
at this time. We highly value our relationship and assure you this is a short-term
situation. We commit to completing the payment by the extended date.

Please let us know if this arrangement is acceptable. We are happy to discuss further.

Warm regards,
[Your Name / Company]
"""

_FRIENDLY_TEMPLATE = """\
Hey {recipient},

Hope you're doing great! Just wanted to reach out about the ₹{amount:,.0f} payment
due on {due_date}. We're running into a quick cash-flow hiccup and would love an
extra {days} day(s) if that's okay with you.

We totally understand if it's tight on your end too — just let us know and we'll
figure something out together. Appreciate you!

Thanks a ton,
[Your Name]
"""


def generate_email(
    recipient: str,
    amount: float,
    delay_days: int,
    reason: str,
    relationship: str,
    due_date: str = "the agreed date",
    name: str = "Invoice",
) -> str:
    template = _FORMAL_TEMPLATE if relationship == "formal" else _FRIENDLY_TEMPLATE
    return template.format(
        recipient=recipient,
        amount=amount,
        days=delay_days,
        reason=reason,
        due_date=due_date,
        name=name,
    )
