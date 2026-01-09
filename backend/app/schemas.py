from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from decimal import Decimal

# Base Schema
class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, description="Full Legal Name")
    phone: str = Field(..., min_length=10, description="International format preferred")

# Incoming Data (Signup)
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Strong password required")

# Outgoing Data (Response) - Hides password
class UserResponse(UserBase):
    id: int
    is_active: bool
    # We return the wallet balances for the UI
    wallet_balance: Decimal = 0.00
    trading_balance: Decimal = 0.00

    class Config:
        from_attributes = True

# JWT Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str
