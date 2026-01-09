from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from decimal import Decimal

# Use the same database URL as your main app
# Note: For production (PostgreSQL), change 'sqlite' to 'postgresql'
DATABASE_URL = "sqlite:///./gapeva.db" 

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_total_trading_pool():
    """
    Calculates the sum of ALL users' trading_balances.
    This represents the total capital the bot is authorized to trade.
    """
    session = SessionLocal()
    try:
        # Summing the 'trading_balance' column from the 'wallets' table
        result = session.execute(text("SELECT SUM(trading_balance) FROM wallets"))
        total = result.scalar()
        return Decimal(total) if total else Decimal("0.00")
    except Exception as e:
        print(f"❌ DB Error: {e}")
        return Decimal("0.00")
    finally:
        session.close()
