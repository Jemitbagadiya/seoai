from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

# --- INCOMING DATA SCHEMAS (Request) ---

class KeywordRequest(BaseModel):
    """
    Validates the JSON sent from the frontend when generating a brief.
    Ensures the user actually provides a non-empty string keyword.
    """
    keyword: str = Field(..., min_length=1, max_length=200)


# --- OUTGOING DATA SCHEMAS (Response) ---

class ReportSummaryResponse(BaseModel):
    """
    Validates data when returning a list of past reports (History page).
    It only exposes the id, keyword, and date, hiding the massive text logs.
    """
    id: int
    keyword: str
    created_at: datetime

    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy model data directly


class FullReportResponse(BaseModel):
    """
    Validates data when returning the complete report profile to the frontend.
    """
    id: int
    keyword: str
    created_at: datetime
    report_data: str  # The raw JSON string parsed back to the dashboard UI
    competitor_urls: str
    status: str

    class Config:
        from_attributes = True