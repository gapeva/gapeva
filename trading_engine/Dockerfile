# 1. Use Python 3.11 (The "Golden Standard" for financial libs)
FROM python:3.11-slim

WORKDIR /app

# 2. Install System Dependencies
# We keep git and compilers just in case, but likely won't need them now.
RUN apt-get update && apt-get install -y gcc g++ libpq-dev git

# 3. Copy Requirements and Install
COPY trading_engine/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy Code
# We copy the entire context so the bot can see backend/ folder
COPY trading_engine/ /app/trading_engine/
COPY backend/ /app/backend/

# 5. Set Path and Run
ENV PYTHONPATH="${PYTHONPATH}:/app"
CMD ["python", "trading_engine/bot.py"]
