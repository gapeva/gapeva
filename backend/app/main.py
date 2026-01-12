from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth_routes
from contextlib import asynccontextmanager

# Lifecycle Manager: Creates DB tables when app starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        # Create all tables defined in models.py (User, Wallet)
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="Gapeva Protocol API",
    description="Elite Financial Institutional API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Security: Allow Frontend to communicate
origins = [
    "http://localhost:5173", # Vite Default Port
    "http://localhost:3000",
    "https://gapeva.vercel.app",
    #"https://gapeva.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the Authentication Router
app.include_router(auth_routes.router, prefix="/auth")

@app.get("/")
def read_root():
    return {"status": "Gapeva Protocol Online", "system": "Nominal"}
