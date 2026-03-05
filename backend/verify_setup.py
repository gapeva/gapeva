import sys
import os

print("--- Verifying 'requests' module ---")
try:
    import requests
    print("SUCCESS: 'requests' module found.")
except ImportError:
    print("ERROR: 'requests' module NOT found.")

print("\n--- Verifying database schema ---")
try:
    from sqlalchemy import create_engine, inspect
    from app.database import Base # Ensure app is in path
    
    # Add parent directory to path to import app
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    from app.database import DATABASE_URL
    
    # Handle relative path for sqlite
    if DATABASE_URL.startswith("sqlite:///./"):
        db_path = os.path.join(os.getcwd(), "backend", "gapeva.db")
        DATABASE_URL = f"sqlite:///{db_path}"
    
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    
    if "transactions" in inspector.get_table_names():
        columns = [c["name"] for c in inspector.get_columns("transactions")]
        print(f"Transactions table columns: {columns}")
        
        required_columns = ["checkout_request_id", "merchant_request_id", "phone_number"]
        missing = [c for c in required_columns if c not in columns]
        
        if missing:
            print(f"ERROR: Missing columns in 'transactions' table: {missing}")
        else:
            print("SUCCESS: 'transactions' table has all required M-Pesa columns.")
    else:
        print("ERROR: 'transactions' table not found.")

except Exception as e:
    print(f"Database verification failed: {e}")
