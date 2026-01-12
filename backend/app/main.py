import os  # <--- THIS WAS MISSING
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_routes, user_routes, market_data_routes, trading_routes, wallet_routes
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
# 1. Get origins from Environment Variable (for Vercel)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")

# 2. Default Localhost origins
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://gapeva.vercel.app",
    "https://gapeva.com",ga
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

app.include_router(auth_routes.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(market_data_routes.router, prefix="/api/v1/market-data", tags=["Market Data"])
app.include_router(trading_routes.router, prefix="/api/v1/trading", tags=["Trading"])
app.include_router(wallet_routes.router, prefix="/api/v1/wallets", tags=["Wallets"])

@app.get("/")
def read_root():
    return {"status": "Gapeva Protocol Online", "system": "Nominal"}
