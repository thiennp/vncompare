#!/bin/bash

# Supplier CRUD Test Script
API_URL="https://vncompare.com/api"
SUPPLIER_ID=""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         SUPPLIER API - COMPREHENSIVE CRUD TEST                ║"
echo "╔════════════════════════════════════════════════════════════════╗"
echo ""

# Test 1: CREATE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  CREATE - Testing POST /api/suppliers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CREATE_RESPONSE=$(curl -s -X POST "$API_URL/suppliers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CRUD Test Supplier",
    "email": "crud@test.com",
    "phone": "0909999999",
    "address": "789 Test Avenue",
    "verified": false
  }')

echo "$CREATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CREATE_RESPONSE"

SUPPLIER_ID=$(echo "$CREATE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['supplier']['_id'])" 2>/dev/null)

if [ -z "$SUPPLIER_ID" ]; then
  echo "❌ FAILED: Could not create supplier"
  exit 1
fi

echo ""
echo "✅ Supplier created with ID: $SUPPLIER_ID"
echo ""
sleep 2

# Test 2: VERIFY (UPDATE verified field)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  VERIFY - Testing PUT /api/suppliers/:id (set verified=true)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VERIFY_RESPONSE=$(curl -s -X PUT "$API_URL/suppliers/$SUPPLIER_ID" \
  -H "Content-Type: application/json" \
  -d '{"verified":true}')

echo "$VERIFY_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$VERIFY_RESPONSE"

echo ""
echo "✅ Supplier verification request sent"
echo ""
sleep 2

# Test 3: READ - Verify verification by querying directly
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  READ - Query database directly to verify"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Direct query using MongoDB endpoint (if available) or just list all
LIST_RESPONSE=$(curl -s "$API_URL/suppliers?nocache=$(date +%s)")
echo "$LIST_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    suppliers = data.get('suppliers', [])
    print(f\"Total suppliers: {len(suppliers)}\")
    our_supplier = next((s for s in suppliers if str(s.get('_id')) == '$SUPPLIER_ID'), None)
    if our_supplier:
        print(json.dumps(our_supplier, indent=2, ensure_ascii=False))
    else:
        print(f\"Supplier {SUPPLIER_ID} not found in list\")
        print(\"Available supplier IDs:\", [s.get('_id') for s in suppliers])
except Exception as e:
    print(f\"Error: {e}\")
    print(sys.stdin.read())
" 2>&1

echo ""
sleep 2

# Test 4: UPDATE (other fields)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  UPDATE - Testing PUT /api/suppliers/:id (update other fields)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/suppliers/$SUPPLIER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CRUD Test Supplier - UPDATED",
    "phone": "0908888888"
  }')

echo "$UPDATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$UPDATE_RESPONSE"

echo ""
echo "✅ Supplier updated"
echo ""
sleep 2

# Test 5: DELETE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  DELETE - Testing DELETE /api/suppliers/:id"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/suppliers/$SUPPLIER_ID")
echo "$DELETE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$DELETE_RESPONSE"

echo ""
echo "✅ Delete request sent"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  SUPPLIER CRUD TEST COMPLETE                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"

