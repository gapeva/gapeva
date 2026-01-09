# Gapeva Protocol

A luxury algorithmic trading platform that automates wealth preservation and growth using a Quantitative Agent.

## Project Structure

This is a Monorepo containing:
- **frontend/**: React 18 + Vite + Tailwind CSS (The Luxury UI)
- **backend/**: FastAPI + SQLAlchemy (The Ledger & API)
- **trading_engine/**: Python + CCXT (The Logic Bot)

## 🚀 Quick Start (Local Development)
vengence
### Prerequisites
- Node.js & npm
- Python 3.12+

### 1. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
