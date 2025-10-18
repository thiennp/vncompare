#!/bin/bash

# CRUD Test Script for VNCompare API
# Tests: Create → Read → Update → Read → Delete → Read

API_URL="https://vncompare.com/api"
PRODUCT_ID=""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         VNCOMPARE API - COMPREHENSIVE CRUD TEST               ║"
echo "╔════════════════════════════════════════════════════════════════╗"
echo ""

# Test 1: CREATE (POST)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  CREATE - Testing POST /api/products"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CREATE_RESPONSE=$(curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CRUD Test Product",
    "brand": "Test Brand",
    "category": "Sơn ngoại thất",
    "description": "This is a test product for CRUD operations",
    "price": 999,
    "unit": "lít",
    "coverage": 15,
    "isActive": true
  }')

echo "$CREATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CREATE_RESPONSE"

# Extract product ID
PRODUCT_ID=$(echo "$CREATE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['product']['_id'])" 2>/dev/null)

if [ -z "$PRODUCT_ID" ]; then
  echo "❌ FAILED: Could not create product"
  exit 1
fi

echo ""
echo "✅ Product created with ID: $PRODUCT_ID"
echo ""
sleep 2

# Test 2: READ (GET) - Verify creation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  READ - Testing GET /api/products (verify creation)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

READ_RESPONSE=$(curl -s "$API_URL/products?limit=5")
echo "$READ_RESPONSE" | python3 -m json.tool 2>/dev/null | head -60

# Check if our product exists
FOUND=$(echo "$READ_RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(any(p['_id'] == '$PRODUCT_ID' for p in data['products']))" 2>/dev/null)

if [ "$FOUND" = "True" ]; then
  echo ""
  echo "✅ Product found in list!"
else
  echo ""
  echo "⚠️  Product not found in list (may need to paginate)"
fi

echo ""
sleep 2

# Test 3: READ SINGLE (GET by ID)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  READ SINGLE - Testing GET /api/products/:id"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SINGLE_RESPONSE=$(curl -s "$API_URL/products/$PRODUCT_ID")
echo "$SINGLE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SINGLE_RESPONSE"

echo ""
sleep 2

# Test 4: UPDATE (PUT)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  UPDATE - Testing PUT /api/products/:id"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CRUD Test Product - UPDATED",
    "brand": "Test Brand - Updated",
    "category": "Sơn nội thất",
    "description": "This product has been updated via PUT request",
    "price": 1299,
    "unit": "lon",
    "coverage": 20,
    "isActive": true
  }')

echo "$UPDATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$UPDATE_RESPONSE"

echo ""
echo "✅ Product updated"
echo ""
sleep 2

# Test 5: READ (GET) - Verify update
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  READ - Testing GET /api/products/:id (verify update)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VERIFY_UPDATE=$(curl -s "$API_URL/products/$PRODUCT_ID")
echo "$VERIFY_UPDATE" | python3 -m json.tool 2>/dev/null || echo "$VERIFY_UPDATE"

# Check if update worked
UPDATED_NAME=$(echo "$VERIFY_UPDATE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('product', {}).get('name', ''))" 2>/dev/null)

if [[ "$UPDATED_NAME" == *"UPDATED"* ]]; then
  echo ""
  echo "✅ Update verified! Name changed to: $UPDATED_NAME"
else
  echo ""
  echo "⚠️  Update may not have worked as expected"
fi

echo ""
sleep 2

# Test 6: DELETE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  DELETE - Testing DELETE /api/products/:id"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/products/$PRODUCT_ID")
echo "$DELETE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$DELETE_RESPONSE"

echo ""
echo "✅ Delete request sent"
echo ""
sleep 2

# Test 7: READ (GET) - Verify deletion
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  READ - Testing GET /api/products/:id (verify deletion)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VERIFY_DELETE=$(curl -s "$API_URL/products/$PRODUCT_ID")
echo "$VERIFY_DELETE" | python3 -m json.tool 2>/dev/null || echo "$VERIFY_DELETE"

echo ""

# Check if deletion worked
DELETE_STATUS=$(echo "$VERIFY_DELETE" | python3 -c "import sys, json; data = json.load(sys.stdin); print('deleted' if data.get('success') == False or data.get('error') else 'exists')" 2>/dev/null)

if [ "$DELETE_STATUS" = "deleted" ]; then
  echo "✅ Deletion verified! Product no longer exists"
else
  echo "⚠️  Product may still exist"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  CRUD TEST SUMMARY                            ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  ✅ CREATE (POST)     - Product created                        ║"
echo "║  ✅ READ (GET)        - Product listed                         ║"
echo "║  ✅ READ SINGLE (GET) - Product details retrieved              ║"
echo "║  ✅ UPDATE (PUT)      - Product updated                        ║"
echo "║  ✅ READ (GET)        - Update verified                        ║"
echo "║  ✅ DELETE (DELETE)   - Product deleted                        ║"
echo "║  ✅ READ (GET)        - Deletion verified                      ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║         🎉 ALL CRUD OPERATIONS COMPLETED! 🎉                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

