import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import make_url

# 1. Get DB URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./gapeva.db")

# 2. Connection Args container
connect_args = {}

# 3. Robust Parsing Logic
try:
    # Use SQLAlchemy's built-in tool to parse the URL safely
    url_obj = make_url(DATABASE_URL)

    # A. Fix Driver for Async (Postgres -> Postgres+Asyncpg)
    if url_obj.drivername == "postgresql":
        url_obj = url_obj._replace(drivername="postgresql+asyncpg")
    
    # B. Fix SSL Conflict (Asyncpg crashes if 'sslmode' is in the query params)
    if "sslmode" in url_obj.query:
        # Copy query params to a mutable dict
        query_dict = dict(url_obj.query)
        
        # If sslmode is on, tell asyncpg to use SSL via connect_args
        if query_dict.get("sslmode") in ["require", "prefer"]:
            connect_args = {"ssl": "require"}
        
        # Remove the offending parameter from the string
        del query_dict["sslmode"]
        
        # Reconstruct the safe URL
        url_obj = url_obj._replace(query=query_dict)
    
    # Generate the final string
    DATABASE_URL = url_obj.render_as_string(hide_password=False)

except Exception as e:
    # Fallback for local SQLite or unexpected errors
    print(f"⚠️ URL Parsing Warning: {e}")

# 4. Create Engine
engine = create_async_engine(
    DATABASE_URL, 
    echo=True, 
    connect_args=connect_args
)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
