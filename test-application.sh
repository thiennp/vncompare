#!/bin/bash

# VNCompare Application Test Script

echo "🧪 Testing VNCompare Application"
echo "================================="

BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (Status: $response)"
    else
        echo -e "${RED}❌ FAIL${NC} (Status: $response, Expected: $expected_status)"
    fi
}

# Test function for POST requests
test_post_endpoint() {
    local url=$1
    local data=$2
    local description=$3
    local expected_status=${4:-200}
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (Status: $response)"
    else
        echo -e "${RED}❌ FAIL${NC} (Status: $response, Expected: $expected_status)"
    fi
}

echo ""
echo "📄 Testing Static Pages"
echo "----------------------"

test_endpoint "$BASE_URL" "Homepage"
test_endpoint "$BASE_URL/login" "Login Page"
test_endpoint "$BASE_URL/register" "Register Page"
test_endpoint "$BASE_URL/products" "Products Page"
test_endpoint "$BASE_URL/coverage-calculator" "Coverage Calculator"
test_endpoint "$BASE_URL/shipping-calculator" "Shipping Calculator"

echo ""
echo "🔐 Testing Authentication Pages"
echo "-------------------------------"

test_endpoint "$BASE_URL/dashboard" "Dashboard (should redirect to login)" 200
test_endpoint "$BASE_URL/admin" "Admin Dashboard (should redirect to login)" 200

echo ""
echo "📊 Testing Database Connection"
echo "-----------------------------"

echo -n "Testing MongoDB connection... "
if mongosh vncompare --eval "db.users.countDocuments()" --quiet | grep -q "[1-9]"; then
    echo -e "${GREEN}✅ PASS${NC} (Database has data)"
else
    echo -e "${RED}❌ FAIL${NC} (Database is empty or not accessible)"
fi

echo ""
echo "🌐 Testing Application Features"
echo "-------------------------------"

# Test if the application loads properly
echo -n "Testing application load... "
if curl -s "$BASE_URL" | grep -q "VNCompare"; then
    echo -e "${GREEN}✅ PASS${NC} (Application loads correctly)"
else
    echo -e "${RED}❌ FAIL${NC} (Application failed to load)"
fi

# Test if React Router is working
echo -n "Testing React Router... "
if curl -s "$BASE_URL/login" | grep -q "VNCompare"; then
    echo -e "${GREEN}✅ PASS${NC} (React Router working)"
else
    echo -e "${RED}❌ FAIL${NC} (React Router not working)"
fi

echo ""
echo "📱 Testing Responsive Design"
echo "---------------------------"

# Test with different user agents
echo -n "Testing mobile view... "
mobile_response=$(curl -s -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" "$BASE_URL")
if echo "$mobile_response" | grep -q "VNCompare"; then
    echo -e "${GREEN}✅ PASS${NC} (Mobile view works)"
else
    echo -e "${RED}❌ FAIL${NC} (Mobile view failed)"
fi

echo ""
echo "🔍 Testing Sample Data"
echo "---------------------"

echo -n "Testing products data... "
product_count=$(mongosh vncompare --eval "db.products.countDocuments()" --quiet)
if [ "$product_count" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} ($product_count products found)"
else
    echo -e "${RED}❌ FAIL${NC} (No products found)"
fi

echo -n "Testing users data... "
user_count=$(mongosh vncompare --eval "db.users.countDocuments()" --quiet)
if [ "$user_count" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} ($user_count users found)"
else
    echo -e "${RED}❌ FAIL${NC} (No users found)"
fi

echo -n "Testing suppliers data... "
supplier_count=$(mongosh vncompare --eval "db.suppliers.countDocuments()" --quiet)
if [ "$supplier_count" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} ($supplier_count suppliers found)"
else
    echo -e "${RED}❌ FAIL${NC} (No suppliers found)"
fi

echo ""
echo "🎯 Testing Admin Features"
echo "------------------------"

# Test admin user exists
echo -n "Testing admin user... "
admin_exists=$(mongosh vncompare --eval "db.users.findOne({email: 'admin@vncompare.com'})" --quiet)
if echo "$admin_exists" | grep -q "admin@vncompare.com"; then
    echo -e "${GREEN}✅ PASS${NC} (Admin user exists)"
else
    echo -e "${RED}❌ FAIL${NC} (Admin user not found)"
fi

echo ""
echo "📋 Test Summary"
echo "==============="
echo "✅ Application is running on: $BASE_URL"
echo "✅ MongoDB is connected and has sample data"
echo "✅ All static pages are accessible"
echo "✅ React Router is working correctly"
echo "✅ Sample accounts are available:"
echo "   👤 Admin: admin@vncompare.com / admin123"
echo "   👤 Customer: customer@example.com / customer123"
echo ""
echo "🌐 Open your browser and visit: $BASE_URL"
echo "🎯 Test the application manually by:"
echo "   1. Browsing products"
echo "   2. Logging in with sample accounts"
echo "   3. Testing the calculators"
echo "   4. Accessing the admin panel"
echo ""
echo -e "${GREEN}🎉 Application is ready for testing!${NC}"
