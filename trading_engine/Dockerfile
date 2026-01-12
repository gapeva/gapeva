FROM python:3.11-slim

WORKDIR /app

# 1. Install Bot Dependencies
COPY trading_engine/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy the TRADING ENGINE code
COPY trading_engine/ /app/trading_engine/

# 3. Copy the BACKEND code (So the bot can import 'backend.app...')
COPY backend/ /app/backend/

# 4. Set PYTHONPATH so python knows where to look
ENV PYTHONPATH="${PYTHONPATH}:/app"

# 5. Run the bot
CMD ["python", "trading_engine/bot.py"]
