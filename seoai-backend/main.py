from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from database import engine
from models import report

# Load environment variables FIRST before any modules that might need them
load_dotenv()

# Import the routers we just built
from routers import analyze, reports

# 1. Initialize the FastAPI app
app = FastAPI(
    title="AI-Powered SEO Content Brief Generator",
    version="1.0"
)

# 2. CORS Configuration (Strict requirement from SRS Section 3.5)
# Gets the FRONTEND_URL from .env, defaults to localhost:3000 if not found
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],              # Allows dev (localhost:3000) and production Vercel URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Explicitly defined in SRS
    allow_headers=["Content-Type", "Authorization"], # Explicitly defined in SRS
)

# 3. Register the Routers
app.include_router(analyze.router)
app.include_router(reports.router)

# Optional: A simple root endpoint to check if the server is running
@app.get("/")
def read_root():
    return {"message": "SEO AI Backend is up and running!"}

report.Base.metadata.create_all(bind=engine)