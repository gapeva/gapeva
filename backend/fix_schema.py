
import sqlite3
import os

# Adjust path to DB
# Assuming running from project root and DB is in root or we want to fix the root one
db_path = os.path.join(os.getcwd(), 'gapeva.db')

if not os.path.exists(db_path):
    print(f"Error: Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    print("Checking 'transactions' table schema...")
    cursor.execute("PRAGMA table_info(transactions)")
    columns = [col[1] for col in cursor.fetchall()]
    
    print(f"Current columns: {columns}")

    # Add 'checkout_request_id' if missing
    if 'checkout_request_id' not in columns:
        print("Adding 'checkout_request_id' column...")
        cursor.execute("ALTER TABLE transactions ADD COLUMN checkout_request_id VARCHAR")
    else:
        print("'checkout_request_id' already exists.")

    # Add 'merchant_request_id' if missing
    if 'merchant_request_id' not in columns:
        print("Adding 'merchant_request_id' column...")
        cursor.execute("ALTER TABLE transactions ADD COLUMN merchant_request_id VARCHAR")
    else:
        print("'merchant_request_id' already exists.")

    # Add 'mpesa_receipt_number' if missing
    if 'mpesa_receipt_number' not in columns:
        print("Adding 'mpesa_receipt_number' column...")
        cursor.execute("ALTER TABLE transactions ADD COLUMN mpesa_receipt_number VARCHAR")
    else:
        print("'mpesa_receipt_number' already exists.")

    # Add 'phone_number' if missing
    if 'phone_number' not in columns:
        print("Adding 'phone_number' column...")
        cursor.execute("ALTER TABLE transactions ADD COLUMN phone_number VARCHAR")
    else:
        print("'phone_number' already exists.")
        
    conn.commit()
    print("Schema update successful.")

except Exception as e:
    print(f"Error updating schema: {e}")
    conn.rollback()

finally:
    conn.close()
