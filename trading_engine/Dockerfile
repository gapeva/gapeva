FROM python:3.12-slim

WORKDIR /app

# 1. Install System Dependencies
# Added 'g++' (Required to compile Pandas from source)
# Added 'git' (Required for some pip installs)
# Added 'libpq-dev' (Required for PostgreSQL)
RUN apt-get update && apt-get install -y gcc g++ libpq-dev git

# 2. Copy Requirements and Install
COPY trading_engine/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Copy Code
COPY trading_engine/ /app/trading_engine/
COPY backend/ /app/backend/

# 4. Set Path and Run
ENV PYTHONPATH="${PYTHONPATH}:/app"
CMD ["python", "trading_engine/bot.py"]
