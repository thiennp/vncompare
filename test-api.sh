#!/bin/bash

# Test VNCompare API endpoints
echo "🧪 Testing VNCompare API..."

API_URL="https://api.vncompare.com/api/v1"

echo "📡 Testing API availability..."
curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" || echo "API not available"

echo ""
echo "🔐 Testing authentication endpoint..."
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"nguyenphongthien@gmail.com","password":"Kimtuoc2"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "👥 Testing users endpoint..."
curl -X GET "$API_URL/users?limit=5" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "📊 Testing analytics endpoint..."
curl -X GET "$API_URL/analytics/dashboard" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "✅ API testing completed!"
