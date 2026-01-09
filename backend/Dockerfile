# Use Python 3.12 as the base image [cite: 50]
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for PostgreSQL adapter)
RUN apt-get update && apt-get install -y gcc libpq-dev

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose port 8000
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
