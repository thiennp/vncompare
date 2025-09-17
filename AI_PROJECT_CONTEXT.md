# VNCompare.com - AI Project Context

## 🎯 Project Overview

**VNCompare.com** is Vietnam's premier paint comparison platform designed to help consumers and businesses find the best paint products, prices, and suppliers across Vietnam. The platform provides transparent, comprehensive comparisons for all types of paint products with advanced features like coverage calculators, price tracking, and supplier management.

## 🏗️ Architecture & Tech Stack

### Current Implementation Status
- **Monorepo Structure**: Using Turbo for build orchestration
- **Multiple Applications**: Web frontend, Admin backoffice, API backend, and additional backoffice
- **Database**: PostgreSQL with Prisma ORM (web) and Doctrine ORM (API)
- **Deployment**: Vercel for frontend, with Docker support for API

### Applications Structure
```
/Users/thiennguyen/studyvn/
├── apps/
│   ├── web/              # Next.js 14 frontend (main customer-facing app)
│   ├── admin/            # Angular 17 admin panel (provider management)
│   ├── backoffice/       # Angular 20 backoffice (additional admin features)
│   └── api/              # Symfony 7.x API backend
├── api/                  # Node.js API gateway (legacy)
└── [configuration files]
```

## 🛠️ Technology Stack Details

### Frontend (apps/web/)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: Zustand + TanStack Query
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI primitives + custom components
- **Icons**: Lucide React
- **Charts**: Recharts

### Admin Panel (apps/admin/)
- **Framework**: Angular 17
- **Language**: TypeScript
- **Styling**: Angular Material + Tailwind CSS
- **State Management**: NgRx
- **Charts**: Chart.js + ng2-charts
- **Purpose**: Provider/supplier management system

### Backoffice (apps/backoffice/)
- **Framework**: Angular 20 (newer version)
- **Language**: TypeScript
- **Styling**: Angular Material
- **Purpose**: Additional administrative features

### API Backend (apps/api/)
- **Framework**: Symfony 7.x
- **Language**: PHP 8.2+
- **Database**: PostgreSQL with Doctrine ORM
- **Authentication**: JWT (Lexik JWT Authentication Bundle)
- **Documentation**: OpenAPI 3.0 (Nelmio API Doc Bundle)
- **Validation**: Symfony Validator Component
- **Testing**: PHPUnit

### Legacy API (api/)
- **Framework**: Node.js with Express
- **Language**: JavaScript
- **Purpose**: Simple API gateway (appears to be legacy)

## 🗄️ Database Schema

### Core Entities (Symfony/Doctrine)
- **User**: Customer and business accounts with role-based access
- **Product**: Paint products with specifications and coverage data (m²/liter)
- **Supplier**: Paint stores and manufacturers with service areas
- **Order**: Purchase tracking and order management
- **Address**: Vietnam-specific address system (provinces, districts, wards)
- **Shipping**: Shipping zones, costs, and delivery timeframes
- **Review**: Customer ratings and feedback
- **Category**: Product categorization
- **Price**: Historical and current pricing data
- **Project**: User painting projects

### Key Features
- **Coverage Calculator**: Critical feature for paint quantity calculations
- **Vietnam Address System**: Full support for Vietnamese administrative divisions
- **Price Tracking**: Historical price data and alerts
- **Supplier Management**: Service area configuration and delivery zones

## 🎨 Business Domain

### Paint Categories
- Interior Paints (wall, ceiling, trim)
- Exterior Paints (weather-resistant coatings)
- Specialty Paints (anti-mold, anti-bacterial, fire-resistant)
- Industrial Paints (metal coatings, concrete sealers)
- Decorative Paints (textured, metallic finishes)
- Eco-Friendly Paints (low-VOC, organic options)

### Key Business Features
- **Price Comparison**: Real-time price tracking across suppliers
- **Coverage Calculator**: Calculate paint needed based on room dimensions
- **Supplier Locator**: Find nearby paint stores and suppliers
- **Address Management**: Vietnam address validation and autocomplete
- **Shipping Calculator**: Real-time shipping cost and duration calculation
- **Total Price Calculation**: Product price + shipping + taxes

## 🔧 Development Environment

### Prerequisites
- Node.js 18+
- PHP 8.2+
- PostgreSQL 14+
- Composer 2.0+
- Angular CLI 17+ (for admin)
- Angular CLI 20+ (for backoffice)

### Key Configuration Files
- `turbo.json`: Monorepo build configuration
- `package.json`: Root package configuration
- `apps/*/package.json`: Individual app configurations
- `apps/api/composer.json`: PHP dependencies
- `apps/web/prisma/schema.prisma`: Database schema

### Environment Setup
- Environment variables in `.env` files
- Database migrations in `migrations/` directory
- Seed data in `DataFixtures/` and `apps/web/prisma/seed.ts`

## 🚀 Deployment & Infrastructure

### Current Deployment
- **Frontend**: Vercel (Next.js app)
- **API**: Docker containers with Symfony
- **Database**: PostgreSQL
- **CDN**: Cloudflare (mentioned in docs)

### Configuration Files
- `vercel.json`: Vercel deployment configuration
- `deploy-vercel.sh`: Deployment script
- `compose.yaml`: Docker Compose configuration
- `compose.override.yaml`: Local development overrides

## 📊 Key Business Logic

### Coverage Calculation Formula
```
Paint Needed (liters) = Total Area (m²) ÷ Coverage Rate (m²/liter) × Number of Coats
```

### Price Calculation
```
Total Price = Base Price + Shipping Cost + Taxes + Additional Fees
```

### Vietnam Address System
- **Provinces (Tỉnh/Thành phố)**: 63 provinces and cities
- **Districts (Quận/Huyện)**: Administrative districts
- **Wards (Phường/Xã)**: Sub-district level areas

## 🔐 Security & Authentication

### Authentication Methods
- **JWT Tokens**: For API authentication
- **NextAuth.js**: For web app authentication
- **Role-based Access**: USER, SUPPLIER, ADMIN roles

### Security Features
- CSRF protection
- XSS prevention
- Rate limiting
- Data encryption
- GDPR compliance

## 📱 User Interfaces

### Customer-Facing (apps/web/)
- Product comparison and search
- Coverage calculator
- Price tracking and alerts
- Order management
- User profiles and addresses

### Provider Management (apps/admin/)
- Product management
- Pricing configuration
- Shipping zone setup
- Address management
- Analytics and reporting

### Additional Admin (apps/backoffice/)
- Extended administrative features
- Additional management tools

## 🧪 Testing & Quality

### Testing Strategy
- **Unit Tests**: PHPUnit for API, Jest for frontend
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Angular testing framework

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- PHPStan for PHP static analysis

## 📈 Performance & Monitoring

### Performance Targets
- Page load time: < 2 seconds
- Search results: < 500ms
- Uptime: 99.9%
- Mobile performance: Lighthouse score > 90

### Monitoring Tools
- Sentry for error tracking
- Google Analytics 4
- Performance monitoring

## 🌍 Localization

### Language Support
- **Primary**: Vietnamese
- **Secondary**: English
- **Currency**: VND (Vietnamese Dong)

### Regional Features
- Vietnam-specific payment methods (VNPay, Momo, ZaloPay)
- Local address validation
- Cultural adaptation for Vietnamese users

## 🔄 Development Workflow

### Build System
- **Turbo**: Monorepo build orchestration
- **Parallel Builds**: Multiple apps can be built simultaneously
- **Incremental Builds**: Only rebuild changed components

### Scripts
- `npm run dev`: Start development servers
- `npm run build`: Build all applications
- `npm run db:seed`: Seed database with test data
- `npm run db:reset`: Reset and reseed database

## 📚 Documentation

### Existing Documentation
- `README.md`: Main project overview
- `API_STRUCTURE.md`: Detailed API documentation
- `BACKOFFICE_FEATURES.md`: Admin panel features
- `DEPLOYMENT.md`: Deployment instructions
- `SEEDING.md`: Database seeding guide

### API Documentation
- OpenAPI 3.0 specification
- Swagger UI available at `/api/docs`
- Comprehensive endpoint documentation

## 🎯 Current Development Status

### Completed Features
- Basic project structure and configuration
- Database schema and entities
- API endpoints and controllers
- Frontend components and pages
- Admin panel structure
- Authentication system

### Key Files to Monitor
- `apps/web/src/app/`: Main Next.js application
- `apps/api/src/Controller/Api/`: API controllers
- `apps/api/src/Entity/`: Database entities
- `apps/admin/src/app/`: Angular admin panel
- `apps/backoffice/src/app/`: Additional backoffice

## 🚨 Important Notes

### Critical Business Logic
- **Coverage Calculator**: Essential for paint quantity calculations
- **Vietnam Address System**: Must support all administrative divisions
- **Price Tracking**: Historical data is crucial for comparisons
- **Shipping Zones**: Complex calculation based on Vietnamese geography

### Development Guidelines
- Always refer to this file before making changes
- Update this file after completing any significant work
- Maintain consistency across all applications
- Follow the established patterns for new features
- Test coverage calculations thoroughly
- Validate Vietnam addresses properly

---

**Last Updated**: [Current Date]
**Version**: 1.0
**Maintainer**: AI Assistant

This file serves as the single source of truth for understanding the VNCompare.com project architecture, business logic, and development guidelines. Always consult this file before making any changes to ensure consistency and proper understanding of the project context.
