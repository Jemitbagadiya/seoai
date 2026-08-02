from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import json
from datetime import datetime, timezone

from database import get_db
from models.report import Report
from schemas.report import KeywordRequest, FullReportResponse

# Import your active service modules
from services.serp_service import fetch_serp_results
from services.scraper_service import scrape_urls
from services.gemini_service import generate_content_brief

router = APIRouter(
    prefix="/api",
    tags=["Analysis"]
)

@router.post("/analyze", response_model=FullReportResponse, status_code=status.HTTP_201_CREATED)
async def analyze_keyword(payload: KeywordRequest, db: Session = Depends(get_db)):
    """
    Core API Endpoint. Executes the full SEO analysis pipeline:
    SerpAPI -> Web Scraper -> Gemini API -> SQLite Database Save.
    """
    keyword = payload.keyword.strip()
    
    # Step 1: Fetch top 10 URLs from Google via SerpAPI
    try:
        competitor_results = await fetch_serp_results(keyword)
        urls = [res["url"] for res in competitor_results]
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to fetch search results. Please check SerpAPI key. Error: {str(e)}"
        )
        
    if not urls:
        raise HTTPException(
            status_code=400,
            detail="No search results found for this keyword. Try a different keyword."
        )

    # Step 2: Scrape headings and word counts from competitor pages
    try:
        scraped_data = await scrape_urls(urls)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Web scraping system failure: {str(e)}"
        )
        
    # Check SRS rule: minimum 3 URLs must be scraped successfully
    successful_scrapes = [d for d in scraped_data if d.get("success", False)]
    if len(successful_scrapes) < 3:
        raise HTTPException(
            status_code=422,
            detail="Could not scrape enough competitor data (minimum 3 required). Try a different keyword."
        )

    # Step 3: Send scraped data to Gemini API to get structured JSON brief
    try:
        claude_brief_json = await generate_content_brief(keyword, successful_scrapes)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service unavailable or returned malformed data. Error: {str(e)}"
        )

    # Step 4: Save the completed report to the SQLite Database
    try:
        new_report = Report(
            keyword=keyword,
            report_data=json.dumps(claude_brief_json),      # Convert dict to string for DB storage
            competitor_urls=json.dumps(urls),                # Convert list to string for DB storage
            status="completed"
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
    except Exception as e:
        # SRS Rule: Log error, but still return the report JSON to user if save fails
        db.rollback()
        print(f"Database write failed safely: {str(e)}")
        # Create a mock database object just to return data back to frontend safely
        return Report(
            id=0,
            keyword=keyword,
            created_at=datetime.now(timezone.utc),
            report_data=json.dumps(claude_brief_json),
            competitor_urls=json.dumps(urls),
            status="completed_unsaved"
        )

    return new_report