#!/bin/bash

# Test script for backoffice deployment
# This script tests the build and deployment process

set -e

echo "🧪 Testing VNCompare Backoffice Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test 1: Check if we're in the right directory
print_status "Testing directory structure..."
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run from backoffice directory."
    exit 1
fi
print_success "Directory structure is correct"

# Test 2: Check if dependencies are installed
print_status "Testing dependencies..."
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
fi
print_success "Dependencies are available"

# Test 3: Test build process
print_status "Testing build process..."
npm run build
if [ ! -d "dist/backoffice" ]; then
    print_error "Build failed. dist/backoffice directory not found."
    exit 1
fi
print_success "Build completed successfully"

# Test 4: Check build output
print_status "Testing build output..."
if [ ! -f "dist/backoffice/browser/index.html" ]; then
    print_error "index.html not found in build output."
    exit 1
fi
print_success "Build output is correct"

# Test 5: Check if Netlify config exists
print_status "Testing Netlify configuration..."
if [ ! -f "netlify.toml" ]; then
    print_error "netlify.toml not found."
    exit 1
fi
print_success "Netlify configuration is present"

# Test 6: Check if deploy script exists and is executable
print_status "Testing deployment script..."
if [ ! -f "deploy.sh" ]; then
    print_error "deploy.sh not found."
    exit 1
fi
if [ ! -x "deploy.sh" ]; then
    print_warning "deploy.sh is not executable. Fixing..."
    chmod +x deploy.sh
fi
print_success "Deployment script is ready"

# Test 7: Test API configuration
print_status "Testing API configuration..."
if grep -q "api.vncompare.com" src/app/services/api.service.ts; then
    print_success "API URL is correctly configured"
else
    print_error "API URL is not configured correctly"
    exit 1
fi

# Test 8: Test Angular configuration
print_status "Testing Angular configuration..."
if grep -q "baseHref" angular.json; then
    print_success "Angular baseHref is configured"
else
    print_warning "Angular baseHref might not be configured"
fi

echo ""
print_success "🎉 All tests passed! The backoffice is ready for deployment."
echo ""
echo "Next steps:"
echo "1. Run './deploy.sh' to deploy to Netlify"
echo "2. Configure custom domain 'admin.vncompare.com' in Netlify dashboard"
echo "3. Update DNS records to point to Netlify"
echo ""
echo "Deployment URL will be: https://admin.vncompare.com"
