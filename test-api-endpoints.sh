#!/bin/bash

# API Endpoints Testing Script
# This script tests all API endpoints and reports their status

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3004"
API_BASE="$BASE_URL/api"
V1_API_BASE="$API_BASE/v1"

# Test results
PASSED=0
FAILED=0
WARNINGS=0

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    local details=$3
    
    case $status in
        "PASS")
            echo -e "${GREEN}✅ PASS${NC}: $message"
            if [ ! -z "$details" ]; then
                echo -e "   $details"
            fi
            ((PASSED++))
            ;;
        "FAIL")
            echo -e "${RED}❌ FAIL${NC}: $message"
            if [ ! -z "$details" ]; then
                echo -e "   $details"
            fi
            ((FAILED++))
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  WARN${NC}: $message"
            if [ ! -z "$details" ]; then
                echo -e "   $details"
            fi
            ((WARNINGS++))
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  INFO${NC}: $message"
            ;;
    esac
}

# Function to test GET endpoint
test_get() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing GET $endpoint... "
    
    response=$(curl -s -w "\n%{http_code}" "$endpoint" -H "Accept: application/json" 2>/dev/null)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ]; then
        if [ "$http_code" = "200" ]; then
            # Check if response is valid JSON
            if echo "$body" | jq . >/dev/null 2>&1; then
                print_status "PASS" "$description" "HTTP $http_code, Valid JSON"
            else
                print_status "WARN" "$description" "HTTP $http_code, Invalid JSON"
            fi
        else
            print_status "PASS" "$description" "HTTP $http_code"
        fi
    else
        print_status "FAIL" "$description" "Expected HTTP $expected_status, got $http_code"
    fi
}

# Function to test POST endpoint
test_post() {
    local endpoint=$1
    local data=$2
    local expected_status=$3
    local description=$4
    
    echo -n "Testing POST $endpoint... "
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$endpoint" \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -d "$data" 2>/dev/null)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ]; then
        if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
            # Check if response is valid JSON
            if echo "$body" | jq . >/dev/null 2>&1; then
                print_status "PASS" "$description" "HTTP $http_code, Valid JSON"
            else
                print_status "WARN" "$description" "HTTP $http_code, Invalid JSON"
            fi
        else
            print_status "PASS" "$description" "HTTP $http_code"
        fi
    else
        print_status "FAIL" "$description" "Expected HTTP $expected_status, got $http_code"
    fi
}

# Function to test endpoint with authentication
test_auth_get() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing GET $endpoint (Auth Required)... "
    
    response=$(curl -s -w "\n%{http_code}" "$endpoint" -H "Accept: application/json" 2>/dev/null)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ]; then
        print_status "PASS" "$description" "HTTP $http_code (Auth required as expected)"
    else
        print_status "FAIL" "$description" "Expected HTTP $expected_status, got $http_code"
    fi
}

echo -e "${BLUE}🚀 Starting API Endpoints Testing${NC}"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo "API Base: $API_BASE"
echo "V1 API Base: $V1_API_BASE"
echo ""

# Test server availability
echo -e "${BLUE}📡 Testing Server Availability${NC}"
echo "----------------------------------------"
test_get "$BASE_URL" "200" "Server is running"

echo ""
echo -e "${BLUE}🔍 Testing Public API Endpoints${NC}"
echo "----------------------------------------"

# Test V1 API endpoints
test_get "$V1_API_BASE/dashboard/metrics" "200" "Dashboard Metrics"
test_get "$V1_API_BASE/categories" "200" "Categories List"
test_get "$V1_API_BASE/suppliers" "200" "Suppliers List"
test_get "$V1_API_BASE/products/featured" "200" "Featured Products"

# Test regular API endpoints
test_get "$API_BASE/products" "200" "Products List"

echo ""
echo -e "${BLUE}🔐 Testing Authentication Required Endpoints${NC}"
echo "----------------------------------------"

# Test endpoints that require authentication
test_auth_get "$API_BASE/orders" "400" "Orders List (Auth Required)"
test_auth_get "$API_BASE/cart" "400" "Cart (Auth Required)"
test_auth_get "$API_BASE/users/addresses" "400" "User Addresses (Auth Required)"

echo ""
echo -e "${BLUE}📝 Testing POST Endpoints${NC}"
echo "----------------------------------------"

# Test newsletter subscription
test_post "$API_BASE/newsletter/subscribe" '{"email": "test@example.com"}' "200" "Newsletter Subscription"

# Test coverage calculation with missing parameters
test_post "$API_BASE/coverage/calculate" '{"area": 100, "coats": 2}' "400" "Coverage Calculation (Missing Params)"

# Test shipping calculation with missing parameters
test_post "$API_BASE/shipping/calculate" '{"weight": 10, "distance": 50}' "400" "Shipping Calculation (Missing Params)"

echo ""
echo -e "${BLUE}❌ Testing Non-existent Endpoints${NC}"
echo "----------------------------------------"

# Test endpoints that should return 404
test_get "$V1_API_BASE/products" "404" "V1 Products (Should be 404)"
test_get "$API_BASE/nonexistent" "404" "Non-existent Endpoint"

echo ""
echo -e "${BLUE}📊 Test Summary${NC}"
echo "=========================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}💥 Some tests failed. Please check the issues above.${NC}"
    exit 1
fi
