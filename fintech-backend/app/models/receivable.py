from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database import Base


class Receivable(Base):
    __tablename__ = "receivables"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    source = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    expected_date = Column(String, nullable=False)
    status = Column(String, default="pending")   # pending | received
