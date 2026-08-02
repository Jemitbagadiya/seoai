from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from zoneinfo import ZoneInfo
from database import Base


class Report(Base):
    """
    SQLAlchemy Database Model for the 'reports' table.
    Defines exactly how the data is stored inside the database.
    """
    __tablename__ = "reports"

    # Primary Key
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)

    # Report Details
    keyword = Column(String, nullable=False)

    # Save time in Indian Standard Time (IST)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(ZoneInfo("Asia/Kolkata"))
    )

    report_data = Column(String, nullable=False)          # Full AI response
    competitor_urls = Column(String, nullable=False)      # JSON string
    status = Column(String, default="completed")