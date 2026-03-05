import httpx
import base64
from datetime import datetime
import json
import os
import logging

# Ensure logging is configured to see outputs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MpesaClient:
    def __init__(self):
        self.consumer_key = os.getenv("MPESA_CONSUMER_KEY")
        self.consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
        self.business_shortcode = os.getenv("MPESA_BUSINESS_SHORT_CODE", "174379")
        self.passkey = os.getenv("MPESA_PASSKEY")
        self.env = os.getenv("MPESA_ENVIRONMENT", "sandbox")
        self.callback_url = os.getenv("MPESA_CALLBACK_URL")
        
        if self.env == "production":
            self.base_url = "https://api.safaricom.co.ke"
        else:
            self.base_url = "https://sandbox.safaricom.co.ke"
            
        # Standard timeout for Daraja API
        self.timeout = httpx.Timeout(30.0, connect=10.0)

    async def get_access_token(self):
        api_url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        logger.info(f"M-Pesa Auth: Fetching token from {api_url}")
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    api_url, 
                    auth=(self.consumer_key, self.consumer_secret)
                )
            
            logger.info(f"M-Pesa Auth Response Status: {response.status_code}")
            
            if response.status_code == 200:
                token = response.json().get("access_token")
                logger.info("M-Pesa Auth: Token retrieved successfully")
                return token
            else:
                logger.error(f"M-Pesa Auth Failed: {response.text}")
                raise Exception(f"Failed to get access token: {response.text}")
        except httpx.TimeoutException:
            logger.error("M-Pesa Auth: Request timed out")
            raise Exception("M-Pesa Auth Timeout: The server took too long to respond.")
        except Exception as e:
            logger.error(f"M-Pesa Auth Error: {str(e)}")
            raise

    def generate_password(self):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password_str = f"{self.business_shortcode}{self.passkey}{timestamp}"
        encoded_password = base64.b64encode(password_str.encode()).decode()
        return encoded_password, timestamp

    def format_phone_number(self, phone):
        """Format phone number to 2547XXXXXXXX format."""
        phone = str(phone).strip().replace(" ", "")
        if phone.startswith("+"):
            phone = phone[1:]
        
        if phone.startswith("0"):
            phone = "254" + phone[1:]
        elif phone.startswith("7") and len(phone) == 9:
            phone = "254" + phone
        elif phone.startswith("1") and len(phone) == 9: # Handling 01... numbers
            phone = "254" + phone
            
        return phone

    async def stk_push(self, phone_number, amount, account_reference="GapevaWallet", transaction_desc="Deposit"):
        logger.info(f"M-Pesa STK Push: Initiating for {phone_number} amount {amount}")
        
        try:
            access_token = await self.get_access_token()
        except Exception as e:
            return {"ResponseCode": "error", "ResponseDescription": f"Auth Failed: {str(e)}"}

        api_url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        password, timestamp = self.generate_password()
        formatted_phone = self.format_phone_number(phone_number)
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
            
        payload = {
            "BusinessShortCode": self.business_shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline", # For Paybill use "CustomerPayBillOnline", for Till use "CustomerBuyGoodsOnline"
            "Amount": int(float(amount)),
            "PartyA": formatted_phone,
            "PartyB": self.business_shortcode,
            "PhoneNumber": formatted_phone,
            "CallBackURL": self.callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }
        
        logger.info(f"M-Pesa STK Push Payload: {json.dumps(payload)}")
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(api_url, json=payload, headers=headers)
            
            logger.info(f"M-Pesa STK Push Response Status: {response.status_code}")
            logger.info(f"M-Pesa STK Push Response Body: {response.text}")
            
            return response.json()
        except httpx.TimeoutException:
            logger.error("M-Pesa STK Push: Request timed out")
            return {"ResponseCode": "timeout", "ResponseDescription": "The request to Safaricom timed out. Please try again."}
        except Exception as e:
            logger.error(f"M-Pesa STK Push Error: {str(e)}")
            return {"ResponseCode": "error", "ResponseDescription": str(e)}

