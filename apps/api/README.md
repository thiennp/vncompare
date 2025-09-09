# VNCompare API

A comprehensive REST API for Vietnam's premier paint comparison platform built with Symfony 7.x.

## 🚀 Features

- **Authentication**: JWT-based authentication with role-based access control
- **Products**: Complete product management with search, filtering, and categorization
- **Suppliers**: Supplier registration, verification, and management
- **Orders**: Full order lifecycle management with tracking
- **Reviews**: Product reviews and ratings system
- **Addresses**: Vietnam-specific address management
- **Shipping**: Shipping cost calculation and delivery management
- **Notifications**: Real-time notifications system
- **Analytics**: Comprehensive analytics and reporting

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/verify-email` - Verify email address

### Products
- `GET /api/v1/products` - List products with filtering
- `GET /api/v1/products/{id}` - Get product details
- `POST /api/v1/products` - Create product (Supplier/Admin)
- `PUT /api/v1/products/{id}` - Update product (Supplier/Admin)
- `DELETE /api/v1/products/{id}` - Delete product (Admin)
- `GET /api/v1/products/search` - Search products
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/{id}/similar` - Get similar products

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/avatar` - Upload avatar
- `DELETE /api/v1/users/avatar` - Delete avatar
- `PUT /api/v1/users/password` - Change password
- `POST /api/v1/users/verify-phone` - Send phone verification
- `POST /api/v1/users/confirm-phone` - Confirm phone verification

### Orders
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/{id}` - Get order details
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/{id}` - Update order
- `POST /api/v1/orders/{id}/cancel` - Cancel order
- `POST /api/v1/orders/{id}/return` - Request return
- `GET /api/v1/orders/{id}/tracking` - Get tracking info

### Addresses
- `GET /api/v1/addresses` - Get user addresses
- `POST /api/v1/addresses` - Create address
- `PUT /api/v1/addresses/{id}` - Update address
- `DELETE /api/v1/addresses/{id}` - Delete address
- `PUT /api/v1/addresses/{id}/default` - Set default address
- `GET /api/v1/addresses/provinces` - Get provinces
- `GET /api/v1/addresses/provinces/{id}/districts` - Get districts
- `GET /api/v1/addresses/districts/{id}/wards` - Get wards

### Suppliers
- `GET /api/v1/suppliers` - List suppliers
- `GET /api/v1/suppliers/{id}` - Get supplier details
- `POST /api/v1/suppliers` - Register supplier
- `PUT /api/v1/suppliers/{id}` - Update supplier
- `POST /api/v1/suppliers/{id}/verify` - Verify supplier (Admin)
- `GET /api/v1/suppliers/dashboard` - Supplier dashboard
- `GET /api/v1/suppliers/orders` - Supplier orders
- `GET /api/v1/suppliers/analytics` - Supplier analytics

### Reviews
- `GET /api/v1/products/{id}/reviews` - Get product reviews
- `POST /api/v1/products/{id}/reviews` - Create review
- `PUT /api/v1/reviews/{id}` - Update review
- `DELETE /api/v1/reviews/{id}` - Delete review
- `POST /api/v1/reviews/{id}/helpful` - Mark helpful
- `POST /api/v1/reviews/{id}/report` - Report review

### System
- `GET /api/v1/health` - Health check
- `GET /api/v1/status` - System status

## 🛠 Installation

### Prerequisites
- PHP 8.2+
- Composer 2.0+
- PostgreSQL 14+
- Redis 6+ (optional)

### Setup
```bash
# Install dependencies
composer install

# Set up environment
cp .env.example .env.local

# Configure database URL in .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/vncompare_api"

# Run database migrations
php bin/console doctrine:migrations:migrate

# Generate JWT keys (if not already generated)
mkdir -p config/jwt
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:your_passphrase
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem -passin pass:your_passphrase

# Start development server
symfony server:start
```

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vncompare_api"

# JWT
JWT_SECRET_KEY="%kernel.project_dir%/config/jwt/private.pem"
JWT_PUBLIC_KEY="%kernel.project_dir%/config/jwt/public.pem"
JWT_PASSPHRASE="your_jwt_passphrase"

# Redis
REDIS_URL="redis://localhost:6379"

# External Services
ALGOLIA_APP_ID="your_algolia_app_id"
ALGOLIA_API_KEY="your_algolia_api_key"
MAILER_DSN="smtp://localhost:1025"

# Payment Gateways
VNPAY_TMN_CODE="your_vnpay_tmn_code"
VNPAY_HASH_SECRET="your_vnpay_hash_secret"
MOMO_PARTNER_CODE="your_momo_partner_code"
MOMO_ACCESS_KEY="your_momo_access_key"
MOMO_SECRET_KEY="your_momo_secret_key"
```

## 📚 API Documentation

The API follows OpenAPI 3.0 specification. Documentation is available at:
- Development: `http://localhost:8000/api/docs`
- Production: `https://api.vncompare.com/api/docs`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Roles
- **ROLE_USER**: Basic user permissions
- **ROLE_SUPPLIER**: Supplier-specific permissions
- **ROLE_ADMIN**: Full administrative access

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

## 🧪 Testing

```bash
# Run tests
php bin/phpunit

# Run specific test suite
php bin/phpunit tests/Controller/
```

## 🚀 Deployment

### Production Environment
- **Server**: Ubuntu 22.04 LTS
- **Web Server**: Nginx with PHP-FPM
- **Database**: PostgreSQL 14+ with read replicas
- **Cache**: Redis Cluster
- **CDN**: Cloudflare

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📈 Performance

- **Response Time**: < 200ms average
- **Throughput**: 1000+ requests/second
- **Uptime**: 99.9% SLA
- **Caching**: Redis for API responses
- **Database**: Optimized queries with proper indexing

## 🔒 Security

- **HTTPS**: SSL/TLS encryption
- **JWT**: Secure token-based authentication
- **Rate Limiting**: API request throttling
- **Input Validation**: Comprehensive data validation
- **SQL Injection**: Protected with Doctrine ORM
- **XSS Prevention**: Input sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [API Docs](https://api.vncompare.com/docs)
- **Issues**: [GitHub Issues](https://github.com/vncompare/api/issues)
- **Email**: api-support@vncompare.com

---

**VNCompare API** - Making paint shopping in Vietnam easier, smarter, and more affordable! 🎨🇻🇳
