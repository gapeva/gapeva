import httpx # You might need to pip install httpx
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal
from app import auth, models, database


router = APIRouter(tags=["Wallet"])

class DepositRequest(BaseModel):
    amount: Decimal = Field(..., gt=0, decimal_places=2)

@router.post("/validate-deposit")
async def validate_deposit_intent(
    deposit: DepositRequest, 
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Core Logic: Enforces the $3.00 Minimum Deposit.
    This runs BEFORE we send data to Paystack in Phase 3.
    """
    MIN_DEPOSIT = Decimal("3.00")
    
    if deposit.amount < MIN_DEPOSIT:
        raise HTTPException(
            status_code=400, 
            detail=f"Minimum deposit requirement not met. Required: ${MIN_DEPOSIT} USD."
        )
    
    return {"status": "valid", "message": "Deposit amount authorized."}

# PAYSTACK CONFIGURATION (Move to .env in production)
PAYSTACK_SECRET_KEY = "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" # REPLACE THIS WITH YOUR TEST KEY

class PaymentVerification(BaseModel):
    reference: str

@router.post("/verify-deposit")
async def verify_payment(
    payment: PaymentVerification, 
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    1. Verify transaction with Paystack API
    2. Update User's Wallet Balance
    3. Log the Transaction
    """
    
    # A. Call Paystack API to verify
    headers = {"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"https://api.paystack.co/transaction/verify/{payment.reference}", headers=headers)
    
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Verification failed with payment provider")
    
    data = resp.json()['data']
    
    # B. Security Checks
    if data['status'] != 'success':
        raise HTTPException(status_code=400, detail="Transaction was not successful")
        
    # Paystack returns amount in kobo (cents). Convert to dollars/main currency.
    # Assuming the app is USD based, but Paystack is often NGN. 
    # For this implementation, we assume 1 Unit = 1 USD for simplicity, or we treat NGN as the base.
    # If using USD on Paystack, amount is in cents.
    amount_paid = Decimal(str(data['amount'])) / 100
    
    # C. Check if reference already used (Double Spending Protection)
    existing_txn = await db.execute(select(models.Transaction).where(models.Transaction.reference == payment.reference))
    if existing_txn.scalars().first():
        raise HTTPException(status_code=400, detail="Transaction already processed")

    # D. Execute Ledger Update (Atomic Transaction)
    # 1. Create Transaction Record
    new_txn = models.Transaction(
        user_id=current_user.id,
        reference=payment.reference,
        amount=amount_paid,
        status="success",
        type="deposit"
    )
    db.add(new_txn)
    
    # 2. Credit the Wallet
    # We must fetch the wallet first
    wallet_result = await db.execute(select(models.Wallet).where(models.Wallet.user_id == current_user.id))
    wallet = wallet_result.scalars().first()
    wallet.wallet_balance += amount_paid
    
    await db.commit()
    
    return {"status": "success", "new_balance": wallet.wallet_balance}
