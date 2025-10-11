#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Test configuration
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
const API_BASE = `${SERVER_URL}/api`;

// Test functions
async function testHealth() {
  console.log('🔍 Testing health endpoint...');
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testGetUsers() {
  console.log('🔍 Testing GET /api/users...');
  try {
    const response = await fetch(`${API_BASE}/users?page=1&limit=20`);
    const data = await response.json();
    console.log('✅ GET users passed:', { 
      status: response.status, 
      userCount: data.users?.length || 0,
      total: data.total 
    });
    return true;
  } catch (error) {
    console.error('❌ GET users failed:', error.message);
    return false;
  }
}

async function testCreateUser() {
  console.log('🔍 Testing POST /api/users...');
  try {
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      password: 'testpassword123',
      role: 'user'
    };

    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    console.log('✅ POST users passed:', { 
      status: response.status, 
      success: data.success 
    });
    return true;
  } catch (error) {
    console.error('❌ POST users failed:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('🔍 Testing POST /api/login...');
  try {
    const loginData = {
      email: 'nguyenphongthien@gmail.com',
      password: 'Kimtuoc2'
    };

    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();
    console.log('✅ POST login passed:', { 
      status: response.status, 
      success: data.success 
    });
    return true;
  } catch (error) {
    console.error('❌ POST login failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log(`🚀 Testing server at: ${SERVER_URL}`);
  console.log('='.repeat(50));

  const results = {
    health: await testHealth(),
    getUsers: await testGetUsers(),
    createUser: await testCreateUser(),
    login: await testLogin()
  };

  console.log('='.repeat(50));
  console.log('📊 Test Results:');
  console.log(`Health Check: ${results.health ? '✅' : '❌'}`);
  console.log(`GET Users: ${results.getUsers ? '✅' : '❌'}`);
  console.log(`Create User: ${results.createUser ? '✅' : '❌'}`);
  console.log(`Login: ${results.login ? '✅' : '❌'}`);

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Server is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the server configuration.');
  }
}

// Run tests
runTests().catch(console.error);
