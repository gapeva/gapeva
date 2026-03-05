
import os
import sys
from decimal import Decimal

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.database import SessionLocal
from app.models import Transaction, User

db = SessionLocal()

try:
    # Get a user (assuming user ID 1 exists, or just pick first)
    user = db.query(User).first()
    if not user:
        print("No user found, creating dummy user for test...")
        user = User(full_name="Test User", email="test@example.com", phone="254700000000", hashed_password="hashedpassword")
        db.add(user)
        db.commit()
        db.refresh(user)

    print(f"Using user: {user.email} (ID: {user.id})")

    # Create a transaction with new fields
    tx = Transaction(
        user_id=user.id,
        reference="test_ref_" + str(os.urandom(4).hex()),
        amount=Decimal("100.00"),
        status="pending",
        type="deposit",
        payment_method="mpesa",
        checkout_request_id="ws_CO_TEST_12345",
        merchant_request_id="MERCHANT_REQUEST_ID_123",
        phone_number="254700000000"
    )
    
    db.add(tx)
    db.commit()
    print("Transaction created successfully with new schema columns!")

except Exception as e:
    print(f"Failed to create transaction: {e}")
    db.rollback()
finally:
    db.close()
