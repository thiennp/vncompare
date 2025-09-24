#!/bin/bash

# Test script to create a supplier using the updated API
# This demonstrates the correct payload structure

echo "Testing supplier creation with real data..."

curl -X POST "http://localhost:8000/api/v1/test/suppliers" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "supplier@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "securepassword123",
    "phone": "+84901234567",
    "companyName": "ABC Company Ltd",
    "businessLicense": "BL123456789",
    "taxCode": "TC987654321",
    "description": "Professional supplier company",
    "website": "https://abccompany.com",
    "address": "123 Main Street",
    "houseNumber": "123",
    "ward": "Ward 1",
    "district": "District 1",
    "province": "Ho Chi Minh City",
    "postalCode": "700000",
    "addressType": "WORK",
    "isDefault": true,
    "isActive": true,
    "emailVerified": false,
    "phoneVerified": false
  }' | jq '.'

echo -e "\n\nTest completed!"
