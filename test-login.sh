#!/bin/bash

# Test the login flow locally (requires server to be running)

echo "Testing Ases Kahraba Login Flow"
echo "================================"
echo ""

# Check if server is running
if ! lsof -ti:3000 > /dev/null; then
    echo "❌ Dev server not running on port 3000"
    echo ""
    echo "To start the server, you need Node.js installed:"
    echo "1. Download from: https://nodejs.org/"
    echo "2. Run: npm run dev"
    echo "3. Then run this script again"
    exit 1
fi

echo "✓ Server is running on port 3000"
echo ""

# Test login endpoint
echo "Testing POST /api/login/local..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/login/local \
  -H "Content-Type: application/json" \
  -d '{"email":"bishoy@aseskahraba.com","password":"xcO2s9ol"}' \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "Response: $BODY"
echo "Status Code: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Login successful!"
    echo ""
    echo "Testing GET /api/auth/user..."
    USER=$(curl -s -b "" http://localhost:3000/api/auth/user)
    echo "User: $USER"
else
    echo "❌ Login failed (HTTP $HTTP_CODE)"
    echo ""
    echo "Common issues:"
    echo "1. Server not running - run: npm run dev"
    echo "2. Wrong credentials - check .env for ADMIN_PASSWORD"
    echo "3. Database not initialized"
fi
