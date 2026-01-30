import httpx 
import os
import time
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Request
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal
from app import auth, models, database

router = APIRouter(tags=["Wallet"])

# --- SECURITY: Load Paystack Key from Environment Variables ---
# This ensures your real money keys are never written in the code.
PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")

class DepositRequest(BaseModel):
    amount: Decimal = Field(..., gt=0, decimal_places=2)

class PaymentVerification(BaseModel):
    reference: str

class WithdrawalRequest(BaseModel):
    amount: Decimal = Field(..., gt=0, decimal_places=2)

class AllocationRequest(BaseModel):
    amount: Decimal = Field(..., gt=0, decimal_places=2)

@router.get("/")
async def get_wallet(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Fetch the current user's wallet balances.
    """
    result = await db.execute(select(models.Wallet).where(models.Wallet.user_id == current_user.id))
    wallet = result.scalars().first()
    
    if not wallet:
        # Create wallet if it doesn't exist yet
        wallet = models.Wallet(user_id=current_user.id, wallet_balance=0.00, trading_balance=0.00)
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)
        
    return wallet

@router.post("/validate-deposit")
async def validate_deposit_intent(
    deposit: DepositRequest, 
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Core Logic: Enforces the $3.00 Minimum Deposit.
    This runs BEFORE we send data to Paystack.
    """
    MIN_DEPOSIT = Decimal("3.00")
    
    if deposit.amount < MIN_DEPOSIT:
        raise HTTPException(
            status_code=400, 
            detail=f"Minimum deposit requirement not met. Required: ${MIN_DEPOSIT} USD."
        )
    
    return {"status": "valid", "message": "Deposit amount authorized."}

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
    # Safety Check: Ensure the server has the key before proceeding
    if not PAYSTACK_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Server misconfiguration: Payment key missing in environment variables.")

    # A. Call Paystack API to verify
    headers = {"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"https://api.paystack.co/transaction/verify/{payment.reference}", headers=headers)
    
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Verification failed with payment provider")
    
    data = resp.json().get('data', {})
    
    # B. Security Checks
    if data.get('status') != 'success':
        raise HTTPException(status_code=400, detail="Transaction was not successful")
        
    # Paystack returns amount in kobo (cents). Convert to dollars/main currency.
    # We assume 1 Unit = 1 USD for simplicity.
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
    wallet_result = await db.execute(select(models.Wallet).where(models.Wallet.user_id == current_user.id))
    wallet = wallet_result.scalars().first()
    
    # Ensure wallet exists (defensive coding)
    if not wallet:
        # Should technically never happen if signup flow works, but safe to check
        wallet = models.Wallet(user_id=current_user.id, wallet_balance=0.00, trading_balance=0.00)
        db.add(wallet)

    wallet.wallet_balance += amount_paid
    
    await db.commit()
    
    return {"status": "success", "new_balance": wallet.wallet_balance}

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

    # 2. Calculate Fee (35% on withdrawal amount as per current logic)
    FEE_PERCENT = Decimal("0.35")
    fee_amount = req.amount * FEE_PERCENT
    net_amount = req.amount - fee_amount

    # 3. Deduct from Wallet
    wallet.wallet_balance -= req.amount
    
    # 4. Record Transaction
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

@router.post("/allocate")
async def allocate_funds(
    req: AllocationRequest,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Move funds from Wallet Balance (Safe) to Trading Balance (Risk).
    """
    result = await db.execute(select(models.Wallet).where(models.Wallet.user_id == current_user.id))
    wallet = result.scalars().first()

    if not wallet or wallet.wallet_balance < req.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds in Safe Wallet")

    wallet.wallet_balance -= req.amount
    wallet.trading_balance += req.amount
    
    # Log it
    memo = f"Allocated to Trading Strategy"
    # Ideally logging this as a transaction too, simplified for now
    
    await db.commit()
    await db.refresh(wallet)
    return {"status": "success", "wallet_balance": wallet.wallet_balance, "trading_balance": wallet.trading_balance}

@router.post("/deallocate")
async def deallocate_funds(
    req: AllocationRequest,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Move funds from Trading Balance (Risk) to Wallet Balance (Safe).
    """
    result = await db.execute(select(models.Wallet).where(models.Wallet.user_id == current_user.id))
    wallet = result.scalars().first()

    if not wallet or wallet.trading_balance < req.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds in Trading Account")

    wallet.trading_balance -= req.amount
    wallet.wallet_balance += req.amount
    
    await db.commit()
    await db.refresh(wallet)
    return {"status": "success", "wallet_balance": wallet.wallet_balance, "trading_balance": wallet.trading_balance}
