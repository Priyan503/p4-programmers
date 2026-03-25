from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database import Base


class Obligation(Base):
    __tablename__ = "obligations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(String, nullable=False)   # ISO date string
    urgency = Column(Float, default=5.0)        # 1-10
    penalty = Column(Float, default=5.0)        # 1-10
    relationship = Column(Float, default=5.0)   # 1-10
    flexibility = Column(Float, default=5.0)    # 1-10
    risk_score = Column(Float, default=0.0)
    status = Column(String, default="pending")  # pending | paid | delayed
