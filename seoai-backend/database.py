import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load the variables from your .env file
load_dotenv()

# ---------------------------------------------------------
# 1. Connection Setup
# ---------------------------------------------------------
# Read the DATABASE_URL from the environment. 
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./seo_tool.db")

# Create the SQLAlchemy engine. 
# check_same_thread: False is needed for SQLite in FastAPI.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# ---------------------------------------------------------
# 2. Session Management
# ---------------------------------------------------------
# Create a SessionLocal class. Each instance of this class will be a database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency function to use in your FastAPI routes.
# This ensures we always close sessions after use, as required by the SRS.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------------------------------------
# 3. Base Model Class
# ---------------------------------------------------------
# Your models (like in models/report.py) will inherit from this Base class.
Base = declarative_base()

# ---------------------------------------------------------
# 4. Auto-Creation Logic
# ---------------------------------------------------------
# This command automatically creates the database file and tables 
# on app startup if they don't exist.
Base.metadata.create_all(bind=engine)