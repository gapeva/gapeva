from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app import schemas, models, auth, database
from pydantic import BaseModel

router = APIRouter(tags=["Authentication"])

# -------------------------------
# Pydantic schema for login JSON
# -------------------------------
class LoginRequest(BaseModel):
    email: str
    password: str

# -------------------------------
# SIGNUP
# -------------------------------
@router.post("/signup", response_model=schemas.UserResponse)
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(database.get_db)):
    # 1. Check if email exists
    result = await db.execute(select(models.User).where(models.User.email == user.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash password and create User
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        hashed_password=hashed_password
    )
    db.add(new_user)
    await db.flush()  # flush to get new_user.id for wallet

    # 3. Initialize Dual-Balance Wallet
    new_wallet = models.Wallet(
        user_id=new_user.id,
        wallet_balance=0.00,
        trading_balance=0.00
    )
    db.add(new_wallet)
    
    await db.commit()
    await db.refresh(new_user)

    # Return mapped fields for UserResponse
    return {
        "id": new_user.id,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "phone": new_user.phone,
        "is_active": new_user.is_active,
        "wallet_balance": new_wallet.wallet_balance,
        "trading_balance": new_wallet.trading_balance
    }

# -------------------------------
# LOGIN (JSON payload)
# -------------------------------
@router.post("/login", response_model=schemas.Token)
async def login(user: LoginRequest, db: AsyncSession = Depends(database.get_db)):
    # 1. Lookup user by email
    result = await db.execute(select(models.User).where(models.User.email == user.email))
    db_user = result.scalars().first()

    # 2. Verify password
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Generate access token
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# -------------------------------
# GET CURRENT USER PROFILE (THE FIX)
# -------------------------------
@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(database.get_db)
):
    """
    Fetch the current authenticated user + their wallet balance.
    """
    # 1. Fetch the user's wallet
    result = await db.execute(select(models.Wallet).where(models.Wallet.user_id == current_user.id))
    wallet = result.scalars().first()

    # 2. Return combined data
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "phone": current_user.phone,
        "is_active": current_user.is_active,
        "wallet_balance": wallet.wallet_balance if wallet else 0.00,
        "trading_balance": wallet.trading_balance if wallet else 0.00
    }