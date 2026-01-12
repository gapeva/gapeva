import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from decimal import Decimal

# 1. Get the same DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./gapeva.db")

# 2. Fix for Sync Connection: We need "postgresql://" (not asyncpg)
#    If the URL has "+asyncpg", we remove it for this specific file.
if "+asyncpg" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("+asyncpg", "")
#    Ensure it starts with postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_total_trading_pool():
    """
    Calculates the sum of ALL users' trading_balances.
    """
    session = SessionLocal()
    try:
        result = session.execute(text("SELECT SUM(trading_balance) FROM wallets"))
        total = result.scalar()
        return Decimal(total) if total else Decimal("0.00")
    except Exception as e:
        print(f"❌ DB Error: {e}")
        return Decimal("0.00")
    finally:
        session.close()
