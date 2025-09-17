#!/bin/bash

# VNCompare Database Seeding Script
# This script seeds both the Symfony API and Next.js web app databases

set -e

echo "🌱 Starting VNCompare database seeding..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "api" ] || [ ! -d "web" ]; then
    print_error "Please run this script from the apps directory"
    exit 1
fi

# Seed Symfony API
print_status "Seeding Symfony API database..."
cd api

if [ ! -f "composer.json" ]; then
    print_error "Symfony API directory not found"
    exit 1
fi

# Check if composer dependencies are installed
if [ ! -d "vendor" ]; then
    print_warning "Installing Composer dependencies..."
    composer install
fi

# Run migrations
print_status "Running database migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

# Load fixtures
print_status "Loading fixtures..."
php bin/console doctrine:fixtures:load --no-interaction

print_success "Symfony API database seeded successfully!"

# Go back to apps directory
cd ..

# Seed Next.js Web App
print_status "Seeding Next.js web app database..."
cd web

if [ ! -f "package.json" ]; then
    print_error "Next.js web app directory not found"
    exit 1
fi

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    print_warning "Installing npm dependencies..."
    npm install
fi

# Run migrations
print_status "Running Prisma migrations..."
npx prisma migrate dev --name init

# Seed database
print_status "Seeding database..."
npm run db:seed

print_success "Next.js web app database seeded successfully!"

# Go back to apps directory
cd ..

print_success "🎉 All databases seeded successfully!"
print_status "You can now start developing with sample data:"
echo ""
echo "📊 Sample Data Includes:"
echo "  • 5 paint categories (Interior, Exterior, Wood, Metal, Waterproof)"
echo "  • 5 Vietnamese paint suppliers (KOVA, Jotun, Dulux, Nippon, Maxilite)"
echo "  • 10 realistic paint products with pricing"
echo "  • Vietnam address system (provinces, districts, wards)"
echo "  • Sample users and orders"
echo ""
echo "🔑 Default Credentials:"
echo "  • Admin: admin@vncompare.com / password123"
echo "  • Suppliers: contact@[brand].com.vn / password123"
echo "  • Customers: customer[1-4]@example.com / password123"
echo ""
echo "🚀 Next Steps:"
echo "  • Start the API: cd api && symfony serve"
echo "  • Start the web app: cd web && npm run dev"
echo "  • Start the admin: cd admin && ng serve"
echo "  • Start the backoffice: cd backoffice && ng serve"
