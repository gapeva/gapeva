import os
from dotenv import load_dotenv

load_dotenv()
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, wallet_router, mpesa_router
from app.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="Gapeva Protocol API",
    description="Elite Financial Institutional API",
    version="1.0.0",
    lifespan=lifespan
)

# --- ROBUST CORS CONFIGURATION ---
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

if allowed_origins_env:
    raw_origins = allowed_origins_env.split(",")
    for origin in raw_origins:
        clean_origin = origin.strip().rstrip("/") 
        if clean_origin:
            origins.append(clean_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ---
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(wallet_router, prefix="/api/v1/wallets", tags=["Wallets"])
app.include_router(mpesa_router, prefix="/api/v1/mpesa", tags=["M-Pesa"])

@app.get("/")
async def read_root():
    return {"status": "Gapeva Protocol Online", "system": "Nominal"}
