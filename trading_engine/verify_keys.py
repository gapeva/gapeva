import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("BINANCE_API_KEY")
secret_key = os.getenv("BINANCE_SECRET_KEY")

print("\n🔍 Checking Keys...")

if not api_key:
    print("❌ API Key is MISSING or empty.")
else:
    print(f"✅ API Key found: Length {len(api_key)}")
    print(f"   Starts with: {api_key[:4]}...")
    print(f"   Ends with:   ...{api_key[-4:]}")

if not secret_key:
    print("❌ Secret Key is MISSING or empty.")
else:
    print(f"✅ Secret Key found: Length {len(secret_key)}")
    print(f"   Starts with: {secret_key[:4]}...")
    print(f"   Ends with:   ...{secret_key[-4:]}")

if api_key and secret_key:
    print("\n💡 If these look correct, try regenerating your API keys on Binance.")
    print("   If the length is 63 or 65 (weird numbers), check for spaces!\n")