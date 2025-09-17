# Database Seeding Guide

This guide explains how to seed your VNCompare database with sample data for development and testing.

## 🎯 What Gets Seeded

### Symfony API (apps/api/)
- **Categories**: Paint categories (Interior, Exterior, Wood, Metal, Waterproof)
- **Suppliers**: 5 Vietnamese paint suppliers (KOVA, Jotun, Dulux, Nippon, Maxilite)
- **Products**: 10 realistic paint products with Vietnamese brands
- **Users**: Admin and sample customer accounts
- **Reviews**: Sample product reviews

### Next.js Web App (apps/web/)
- **Vietnam Addresses**: Provinces, districts, and wards
- **Products**: Paint products with pricing and specifications
- **Suppliers**: Company information and contact details
- **Users**: Sample customer accounts
- **Orders**: Sample order history

## 🚀 How to Run Seeding

### For Symfony API

1. **Install Dependencies** (if not already done):
   ```bash
   cd apps/api
   composer install
   ```

2. **Run Database Migrations**:
   ```bash
   php bin/console doctrine:migrations:migrate
   ```

3. **Load Fixtures**:
   ```bash
   php bin/console doctrine:fixtures:load
   ```

### For Next.js Web App

1. **Install Dependencies** (if not already done):
   ```bash
   cd apps/web
   npm install
   ```

2. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev
   ```

3. **Seed Database**:
   ```bash
   npm run db:seed
   ```

   Or reset and seed:
   ```bash
   npm run db:reset
   ```

## 📊 Sample Data Overview

### Paint Categories
- **Sơn Nội Thất** (Interior Paint) - For living rooms, bedrooms
- **Sơn Ngoại Thất** (Exterior Paint) - Weather-resistant outdoor paint
- **Sơn Gỗ** (Wood Paint) - Specialized for wood surfaces
- **Sơn Kim Loại** (Metal Paint) - Anti-rust paint for metal
- **Sơn Chống Thấm** (Waterproof Paint) - Waterproofing solutions

### Vietnamese Paint Brands
1. **KOVA** - Leading Vietnamese paint manufacturer (30+ years)
2. **Jotun** - International brand, industrial and residential
3. **Dulux** - Global brand with diverse product range
4. **Nippon** - Japanese technology, high quality
5. **Maxilite** - Budget-friendly option for mass market

### Sample Products
- KOVA Premium Interior (750,000 VND)
- Jotun Lady Interior (1,100,000 VND)
- Dulux Easycare Interior (880,000 VND)
- Nippon Odour-less (1,000,000 VND)
- Maxilite Economy Interior (400,000 VND)

### Vietnam Addresses
- **Major Cities**: Ho Chi Minh City, Hanoi, Da Nang, Can Tho, Hai Phong
- **Provinces**: Khanh Hoa, Ba Ria - Vung Tau, Dong Nai, An Giang, Kien Giang
- **Districts & Wards**: Sample administrative divisions for each province

## 🔧 Development Notes

### Default Credentials
- **Admin**: admin@vncompare.com / password123
- **Suppliers**: contact@[brand].com.vn / password123
- **Customers**: customer[1-4]@example.com / password123

### Database URLs
Make sure your `.env` files are configured:
- **API**: `DATABASE_URL` in `apps/api/.env`
- **Web**: `DATABASE_URL` in `apps/web/.env.local`

### Resetting Data
To completely reset and reseed:
- **API**: `php bin/console doctrine:database:drop --force && php bin/console doctrine:database:create && php bin/console doctrine:migrations:migrate && php bin/console doctrine:fixtures:load`
- **Web**: `npm run db:reset`

## 🎨 Product Specifications

Each product includes:
- **Coverage Rate**: m² per liter
- **Volume**: Container size (typically 18L)
- **Weight**: Product weight in kg
- **Finish Types**: Matte, Satin, Gloss, Semi-Gloss
- **Features**: Waterproof, odorless, easy-clean, etc.
- **Pricing**: Base price and original price (for discounts)

## 📍 Service Areas

Suppliers cover major Vietnamese cities:
- Ho Chi Minh City
- Hanoi
- Da Nang
- Can Tho
- Hai Phong
- Nha Trang
- Vung Tau

## 🔄 Updating Seed Data

To modify seed data:
1. **API**: Edit `apps/api/src/DataFixtures/AppFixtures.php`
2. **Web**: Edit `apps/web/prisma/seed.ts`
3. Re-run the seeding commands

## 🚨 Troubleshooting

### Common Issues
1. **Database Connection**: Ensure DATABASE_URL is correct
2. **Permissions**: Make sure database user has CREATE/DROP permissions
3. **Dependencies**: Run `composer install` or `npm install` first
4. **Migrations**: Always run migrations before seeding

### Reset Everything
```bash
# API
cd apps/api
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load

# Web
cd apps/web
npm run db:reset
```

This seeding system provides a realistic foundation for developing and testing your VNCompare paint comparison platform! 🎨
