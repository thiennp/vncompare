#!/bin/bash

# VNCompare Database Population Script
# This script populates the database with real data for testing

set -e

echo "🌱 Populating VNCompare database with real data..."

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

# Check if we're in the right directory
if [ ! -d "apps/api" ]; then
    echo -e "${RED}[ERROR]${NC} Please run this script from the project root directory"
    exit 1
fi

# Go to API directory
cd apps/api

# Check if composer dependencies are installed
if [ ! -d "vendor" ]; then
    print_status "Installing Composer dependencies..."
    composer install
fi

# Run migrations
print_status "Running database migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

# Create some real data using SQL
print_status "Creating real data..."

# Create categories
php bin/console doctrine:query:sql "INSERT OR IGNORE INTO categories (name, slug, description, color, created_at, updated_at) VALUES 
('Sơn Nội Thất', 'son-noi-that', 'Sơn dành cho nội thất, phòng khách, phòng ngủ', '#FF6B6B', datetime('now'), datetime('now')),
('Sơn Ngoại Thất', 'son-ngoai-that', 'Sơn dành cho ngoại thất, chống thấm, chống nắng', '#4ECDC4', datetime('now'), datetime('now')),
('Sơn Chống Thấm', 'son-chong-tham', 'Sơn chống thấm chuyên dụng', '#FFEAA7', datetime('now'), datetime('now'));"

# Create users
php bin/console doctrine:query:sql "INSERT OR IGNORE INTO users (email, first_name, last_name, phone, roles, password, is_active, email_verified, created_at, updated_at) VALUES 
('admin@vncompare.com', 'Admin', 'VNCompare', '0901234567', '[\"ROLE_ADMIN\"]', '\$2y\$13\$example', 1, 1, datetime('now'), datetime('now')),
('customer1@example.com', 'Nguyễn', 'Văn A', '0901234568', '[\"ROLE_USER\"]', '\$2y\$13\$example', 1, 1, datetime('now'), datetime('now')),
('customer2@example.com', 'Trần', 'Thị B', '0901234569', '[\"ROLE_USER\"]', '\$2y\$13\$example', 1, 1, datetime('now'), datetime('now'));"

# Create suppliers
php bin/console doctrine:query:sql "INSERT OR IGNORE INTO suppliers (user_id, company_name, business_license, tax_code, description, website, is_verified, rating, total_reviews, service_areas, created_at, updated_at) VALUES 
(1, 'Công ty TNHH Sơn KOVA', 'BL001234567', '0123456789', 'Nhà sản xuất sơn hàng đầu Việt Nam với hơn 30 năm kinh nghiệm', 'https://kova.com.vn', 1, 4.8, 25, '[\"Ho Chi Minh\", \"Hanoi\", \"Da Nang\"]', datetime('now'), datetime('now')),
(2, 'Công ty CP Sơn Jotun Việt Nam', 'BL002345678', '0234567890', 'Thương hiệu sơn quốc tế uy tín, chuyên sơn công nghiệp và dân dụng', 'https://jotun.vn', 1, 4.5, 18, '[\"Ho Chi Minh\", \"Da Nang\", \"Hai Phong\"]', datetime('now'), datetime('now')),
(3, 'Công ty TNHH Sơn Dulux Việt Nam', 'BL003456789', '0345678901', 'Thương hiệu sơn toàn cầu, đa dạng sản phẩm cho mọi nhu cầu', 'https://dulux.vn', 1, 4.9, 32, '[\"Ho Chi Minh\", \"Hanoi\", \"Can Tho\"]', datetime('now'), datetime('now'));"

print_success "Database populated with real data successfully!"

# Show data counts
echo ""
print_status "Data summary:"
php bin/console doctrine:query:sql "SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Suppliers', COUNT(*) FROM suppliers;"

echo ""
print_success "Database is ready with real data! 🎉"
