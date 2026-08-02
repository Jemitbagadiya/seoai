# SEO AI Backend

This is the FastAPI backend service for the AI-Powered SEO Content Brief Generator application. It automates the process of generating data-driven SEO content briefs by analyzing top competitors from Google search results.

## Key Features

- **SERP Integration**: Fetches the top 10 search results from Google using SerpAPI for any given keyword.
- **Web Scraper**: Extracts headings (H1, H2, etc.) and analyzes word count from competitor URLs using BeautifulSoup.
- **AI Content Generation**: Leverages Google's Gemini AI (e.g., `gemini-2.5-flash`) to generate structured JSON briefs based on scraped competitor data.
- **Data Persistence**: Uses SQLAlchemy and SQLite to save generated reports.
- **PDF Export**: Converts the generated SEO content briefs into downloadable PDF files.

## Project Structure

The project follows a scalable, layered architecture:

- `models/`: Database models (SQLAlchemy).
- `schemas/`: Data validation and serialization (Pydantic).
- `routers/`: API endpoints (`/api/analyze`, `/api/reports`).
- `services/`: Core background logic (Gemini, SerpAPI, Scraper, PDF services).
- `database.py`: Database connection and session setup.
- `main.py`: The FastAPI application entry point.

## Getting Started

### Prerequisites

- Python 3.8+
- [SerpAPI](https://serpapi.com/) Key
- [Google Gemini API](https://aistudio.google.com/) Key

### Installation

1. Clone the repository and navigate to the backend directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```env
   SERPAPI_KEY=your_serpapi_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=sqlite:///./seo_tool.db
   FRONTEND_URL=http://localhost:3000
   ```

### Running the Application

To start the development server, run:
```bash
uvicorn main:app --reload
```
The server will be available at `http://127.0.0.1:8000`. You can also visit `http://127.0.0.1:8000/docs` to view the interactive Swagger UI and test the API endpoints.

## API Endpoints

- **`POST /api/analyze`**: Accepts a `{ "keyword": "your keyword" }` payload. Initiates the SERP fetching, scraping, and AI analysis process.
- **`GET /api/reports`**: Fetches past generated reports from the SQLite database.
- **`GET /api/reports/{id}/pdf`**: Generates and returns a downloadable PDF version of a saved report.
