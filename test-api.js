#!/usr/bin/env node

// Simple API test script
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
const API_BASE = `${SERVER_URL}/api`;

async function testEndpoint(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();

    console.log(`✅ ${method} ${endpoint}: ${response.status}`);
    return { success: true, status: response.status, data: result };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log(`🚀 Testing API at: ${SERVER_URL}`);
  console.log('='.repeat(50));

  // Test 1: Health check
  console.log('🔍 Testing health endpoint...');
  await testEndpoint('/health');

  // Test 2: Get users
  console.log('🔍 Testing GET users...');
  await testEndpoint('/users');

  // Test 3: Create user
  console.log('🔍 Testing POST users...');
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    password: 'testpassword123',
    role: 'user',
  };
  await testEndpoint('/users', 'POST', testUser);

  // Test 4: Login
  console.log('🔍 Testing login...');
  const loginData = {
    email: 'nguyenphongthien@gmail.com',
    password: 'Kimtuoc2',
  };
  await testEndpoint('/login', 'POST', loginData);

  console.log('='.repeat(50));
  console.log('🎯 API testing completed!');
}

runTests().catch(console.error);
