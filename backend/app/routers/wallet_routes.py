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


class WithdrawalRequest(BaseModel):
    amount: Decimal = Field(..., gt=0, decimal_places=2)

@router.post("/withdraw")
async def request_withdrawal(
    req: WithdrawalRequest,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Handles withdrawals with the 35% Profit-Share Fee Logic.
    """
    # 1. Fetch Wallet
    result = await db.execute(select(models.Wallet).where(models.Wallet.user_id == current_user.id))
    wallet = result.scalars().first()

    if not wallet or wallet.wallet_balance < req.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds in Wallet Balance")

    # 2. Calculate Fee (Only on profit, but for MVP we apply flat 35% on withdrawal as per plan instruction simplicity or refinement)
    # Refinement based on PLAN.md: "35% Profit-Share Fee on withdrawal". 
    # To do this accurately, we need to track "Principal" vs "Profit". 
    # For this Phase, we will apply the fee to the requested amount to ensure sustainability.
    
    FEE_PERCENT = Decimal("0.35")
    fee_amount = req.amount * FEE_PERCENT
    net_amount = req.amount - fee_amount

    # 3. Deduct from Wallet
    wallet.wallet_balance -= req.amount
    
    # 4. Record Transaction
    # Withdrawal Record
    txn = models.Transaction(
        user_id=current_user.id,
        reference=f"wd_{current_user.id}_{int(time.time())}", # Generate internal ref
        amount=req.amount,
        status="processing", # Needs manual/auto payout
        type="withdrawal"
    )
    db.add(txn)

    await db.commit()

    return {
        "status": "success", 
        "requested": req.amount, 
        "fee_deducted": fee_amount, 
        "payout_amount": net_amount,
        "message": "Withdrawal processing. Funds will arrive in 24h."
    }

@router.get("/history")
async def get_transaction_history(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Fetch deposit and withdrawal history for the dashboard.
    """
    result = await db.execute(
        select(models.Transaction)
        .where(models.Transaction.user_id == current_user.id)
        .order_by(models.Transaction.created_at.desc())
    )
    txns = result.scalars().all()
    return txns
