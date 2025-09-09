# VNCompare API Structure Documentation

## 🏗️ Architecture Overview

The VNCompare API is built with **Symfony 7.x** and follows RESTful principles with a clean, scalable architecture designed for Vietnam's paint comparison platform.

### Tech Stack
- **Framework**: Symfony 7.x with PHP 8.2+
- **Database**: PostgreSQL 14+ with Doctrine ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Symfony Validator Component
- **Documentation**: OpenAPI 3.0 (Swagger)
- **Testing**: PHPUnit with Symfony Test Client
- **Caching**: Redis for API response caching
- **Queue**: Symfony Messenger for background jobs

## 📁 Project Structure

```
apps/api/
├── config/
│   ├── packages/
│   │   ├── doctrine.yaml
│   │   ├── security.yaml
│   │   ├── framework.yaml
│   │   └── lexik_jwt_authentication.yaml
│   ├── routes/
│   │   ├── api.yaml
│   │   └── security.yaml
│   └── services.yaml
├── public/
│   └── index.php
├── src/
│   ├── Controller/
│   │   ├── Api/
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── SupplierController.php
│   │   │   ├── UserController.php
│   │   │   ├── OrderController.php
│   │   │   ├── ReviewController.php
│   │   │   ├── AddressController.php
│   │   │   ├── ShippingController.php
│   │   │   └── AnalyticsController.php
│   │   └── BaseApiController.php
│   ├── Entity/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Supplier.php
│   │   ├── Order.php
│   │   ├── Review.php
│   │   ├── Address.php
│   │   ├── Shipping.php
│   │   ├── Category.php
│   │   ├── Price.php
│   │   └── Project.php
│   ├── Repository/
│   │   ├── UserRepository.php
│   │   ├── ProductRepository.php
│   │   ├── SupplierRepository.php
│   │   └── OrderRepository.php
│   ├── Service/
│   │   ├── AuthService.php
│   │   ├── ProductService.php
│   │   ├── PriceService.php
│   │   ├── EmailService.php
│   │   ├── PaymentService.php
│   │   └── SearchService.php
│   ├── DTO/
│   │   ├── Request/
│   │   │   ├── LoginRequest.php
│   │   │   ├── RegisterRequest.php
│   │   │   ├── ProductCreateRequest.php
│   │   │   └── OrderCreateRequest.php
│   │   └── Response/
│   │       ├── ApiResponse.php
│   │       ├── ProductResponse.php
│   │       └── UserResponse.php
│   ├── EventSubscriber/
│   │   ├── ApiExceptionSubscriber.php
│   │   └── CorsSubscriber.php
│   ├── Security/
│   │   ├── JwtAuthenticator.php
│   │   └── UserProvider.php
│   ├── Validator/
│   │   ├── UniqueEmailValidator.php
│   │   └── VietnamesePhoneValidator.php
│   └── Kernel.php
├── migrations/
├── tests/
│   ├── Controller/
│   ├── Service/
│   └── Functional/
├── var/
│   ├── cache/
│   └── log/
├── vendor/
├── composer.json
├── composer.lock
└── .env
```

## 🗄️ Database Schema

### Core Entities

#### User Entity
```php
User {
    id: UUID (Primary Key)
    email: string (Unique)
    password: string (Hashed)
    firstName: string
    lastName: string
    phone: string (Vietnamese format)
    avatar: string (URL)
    role: enum (USER, SUPPLIER, ADMIN)
    isActive: boolean
    emailVerified: boolean
    phoneVerified: boolean
    createdAt: DateTime
    updatedAt: DateTime
    lastLoginAt: DateTime
    addresses: OneToMany (Address)
    orders: OneToMany (Order)
    reviews: OneToMany (Review)
    projects: OneToMany (Project)
}
```

#### Product Entity
```php
Product {
    id: UUID (Primary Key)
    name: string
    description: text
    brand: string
    category: ManyToOne (Category)
    supplier: ManyToOne (Supplier)
    sku: string (Unique)
    barcode: string
    color: string
    finish: enum (MATTE, SATIN, GLOSS, SEMI_GLOSS)
    coverage: decimal (m²/liter)
    volume: decimal (liters)
    weight: decimal (kg)
    price: decimal (VND)
    discountPrice: decimal (VND)
    isActive: boolean
    isFeatured: boolean
    images: array (JSON)
    specifications: array (JSON)
    tags: array (JSON)
    createdAt: DateTime
    updatedAt: DateTime
    prices: OneToMany (Price)
    reviews: OneToMany (Review)
}
```

#### Supplier Entity
```php
Supplier {
    id: UUID (Primary Key)
    user: OneToOne (User)
    companyName: string
    businessLicense: string
    taxCode: string
    description: text
    logo: string (URL)
    website: string
    isVerified: boolean
    rating: decimal
    totalReviews: integer
    serviceAreas: array (JSON) - Vietnam provinces
    deliveryZones: OneToMany (Shipping)
    products: OneToMany (Product)
    orders: OneToMany (Order)
    createdAt: DateTime
    updatedAt: DateTime
}
```

#### Order Entity
```php
Order {
    id: UUID (Primary Key)
    user: ManyToOne (User)
    supplier: ManyToOne (Supplier)
    orderNumber: string (Unique)
    status: enum (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
    subtotal: decimal (VND)
    shippingCost: decimal (VND)
    tax: decimal (VND)
    total: decimal (VND)
    paymentMethod: enum (VNPAY, MOMO, ZALOPAY, CASH)
    paymentStatus: enum (PENDING, PAID, FAILED, REFUNDED)
    shippingAddress: ManyToOne (Address)
    notes: text
    createdAt: DateTime
    updatedAt: DateTime
    orderItems: OneToMany (OrderItem)
}
```

#### Address Entity (Vietnam-specific)
```php
Address {
    id: UUID (Primary Key)
    user: ManyToOne (User)
    type: enum (HOME, WORK, OTHER)
    recipientName: string
    phone: string
    province: string (Tỉnh/Thành phố)
    district: string (Quận/Huyện)
    ward: string (Phường/Xã)
    street: string
    houseNumber: string
    postalCode: string
    isDefault: boolean
    coordinates: array (JSON) - lat/lng
    createdAt: DateTime
    updatedAt: DateTime
}
```

#### Shipping Entity
```php
Shipping {
    id: UUID (Primary Key)
    supplier: ManyToOne (Supplier)
    name: string
    description: text
    provinces: array (JSON) - Covered provinces
    districts: array (JSON) - Covered districts
    baseCost: decimal (VND)
    costPerKm: decimal (VND)
    freeShippingThreshold: decimal (VND)
    estimatedDays: integer
    isActive: boolean
    createdAt: DateTime
    updatedAt: DateTime
}
```

## 🔌 API Endpoints

### Base URL
```
Production: https://api.vncompare.com/v1
Development: http://localhost:8000/api/v1
```

### Authentication Endpoints

#### POST /auth/register
Register a new user account
```json
Request Body:
{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "phone": "+84901234567",
    "role": "USER"
}

Response:
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": "uuid",
            "email": "user@example.com",
            "firstName": "Nguyễn",
            "lastName": "Văn A",
            "phone": "+84901234567",
            "role": "USER",
            "isActive": true,
            "emailVerified": false,
            "phoneVerified": false,
            "createdAt": "2024-01-01T00:00:00Z"
        },
        "token": "jwt_token_here"
    }
}
```

#### POST /auth/login
Authenticate user and return JWT token
```json
Request Body:
{
    "email": "user@example.com",
    "password": "SecurePassword123!"
}

Response:
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": "uuid",
            "email": "user@example.com",
            "firstName": "Nguyễn",
            "lastName": "Văn A",
            "role": "USER"
        },
        "token": "jwt_token_here",
        "expiresAt": "2024-01-01T01:00:00Z"
    }
}
```

#### POST /auth/refresh
Refresh JWT token
```json
Response:
{
    "success": true,
    "data": {
        "token": "new_jwt_token_here",
        "expiresAt": "2024-01-01T01:00:00Z"
    }
}
```

#### POST /auth/logout
Logout user (invalidate token)
```json
Response:
{
    "success": true,
    "message": "Logout successful"
}
```

### Product Endpoints

#### GET /products
Get paginated list of products with filtering and search
```json
Query Parameters:
- page: integer (default: 1)
- limit: integer (default: 20, max: 100)
- category: string (category slug)
- brand: string
- minPrice: decimal
- maxPrice: decimal
- color: string
- finish: string (MATTE, SATIN, GLOSS, SEMI_GLOSS)
- search: string (search term)
- sort: string (price_asc, price_desc, rating_desc, newest)
- supplier: string (supplier ID)

Response:
{
    "success": true,
    "data": {
        "products": [
            {
                "id": "uuid",
                "name": "Sơn Dulux Weathershield",
                "description": "Sơn ngoại thất chống thời tiết",
                "brand": "Dulux",
                "category": {
                    "id": "uuid",
                    "name": "Exterior Paint",
                    "slug": "exterior-paint"
                },
                "supplier": {
                    "id": "uuid",
                    "companyName": "Công ty Sơn ABC",
                    "rating": 4.5
                },
                "sku": "DULUX-WS-001",
                "color": "#FFFFFF",
                "finish": "MATTE",
                "coverage": 12.5,
                "volume": 5.0,
                "price": 450000,
                "discountPrice": 400000,
                "images": [
                    "https://cdn.vncompare.com/products/dulux-weathershield.jpg"
                ],
                "rating": 4.3,
                "totalReviews": 156,
                "isFeatured": true,
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 20,
            "total": 1250,
            "totalPages": 63
        },
        "filters": {
            "categories": [...],
            "brands": [...],
            "priceRange": {
                "min": 50000,
                "max": 2000000
            }
        }
    }
}
```

#### GET /products/{id}
Get detailed product information
```json
Response:
{
    "success": true,
    "data": {
        "id": "uuid",
        "name": "Sơn Dulux Weathershield",
        "description": "Sơn ngoại thất chống thời tiết...",
        "brand": "Dulux",
        "category": {...},
        "supplier": {...},
        "specifications": {
            "coverage": "12.5 m²/liter",
            "dryingTime": "2-4 hours",
            "application": "Brush, roller, spray",
            "temperature": "5-35°C",
            "humidity": "Max 85%"
        },
        "images": [...],
        "reviews": {
            "average": 4.3,
            "total": 156,
            "distribution": {
                "5": 89,
                "4": 45,
                "3": 15,
                "2": 5,
                "1": 2
            }
        },
        "relatedProducts": [...],
        "priceHistory": [
            {
                "price": 450000,
                "date": "2024-01-01T00:00:00Z"
            }
        ]
    }
}
```

#### POST /products (Admin/Supplier only)
Create new product
```json
Request Body:
{
    "name": "Sơn Dulux Weathershield",
    "description": "Sơn ngoại thất chống thời tiết",
    "brand": "Dulux",
    "categoryId": "uuid",
    "sku": "DULUX-WS-001",
    "color": "#FFFFFF",
    "finish": "MATTE",
    "coverage": 12.5,
    "volume": 5.0,
    "price": 450000,
    "images": ["image_url_1", "image_url_2"],
    "specifications": {...}
}
```

### Supplier Endpoints

#### GET /suppliers
Get list of suppliers with filtering
```json
Query Parameters:
- page: integer
- limit: integer
- province: string
- verified: boolean
- search: string

Response:
{
    "success": true,
    "data": {
        "suppliers": [
            {
                "id": "uuid",
                "companyName": "Công ty Sơn ABC",
                "description": "Chuyên cung cấp sơn chất lượng cao",
                "logo": "https://cdn.vncompare.com/suppliers/abc-logo.jpg",
                "website": "https://abc-paint.com",
                "isVerified": true,
                "rating": 4.5,
                "totalReviews": 234,
                "serviceAreas": ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng"],
                "deliveryZones": [...],
                "totalProducts": 156
            }
        ],
        "pagination": {...}
    }
}
```

#### GET /suppliers/{id}
Get detailed supplier information
```json
Response:
{
    "success": true,
    "data": {
        "id": "uuid",
        "companyName": "Công ty Sơn ABC",
        "description": "Chuyên cung cấp sơn chất lượng cao...",
        "logo": "https://cdn.vncompare.com/suppliers/abc-logo.jpg",
        "website": "https://abc-paint.com",
        "businessLicense": "0123456789",
        "taxCode": "0123456789",
        "isVerified": true,
        "rating": 4.5,
        "totalReviews": 234,
        "serviceAreas": [...],
        "deliveryZones": [...],
        "products": [...],
        "reviews": [...]
    }
}
```

### Order Endpoints

#### GET /orders (Authenticated)
Get user's orders
```json
Query Parameters:
- page: integer
- limit: integer
- status: string
- dateFrom: date
- dateTo: date

Response:
{
    "success": true,
    "data": {
        "orders": [
            {
                "id": "uuid",
                "orderNumber": "VN202401010001",
                "status": "DELIVERED",
                "subtotal": 900000,
                "shippingCost": 50000,
                "tax": 95000,
                "total": 1045000,
                "paymentMethod": "VNPAY",
                "paymentStatus": "PAID",
                "shippingAddress": {...},
                "orderItems": [
                    {
                        "product": {...},
                        "quantity": 2,
                        "unitPrice": 450000,
                        "totalPrice": 900000
                    }
                ],
                "createdAt": "2024-01-01T00:00:00Z",
                "deliveredAt": "2024-01-03T14:30:00Z"
            }
        ],
        "pagination": {...}
    }
}
```

#### POST /orders (Authenticated)
Create new order
```json
Request Body:
{
    "items": [
        {
            "productId": "uuid",
            "quantity": 2
        }
    ],
    "shippingAddressId": "uuid",
    "paymentMethod": "VNPAY",
    "notes": "Giao hàng vào buổi chiều"
}

Response:
{
    "success": true,
    "message": "Order created successfully",
    "data": {
        "order": {...},
        "paymentUrl": "https://vnpay.vn/payment/...",
        "orderNumber": "VN202401010001"
    }
}
```

### Address Endpoints

#### GET /addresses (Authenticated)
Get user's addresses
```json
Response:
{
    "success": true,
    "data": {
        "addresses": [
            {
                "id": "uuid",
                "type": "HOME",
                "recipientName": "Nguyễn Văn A",
                "phone": "+84901234567",
                "province": "Hồ Chí Minh",
                "district": "Quận 1",
                "ward": "Phường Bến Nghé",
                "street": "Đường Nguyễn Huệ",
                "houseNumber": "123",
                "postalCode": "700000",
                "isDefault": true,
                "coordinates": {
                    "lat": 10.7769,
                    "lng": 106.7009
                }
            }
        ]
    }
}
```

#### POST /addresses (Authenticated)
Create new address
```json
Request Body:
{
    "type": "HOME",
    "recipientName": "Nguyễn Văn A",
    "phone": "+84901234567",
    "province": "Hồ Chí Minh",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé",
    "street": "Đường Nguyễn Huệ",
    "houseNumber": "123",
    "postalCode": "700000",
    "isDefault": false
}
```

### Shipping Endpoints

#### GET /shipping/calculate
Calculate shipping cost
```json
Query Parameters:
- supplierId: string
- addressId: string
- items: array (product IDs and quantities)

Response:
{
    "success": true,
    "data": {
        "shippingOptions": [
            {
                "id": "uuid",
                "name": "Giao hàng tiêu chuẩn",
                "description": "Giao hàng trong 2-3 ngày làm việc",
                "cost": 50000,
                "estimatedDays": 3,
                "isAvailable": true
            },
            {
                "id": "uuid",
                "name": "Giao hàng nhanh",
                "description": "Giao hàng trong 1 ngày làm việc",
                "cost": 100000,
                "estimatedDays": 1,
                "isAvailable": true
            }
        ],
        "freeShippingThreshold": 500000,
        "isEligibleForFreeShipping": false
    }
}
```

### Review Endpoints

#### GET /products/{id}/reviews
Get product reviews
```json
Query Parameters:
- page: integer
- limit: integer
- rating: integer (1-5)
- sort: string (newest, oldest, helpful)

Response:
{
    "success": true,
    "data": {
        "reviews": [
            {
                "id": "uuid",
                "user": {
                    "id": "uuid",
                    "firstName": "Nguyễn",
                    "lastName": "Văn A",
                    "avatar": "https://cdn.vncompare.com/avatars/user.jpg"
                },
                "rating": 5,
                "title": "Sơn rất tốt",
                "comment": "Sơn chất lượng cao, màu sắc đẹp...",
                "images": [...],
                "isVerified": true,
                "helpful": 12,
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ],
        "pagination": {...},
        "summary": {
            "average": 4.3,
            "total": 156,
            "distribution": {...}
        }
    }
}
```

#### POST /products/{id}/reviews (Authenticated)
Create product review
```json
Request Body:
{
    "rating": 5,
    "title": "Sơn rất tốt",
    "comment": "Sơn chất lượng cao, màu sắc đẹp...",
    "images": ["image_url_1", "image_url_2"]
}
```

### Analytics Endpoints (Admin only)

#### GET /analytics/dashboard
Get dashboard analytics
```json
Response:
{
    "success": true,
    "data": {
        "overview": {
            "totalUsers": 1250,
            "totalProducts": 5600,
            "totalSuppliers": 45,
            "totalOrders": 890,
            "totalRevenue": 1250000000
        },
        "recentOrders": [...],
        "topProducts": [...],
        "salesChart": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "data": [100000, 150000, 200000, 180000, 220000, 250000]
        }
    }
}
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
    "header": {
        "alg": "HS256",
        "typ": "JWT"
    },
    "payload": {
        "sub": "user_uuid",
        "email": "user@example.com",
        "role": "USER",
        "iat": 1640995200,
        "exp": 1641081600
    }
}
```

### Role-Based Access Control
- **USER**: Can view products, create orders, manage profile
- **SUPPLIER**: Can manage products, view orders, access supplier dashboard
- **ADMIN**: Full access to all endpoints and analytics

### Security Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-API-Version: v1
```

## 📊 Response Format

### Success Response
```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {
        // Response data
    },
    "meta": {
        "timestamp": "2024-01-01T00:00:00Z",
        "requestId": "req_123456789"
    }
}
```

### Error Response
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Validation failed",
        "details": [
            {
                "field": "email",
                "message": "This email is already registered"
            }
        ]
    },
    "meta": {
        "timestamp": "2024-01-01T00:00:00Z",
        "requestId": "req_123456789"
    }
}
```

## 🚀 Performance & Caching

### Caching Strategy
- **Product listings**: 5 minutes cache
- **Product details**: 10 minutes cache
- **Supplier data**: 15 minutes cache
- **User profiles**: 30 minutes cache

### Rate Limiting
- **General API**: 1000 requests/hour per IP
- **Authenticated users**: 5000 requests/hour per user
- **File uploads**: 100 requests/hour per user

### Database Optimization
- Indexed fields: email, product SKU, order number
- Composite indexes for common queries
- Query optimization with Doctrine Query Builder

## 🧪 Testing Strategy

### Unit Tests
- Service layer testing
- Entity validation testing
- Repository method testing

### Integration Tests
- API endpoint testing
- Database integration testing
- Authentication flow testing

### Performance Tests
- Load testing with Apache Bench
- Database query performance testing
- Memory usage monitoring

## 📚 API Documentation

### OpenAPI Specification
The API follows OpenAPI 3.0 specification with comprehensive documentation available at:
- Development: `http://localhost:8000/api/docs`
- Production: `https://api.vncompare.com/api/docs`

### SDK Support
- PHP SDK for backend services
- JavaScript/TypeScript SDK for frontend
- Mobile SDK for React Native app

## 🔧 Development Setup

### Prerequisites
- PHP 8.2+
- Composer 2.0+
- PostgreSQL 14+
- Redis 6+
- Symfony CLI

### Installation
```bash
# Install dependencies
composer install

# Set up environment
cp .env.example .env

# Run database migrations
php bin/console doctrine:migrations:migrate

# Load fixtures (optional)
php bin/console doctrine:fixtures:load

# Start development server
symfony server:start
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vncompare_api"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET_KEY="your-jwt-secret-key"
JWT_PASSPHRASE="your-jwt-passphrase"

# External Services
ALGOLIA_APP_ID="your-algolia-app-id"
ALGOLIA_API_KEY="your-algolia-api-key"

# Email
MAILER_DSN="smtp://user:pass@smtp.example.com:587"

# File Storage
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET="vncompare-api-assets"
```

## 🚀 Deployment

### Production Environment
- **Server**: Ubuntu 22.04 LTS
- **Web Server**: Nginx with PHP-FPM
- **Database**: PostgreSQL 14+ with read replicas
- **Cache**: Redis Cluster
- **CDN**: Cloudflare
- **Monitoring**: Sentry + New Relic

### CI/CD Pipeline
- Automated testing on pull requests
- Code quality checks with PHPStan
- Security scanning with SensioLabs Security Checker
- Automated deployment to staging and production

---

This API structure provides a solid foundation for the VNCompare platform, ensuring scalability, security, and maintainability while meeting the specific requirements of Vietnam's paint comparison market.
