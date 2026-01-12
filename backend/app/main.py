import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_routes, wallet_routes
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

# --- ROBUST CORS CONFIGURATION (THE FIX) ---
# 1. Get variable from Environment
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")

# 2. Hardcoded Localhost for Development
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# 3. Dynamic Parsing (Fixes trailing slashes/spaces automatically)
if allowed_origins_env:
    raw_origins = allowed_origins_env.split(",")
    for origin in raw_origins:
        # CRITICAL FIX: .strip() removes spaces, .rstrip("/") removes trailing slashes
        clean_origin = origin.strip().rstrip("/") 
        if clean_origin:
            origins.append(clean_origin)

print(f"✅ FINAL CORS ORIGINS: {origins}") # Check this in Digital Ocean Runtime Logs!

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ---
app.include_router(auth_routes.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(wallet_routes.router, prefix="/api/v1/wallets", tags=["Wallets"])

@app.get("/")
def read_root():
    return {"status": "Gapeva Protocol Online", "system": "Nominal"}
