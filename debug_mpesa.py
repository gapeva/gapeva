import os
import sys
import asyncio
from dotenv import load_dotenv

# Add backend directory to path so we can import app modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))

from app.mpesa import MpesaClient

async def main():
    print("Environment M-Pesa Keys:")
    print(f"Key: {os.getenv('MPESA_CONSUMER_KEY')}")
    print(f"Secret: {os.getenv('MPESA_CONSUMER_SECRET')[:5]}...")
    print(f"Callback URL: {os.getenv('MPESA_CALLBACK_URL')}")

    try:
        print("\nInitializing MpesaClient...")
        client = MpesaClient()
        
        print("Getting Access Token...")
        token = await client.get_access_token()
        print(f"Access Token retrieved: {token[:10]}...")
        
        # Test phone number (use a valid Kenyan format for testing)
        # Sandbox often requires registered numbers, but let's try a standard one
        phone = "254700000000"
        amount = 1
        
        print(f"\nInitiating STK Push to {phone} for {amount} KES...")
        response = await client.stk_push(phone, amount)
        print("\nSTK Push API Response:")
        import json
        print(json.dumps(response, indent=2))

    except Exception as e:
        print("\nCaught Exception:")
        print(e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
