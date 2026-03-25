"""
Seed script — populates the DB with realistic demo data.
Run once:  python -m app.seed
"""
from app.database import init_db, SessionLocal
from app.models.user import User
from app.models.transaction import Transaction
from app.models.obligation import Obligation
from app.models.receivable import Receivable
from app.services.risk import compute_risk
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed():
    init_db()
    db = SessionLocal()

    # ── User ─────────────────────────────────────────────
    if not db.query(User).filter(User.email == "demo@fintech.com").first():
        user = User(
            name="Demo Business",
            email="demo@fintech.com",
            hashed_password=pwd_context.hash("password123"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        uid = user.id
    else:
        uid = db.query(User).filter(User.email == "demo@fintech.com").first().id

    # ── Transactions ─────────────────────────────────────
    txns = [
        ("2026-01-05", 200000, "income",  "client",  "Client A payment"),
        ("2026-01-10", 150000, "income",  "client",  "Client B advance"),
        ("2026-01-15",  30000, "expense", "salary",  "Staff salaries"),
        ("2026-01-20",  15000, "expense", "rent",    "Office rent Jan"),
        ("2026-01-25",   8000, "expense", "utility", "Electricity bill"),
        ("2026-02-05", 120000, "income",  "client",  "Client C milestone"),
        ("2026-02-10",  30000, "expense", "salary",  "Staff salaries Feb"),
        ("2026-02-18",  25000, "expense", "vendor",  "Vendor supplies"),
        ("2026-02-20",  15000, "expense", "rent",    "Office rent Feb"),
        ("2026-03-02",  80000, "income",  "client",  "Client A renewal"),
        ("2026-03-10",  30000, "expense", "salary",  "Staff salaries Mar"),
        ("2026-03-15",  12000, "expense", "vendor",  "Vendor B payment"),
        ("2026-03-18",   5000, "expense", "subscription", "SaaS tools"),
        ("2026-03-20",  15000, "expense", "rent",    "Office rent Mar"),
    ]
    if db.query(Transaction).filter(Transaction.user_id == uid).count() == 0:
        for date, amount, typ, cat, desc in txns:
            db.add(Transaction(user_id=uid, amount=amount, type=typ, category=cat, date=date, description=desc))
        db.commit()

    # ── Obligations ──────────────────────────────────────
    obligations_data = [
        # name,            amount,  due_date,      urgency, penalty, relationship, flexibility
        ("Salary – April",  30000, "2026-04-01",    9,       9,       8,            2),
        ("Office Rent",     15000, "2026-04-05",    7,       7,       6,            3),
        ("Vendor A Invoice",22000, "2026-04-07",    6,       8,       7,            5),
        ("Electricity Bill", 8000, "2026-04-10",    5,       6,       4,            6),
        ("SaaS Subscription",5000, "2026-04-15",    3,       3,       2,            9),
        ("Vendor B Invoice",18000, "2026-04-20",    5,       6,       5,            7),
        ("Bank Loan EMI",   40000, "2026-04-03",    8,       9,       9,            1),
    ]
    if db.query(Obligation).filter(Obligation.user_id == uid).count() == 0:
        for name, amount, due, urg, pen, rel, flex in obligations_data:
            o = Obligation(
                user_id=uid, name=name, amount=amount, due_date=due,
                urgency=urg, penalty=pen, relationship=rel, flexibility=flex
            )
            o.risk_score = compute_risk({
                "urgency": urg, "penalty": pen, "flexibility": flex
            })
            db.add(o)
        db.commit()

    # ── Receivables ──────────────────────────────────────
    receivables_data = [
        ("Client D",  50000, "2026-04-08"),
        ("Client E",  35000, "2026-04-12"),
        ("GST Refund", 12000, "2026-04-20"),
    ]
    if db.query(Receivable).filter(Receivable.user_id == uid).count() == 0:
        for source, amount, exp_date in receivables_data:
            db.add(Receivable(user_id=uid, source=source, amount=amount, expected_date=exp_date))
        db.commit()

    db.close()
    print("✅ Seed complete! Login: demo@fintech.com / password123")


if __name__ == "__main__":
    seed()
