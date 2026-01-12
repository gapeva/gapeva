from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm
from app import schemas, models, auth, database

router = APIRouter(tags=["Authentication"])

@router.post("/signup", response_model=schemas.UserResponse)
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(database.get_db)):
    # 1. Check if email exists
    result = await db.execute(select(models.User).where(models.User.email == user.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Create User
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        hashed_password=hashed_password
    )
    db.add(new_user)
    await db.flush() # Flush to get the new_user.id for the wallet

    # 3. Initialize the Dual-Balance Wallet (Ledger)
    new_wallet = models.Wallet(
        user_id=new_user.id,
        wallet_balance=0.00,
        trading_balance=0.00
    )
    db.add(new_wallet)
    
    await db.commit()
    await db.refresh(new_user)

    # --- THE FIX: Explicitly map fields to match UserResponse Schema ---
    return {
        "id": new_user.id,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "phone": new_user.phone,
        "is_active": new_user.is_active,
        "wallet_balance": new_wallet.wallet_balance,
        "trading_balance": new_wallet.trading_balance
    }

# ... (Keep the rest of the file, specifically the login function, as is)
@router.post("/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.User).where(models.User.email == form_data.username))
    user = result.scalars().first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
