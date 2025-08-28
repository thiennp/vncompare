#!/bin/bash

# VNCompare.com Deployment Script
# This script automates the deployment process

set -e

echo "🎨 VNCompare.com Deployment Script"
echo "=================================="

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Build the project
build_project() {
    print_status "Building the project..."
    npm run build
    print_success "Project built successfully"
}

# Run type checking
type_check() {
    print_status "Running type checking..."
    npm run type-check
    print_success "Type checking passed"
}

# Run linting
lint_project() {
    print_status "Running linting..."
    npm run lint
    print_success "Linting passed"
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ ! -f "apps/web/.env.local" ]; then
        print_warning "Environment file not found. Please create apps/web/.env.local"
        print_status "You can copy from env.example and update the values"
        exit 1
    fi
    
    print_success "Environment variables configured"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    cd apps/web
    vercel --prod
    cd ../..
    
    print_success "Deployment completed"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    cd apps/web
    
    if [ -f "prisma/schema.prisma" ]; then
        print_status "Running database migrations..."
        npx prisma db push
        npx prisma generate
        print_success "Database setup completed"
    else
        print_warning "Prisma schema not found. Skipping database setup"
    fi
    
    cd ../..
}

# Main deployment function
main() {
    echo "Starting deployment process..."
    
    check_dependencies
    check_env
    install_dependencies
    type_check
    lint_project
    build_project
    setup_database
    deploy_vercel
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Your site should be available at: https://vncompare.com"
    print_status "Check Vercel dashboard for deployment status"
}

# Development setup function
dev_setup() {
    print_status "Setting up development environment..."
    
    check_dependencies
    install_dependencies
    
    if [ ! -f "apps/web/.env.local" ]; then
        print_warning "Creating .env.local from example..."
        cp env.example apps/web/.env.local
        print_status "Please update apps/web/.env.local with your actual values"
    fi
    
    print_success "Development environment ready!"
    print_status "Run 'npm run dev' to start development server"
}

# Parse command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "dev")
        dev_setup
        ;;
    "build")
        check_dependencies
        install_dependencies
        build_project
        ;;
    "test")
        check_dependencies
        install_dependencies
        type_check
        lint_project
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deploy  - Full production deployment (default)"
        echo "  dev     - Setup development environment"
        echo "  build   - Build the project only"
        echo "  test    - Run type checking and linting"
        echo "  help    - Show this help message"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
