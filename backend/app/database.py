import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import make_url

# 1. Get DB URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./gapeva.db")

# 2. Robust Parsing Logic for SYNC
try:
    # Handle the async sqlite driver format if present in env
    if "+aiosqlite" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("+aiosqlite", "")
    
    # Use SQLAlchemy's built-in tool to parse the URL safely
    url_obj = make_url(DATABASE_URL)

    # A. Fix Driver for Sync (Postgres+Asyncpg -> Postgresql)
    if url_obj.drivername == "postgresql+asyncpg":
        url_obj = url_obj._replace(drivername="postgresql")
    
    # Generate the final string
    DATABASE_URL = url_obj.render_as_string(hide_password=False)

except Exception as e:
    # Fallback for local SQLite or unexpected errors
    print(f"⚠️ URL Parsing Warning: {e}")

# 3. Create Engine (Synchronous)
connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL, 
    echo=True, 
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
