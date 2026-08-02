import os
import asyncio
from serpapi import GoogleSearch

async def fetch_serp_results(keyword: str) -> list:
    """
    Calls SerpAPI to fetch the top 10 Google organic results.
    """
    api_key = os.getenv("SERPAPI_KEY")
    if not api_key:
        raise ValueError("SERPAPI_KEY is missing from .env file.")

    params = {
        "q": keyword,
        "engine": "google",
        "num": 10,
        "api_key": api_key
    }

    # Run the synchronous SerpAPI request in a thread pool to avoid blocking FastAPI
    def get_results():
        search = GoogleSearch(params)
        return search.get_dict()

    try:
        results = await asyncio.to_thread(get_results)
    except Exception as e:
        raise Exception(f"SerpAPI connection failed: {str(e)}")

    organic_results = results.get("organic_results", [])
    if not organic_results:
        raise Exception("No organic results found.")

    # Return structured list of URLs with titles and snippets
    clean_results = []
    for result in organic_results:
        clean_results.append({
            "url": result.get("link"),
            "title": result.get("title", ""),
            "snippet": result.get("snippet", "")
        })
        
    return clean_results