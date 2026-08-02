from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.report import Report
from schemas.report import ReportSummaryResponse, FullReportResponse
from services.pdf_service import generate_report_pdf

router = APIRouter(
    prefix="/api",
    tags=["Reports History"]
)

@router.get("/reports", response_model=List[ReportSummaryResponse])
def get_all_reports(db: Session = Depends(get_db)):
    """
    Returns a brief summary list of all previously generated reports.
    Ordered by newest first (reverse chronological order).
    """
    # SRS Rule: Read-heavy history feature, never delete records.
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    return reports


@router.get("/reports/{report_id}", response_model=FullReportResponse)
def get_single_report(report_id: int, db: Session = Depends(get_db)):
    """
    Fetches full detailed JSON data for one specific report using its ID.
    """
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=404, 
            detail=f"Report with ID {report_id} not found."
        )
    return report


@router.get("/reports/{report_id}/pdf")
async def download_report_pdf(report_id: int, db: Session = Depends(get_db)):
    """
    Generates a clean PDF version of the report on the fly and triggers a file download.
    """
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=404, 
            detail=f"Report with ID {report_id} not found."
        )
        
    try:
        # Calls backend PDF conversion service (pdfkit or weasyprint)
        pdf_path = await generate_report_pdf(report)
        return FileResponse(
            path=pdf_path, 
            filename=f"SEO_Brief_{report.keyword.replace(' ', '_')}.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate download PDF file. Error: {str(e)}"
        )