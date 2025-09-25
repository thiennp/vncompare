#!/bin/bash

# Simple API Endpoints Testing Script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="http://localhost:3004"
API_BASE="$BASE_URL/api"
V1_API_BASE="$API_BASE/v1"

PASSED=0
FAILED=0
WARNINGS=0

test_endpoint() {
    local method=$1
    local url=$2
    local expected_status=$3
    local description=$4
    local data=$5
    
    echo -n "Testing $method $url... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$url" -H "Accept: application/json" 2>/dev/null)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$url" \
            -H "Accept: application/json" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} - $description (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} - $description (Expected HTTP $expected_status, got $response)"
        ((FAILED++))
    fi
}

echo -e "${BLUE}🚀 API Endpoints Testing${NC}"
echo "================================"

# Test server
echo -e "\n${BLUE}📡 Server Status${NC}"
test_endpoint "GET" "$BASE_URL" "200" "Server is running"

# Test V1 API endpoints
echo -e "\n${BLUE}🔍 V1 API Endpoints${NC}"
test_endpoint "GET" "$V1_API_BASE/dashboard/metrics" "200" "Dashboard Metrics"
test_endpoint "GET" "$V1_API_BASE/categories" "200" "Categories"
test_endpoint "GET" "$V1_API_BASE/suppliers" "200" "Suppliers"
test_endpoint "GET" "$V1_API_BASE/products/featured" "200" "Featured Products"

# Test regular API endpoints
echo -e "\n${BLUE}📦 Regular API Endpoints${NC}"
test_endpoint "GET" "$API_BASE/products" "200" "Products List"

# Test auth required endpoints
echo -e "\n${BLUE}🔐 Auth Required Endpoints${NC}"
test_endpoint "GET" "$API_BASE/orders" "400" "Orders (Auth Required)"
test_endpoint "GET" "$API_BASE/cart" "400" "Cart (Auth Required)"
test_endpoint "GET" "$API_BASE/users/addresses" "400" "User Addresses (Auth Required)"

# Test POST endpoints
echo -e "\n${BLUE}📝 POST Endpoints${NC}"
test_endpoint "POST" "$API_BASE/newsletter/subscribe" "200" "Newsletter Subscribe" '{"email": "test@example.com"}'
test_endpoint "POST" "$API_BASE/coverage/calculate" "400" "Coverage Calculate (Missing Params)" '{"area": 100}'
test_endpoint "POST" "$API_BASE/shipping/calculate" "400" "Shipping Calculate (Missing Params)" '{"weight": 10}'

# Test 404 endpoints
echo -e "\n${BLUE}❌ 404 Endpoints${NC}"
test_endpoint "GET" "$V1_API_BASE/products" "404" "V1 Products (Should be 404)"
test_endpoint "GET" "$API_BASE/nonexistent" "404" "Non-existent Endpoint"

echo -e "\n${BLUE}📊 Summary${NC}"
echo "================"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}💥 $FAILED tests failed!${NC}"
    exit 1
fi
