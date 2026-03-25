from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database import Base


class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    decision_output = Column(Text, nullable=False)
    reasoning = Column(Text, default="")
    created_at = Column(String, nullable=False)
