import os  # <--- CRITICAL FIX: Prevents "NameError: name 'os' is not defined"
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Only import routers that actually exist in your codebase
from app.routers import auth_routes, wallet_routes 
from app.database import engine, Base
from app import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="Gapeva Protocol API",
    description="Elite Financial Institutional API",
    version="1.0.0",
    lifespan=lifespan
)

# --- DYNAMIC CORS CONFIGURATION ---
# 1. Get origins from Environment Variable (Essential for Vercel)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")

# 2. Default Localhost origins for development
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# 3. Combine them
if allowed_origins_env:
    origins.extend([origin.strip() for origin in allowed_origins_env.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ---
# Note: Added /api/v1 prefix to standardise the API
app.include_router(auth_routes.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(wallet_routes.router, prefix="/api/v1/wallets", tags=["Wallets"])

@app.get("/")
def read_root():
    return {"status": "Gapeva Protocol Online", "system": "Nominal"}
