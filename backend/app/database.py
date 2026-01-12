import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Get DB URL from Environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./gapeva.db")

# 2. Configure connection arguments (default empty)
connect_args = {}

# 3. Fix for DigitalOcean & Asyncpg compatibility
if "postgres" in DATABASE_URL:
    # A. Ensure correct protocol for async driver (postgresql+asyncpg://)
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://") and "+asyncpg" not in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

    # B. Handle SSL Driver Conflict
    # The 'psycopg2' driver (used by bot) NEEDS '?sslmode=require' in the URL.
    # The 'asyncpg' driver (used here) CRASHES if it sees '?sslmode=require'.
    # We strip it from the string and pass it as a strictly typed argument instead.
    if "sslmode=" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("?sslmode=require", "").replace("&sslmode=require", "")
        DATABASE_URL = DATABASE_URL.replace("?sslmode=prefer", "").replace("&sslmode=prefer", "")
        
        # Pass SSL requirement via connect_args for asyncpg
        connect_args = {"ssl": "require"}

# 4. Create Engine with the fixed URL and arguments
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
