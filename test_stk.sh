#!/bin/bash

# Configuration
CONSUMER_KEY="bzhjwu71xAZ7h1SeNFFvY69lmbRRG8rOA3prrApELHg4GV06"
CONSUMER_SECRET="vlaAVeS94pgWT5Pd7PYcGyC9ZEA32FVFSLNC9JICqMV15DERvONXxu4EvyEq69iu"
SHORTCODE="174379"
PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
PHONE="254700000000"
CALLBACK="https://webhook.site/dummy"

# 1. Get Access Token
echo "Fetching Access Token..."
TOKEN_RESPONSE=$(curl -s -X GET "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials" -u "$CONSUMER_KEY:$CONSUMER_SECRET")
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')
echo "Token: $ACCESS_TOKEN"

# 2. Generate Password and Timestamp
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
PASSWORD=$(echo -n "${SHORTCODE}${PASSKEY}${TIMESTAMP}" | base64)

echo "Timestamp: $TIMESTAMP"
echo "Password: $PASSWORD"

# 3. Initiate STK Push
echo "Initiating STK Push..."
curl -X POST "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"BusinessShortCode\": \"$SHORTCODE\",
    \"Password\": \"$PASSWORD\",
    \"Timestamp\": \"$TIMESTAMP\",
    \"TransactionType\": \"CustomerPayBillOnline\",
    \"Amount\": \"1\",
    \"PartyA\": \"$PHONE\",
    \"PartyB\": \"$SHORTCODE\",
    \"PhoneNumber\": \"$PHONE\",
    \"CallBackURL\": \"$CALLBACK\",
    \"AccountReference\": \"TestPayment\",
    \"TransactionDesc\": \"Testing STK Push\"
  }"
