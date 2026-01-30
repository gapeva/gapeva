from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Numeric, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# We use Numeric(18, 2) for currency to ensure 2 decimal places precision 

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)  # Mandatory Full Name [cite: 67]
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)      # Mandatory Phone [cite: 67]
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to Wallet
    wallet = relationship("Wallet", back_populates="user", uselist=False)

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Dual-Balance Ledger 
    # wallet_balance: Cash held in fiat/stable (Safe) [cite: 54]
    wallet_balance = Column(Numeric(18, 2), default=0.00) 
    
    # trading_balance: Capital allocated to the AI Agent (Active) [cite: 56]
    trading_balance = Column(Numeric(18, 2), default=0.00)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="wallet")

# ... (existing User and Wallet classes)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    reference = Column(String, unique=True, index=True) # Paystack Reference
    amount = Column(Numeric(18, 2), nullable=False)
    status = Column(String, default="pending") # pending, success, failed
    type = Column(String, default="deposit")
    payment_method = Column(String, default="paystack") # paystack
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
