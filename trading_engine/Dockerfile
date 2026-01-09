FROM python:3.12-slim

WORKDIR /app

# Copy requirements specific to the bot
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the bot code
COPY . .

# We also need access to the backend models for the "Global Pool" check
# In production, we might package shared code, but for now we mount/copy it.
# (Note: In the Digital Ocean setup, we will handle pathing carefully)

CMD ["python", "bot.py"]
