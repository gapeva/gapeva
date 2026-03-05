from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal
from app import auth, models, database
from app.mpesa import MpesaClient
from pydantic import BaseModel
import logging
import json

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(tags=["M-Pesa"])
mpesa_client = MpesaClient()

class StkPushRequest(BaseModel):
    phone_number: str
    amount: Decimal

@router.post("/stkpush")
async def initiate_stk_push(
    data: StkPushRequest,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    logger.info(f"STK Push Request: User {current_user.id}, Phone {data.phone_number}, Amount {data.amount}")
    
    try:
        response = await mpesa_client.stk_push(
            phone_number=data.phone_number,
            amount=data.amount
        )
        
        logger.info(f"STK Push API response: {response}")
        
        if response.get("ResponseCode") == "0":
            # Success initiation
            checkout_request_id = response.get("CheckoutRequestID")
            merchant_request_id = response.get("MerchantRequestID")
            
            # Create a pending transaction
            new_txn = models.Transaction(
                user_id=current_user.id,
                reference=checkout_request_id,
                amount=data.amount,
                status="pending",
                type="deposit",
                payment_method="mpesa",
                checkout_request_id=checkout_request_id,
                merchant_request_id=merchant_request_id,
                phone_number=data.phone_number
            )
            db.add(new_txn)
            await db.commit()
            
            logger.info(f"Transaction recorded: {checkout_request_id} for user {current_user.id}")
            
            return {
                "status": "success",
                "message": "STK Push initiated successfully. Please check your phone.",
                "checkout_request_id": checkout_request_id
            }
        else:
            # Handle specific error cases from Daraja
            error_msg = response.get("errorMessage") or response.get("ResponseDescription") or "Failed to initiate STK Push"
            error_code = response.get("errorCode") or response.get("ResponseCode")
            
            logger.error(f"STK Push Initiation Failed: {error_code} - {error_msg}")
            
            return {
                "status": "error",
                "message": f"M-Pesa Error: {error_msg}",
                "detail": response
            }
            
    except Exception as e:
        logger.exception("Unexpected error during STK Push initiation")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/callback")
async def mpesa_callback(request: Request, db: AsyncSession = Depends(database.get_db)):
    try:
        data = await request.json()
        logger.info(f"M-Pesa Callback Received: {json.dumps(data)}")
    except Exception as e:
        logger.error(f"Failed to parse callback JSON: {str(e)}")
        return {"ResultCode": 1, "ResultDesc": "Invalid JSON"}
    
    try:
        stk_callback = data.get("Body", {}).get("stkCallback", {})
        result_code = stk_callback.get("ResultCode")
        result_desc = stk_callback.get("ResultDesc")
        checkout_request_id = stk_callback.get("CheckoutRequestID")
        
        if not checkout_request_id:
            logger.error("Callback missing CheckoutRequestID")
            return {"ResultCode": 1, "ResultDesc": "Missing CheckoutRequestID"}
            
        # Find the transaction
        result = await db.execute(
            select(models.Transaction).where(models.Transaction.checkout_request_id == checkout_request_id)
        )
        transaction = result.scalars().first()
        
        if not transaction:
            logger.error(f"Transaction not found for CheckoutRequestID: {checkout_request_id}")
            # We return success to Safaricom to stop retries, even if we can't find it
            return {"ResultCode": 0, "ResultDesc": "Transaction not found on our end"}

        if result_code == 0:
            # Payment Successful
            logger.info(f"STK Push Success: {checkout_request_id} for transaction {transaction.id}")
            transaction.status = "success"
            
            # Extract Metadata
            callback_metadata = stk_callback.get("CallbackMetadata", {}).get("Item", [])
            for item in callback_metadata:
                name = item.get("Name")
                value = item.get("Value")
                if name == "MpesaReceiptNumber":
                    transaction.mpesa_receipt_number = value
                elif name == "Amount":
                    # Optionally verify amount matches
                    pass
            
            # Update User Wallet - Ensure we have the user's wallet
            wallet_result = await db.execute(
                select(models.Wallet).where(models.Wallet.user_id == transaction.user_id)
            )
            wallet = wallet_result.scalars().first()
            if wallet:
                old_balance = wallet.wallet_balance
                wallet.wallet_balance += transaction.amount
                logger.info(f"Updated wallet for user {transaction.user_id}: {old_balance} -> {wallet.wallet_balance}")
            else:
                logger.error(f"Wallet not found for user {transaction.user_id}")
            
            await db.commit()
            return {"ResultCode": 0, "ResultDesc": "Success"}
        else:
            # Payment Failed or Cancelled
            logger.warning(f"STK Push Failed: {checkout_request_id}, Code: {result_code}, Desc: {result_desc}")
            transaction.status = "failed"
            transaction.error_message = result_desc
            await db.commit()
            return {"ResultCode": 0, "ResultDesc": "Failure Accepted"}
            
    except Exception as e:
        logger.exception("Error processing M-Pesa callback")
        return {"ResultCode": 1, "ResultDesc": f"Internal Error: {str(e)}"}
