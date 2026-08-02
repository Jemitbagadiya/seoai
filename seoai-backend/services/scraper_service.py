import asyncio
import httpx
import trafilatura
from bs4 import BeautifulSoup
import re

async def fetch_and_parse(url: str) -> dict:
    """
    Fetches a URL with a 10-second timeout, extracting clean text, headings, word count, and FAQs.
    """
    try:
        # Use an async HTTP client with a strict timeout
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, follow_redirects=True)
            response.raise_for_status()
            html = response.text

            # 1. Extract clean body text and calculate word count
            text = trafilatura.extract(html)
            word_count = len(text.split()) if text else 0

            soup = BeautifulSoup(html, "html.parser")
            
            # 2. Extract heading structure (H1, H2, H3)
            headings = []
            for tag in soup.find_all(['h1', 'h2', 'h3']):
                headings.append({
                    "level": tag.name.upper(),
                    "text": tag.get_text(strip=True)
                })

            # 3. Detect FAQ sections via Schema Markup or Heading text matches
            faqs = []
            schema_scripts = soup.find_all('script', type='application/ld+json')
            for script in schema_scripts:
                if script.string and "FAQPage" in script.string:
                    faqs.append("FAQ Schema Markup detected")

            for h in headings:
                if re.search(r'faq|frequently asked', h['text'], re.IGNORECASE):
                    faqs.append(h['text'])

            return {
                "success": True,
                "url": url,
                "title": soup.title.string if soup.title else "",
                "headings": headings,
                "word_count": word_count,
                "faqs": faqs
            }
            
    except Exception as e:
        # Soft failure: log error, skip URL, and return success=False without crashing
        print(f"Failed to scrape {url}: {e}")
        return {"success": False, "url": url}

async def scrape_urls(urls: list) -> list:
    """
    Scrapes a list of URLs concurrently for maximum performance.
    """
    tasks = [fetch_and_parse(url) for url in urls]
    # Wait for all async scraping tasks to finish simultaneously
    return await asyncio.gather(*tasks)