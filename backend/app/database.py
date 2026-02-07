import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Get DB URL & Ensure Async Driver
# We default to sqlite+aiosqlite for local async support
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./gapeva.db")

# 2. Force Async Drivers if missing (Auto-fix logic)
# If the user provides a standard URL, we upgrade it to async automatically
if "sqlite" in DATABASE_URL and "+aiosqlite" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("sqlite://", "sqlite+aiosqlite://")

if "postgresql" in DATABASE_URL and "+asyncpg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

print(f"⚡ Database Mode: ASYNC | URL: {DATABASE_URL}")

# 3. Create Engine (ASYNCHRONOUS)
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True
)

# 4. Async Session Factory
# This is what allows your routers to use 'await db.execute(...)'
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

Base = declarative_base()

# 5. Dependency
# This function yields an AsyncSession, fixing the error in your routers
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
