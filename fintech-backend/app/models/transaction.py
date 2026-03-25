from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False)      # "income" | "expense"
    category = Column(String, default="general")
    date = Column(String, nullable=False)      # stored as ISO string for SQLite
    description = Column(String, default="")
