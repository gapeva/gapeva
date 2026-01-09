from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from decimal import Decimal
from app import auth, models

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
