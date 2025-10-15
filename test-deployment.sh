#!/bin/bash

# Test script for Railway deployment
# Usage: ./test-deployment.sh https://your-app-name.railway.app

if [ -z "$1" ]; then
    echo "❌ Please provide the Railway URL as an argument"
    echo "Usage: ./test-deployment.sh https://your-app-name.railway.app"
    exit 1
fi

RAILWAY_URL="$1"
echo "🧪 Testing Railway deployment at: $RAILWAY_URL"
echo "=============================================="

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$RAILWAY_URL/api/health")
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo "✅ Health check passed"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "❌ Health check failed"
    echo "   Response: $HEALTH_RESPONSE"
fi

echo ""

# Test Swagger UI
echo "2. Testing Swagger UI..."
SWAGGER_RESPONSE=$(curl -s "$RAILWAY_URL/api-docs/" | head -5)
if echo "$SWAGGER_RESPONSE" | grep -q "VNCompare API Documentation"; then
    echo "✅ Swagger UI is accessible"
    echo "   Visit: $RAILWAY_URL/api-docs/"
else
    echo "❌ Swagger UI not accessible"
    echo "   Response: $SWAGGER_RESPONSE"
fi

echo ""

# Test login endpoint
echo "3. Testing login endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST "$RAILWAY_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"nguyenphongthien@gmail.com","password":"Kimtuoc2"}')

if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
    echo "✅ Login endpoint working"
    echo "   Response: $LOGIN_RESPONSE"
else
    echo "❌ Login endpoint failed"
    echo "   Response: $LOGIN_RESPONSE"
fi

echo ""

# Test users endpoint
echo "4. Testing users endpoint..."
USERS_RESPONSE=$(curl -s "$RAILWAY_URL/api/users")
if echo "$USERS_RESPONSE" | grep -q "users"; then
    echo "✅ Users endpoint working"
    echo "   Response: $USERS_RESPONSE"
else
    echo "❌ Users endpoint failed"
    echo "   Response: $USERS_RESPONSE"
fi

echo ""

# Test products endpoint
echo "5. Testing products endpoint..."
PRODUCTS_RESPONSE=$(curl -s "$RAILWAY_URL/api/products")
if echo "$PRODUCTS_RESPONSE" | grep -q "products"; then
    echo "✅ Products endpoint working"
    echo "   Response: $PRODUCTS_RESPONSE"
else
    echo "❌ Products endpoint failed"
    echo "   Response: $PRODUCTS_RESPONSE"
fi

echo ""

# Test dashboard stats
echo "6. Testing dashboard stats..."
STATS_RESPONSE=$(curl -s "$RAILWAY_URL/api/dashboard/stats")
if echo "$STATS_RESPONSE" | grep -q "totalUsers"; then
    echo "✅ Dashboard stats working"
    echo "   Response: $STATS_RESPONSE"
else
    echo "❌ Dashboard stats failed"
    echo "   Response: $STATS_RESPONSE"
fi

echo ""
echo "🎉 Testing complete!"
echo "📚 API Documentation: $RAILWAY_URL/api-docs/"
echo "🔍 Health Check: $RAILWAY_URL/api/health"
