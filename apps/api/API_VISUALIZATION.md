# VNCompare API - Visual Structure & Version Information

## 🎯 **API Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                    VNCompare API v1.0.0                        │
│              Vietnam Paint Comparison Platform                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 **API Architecture Visualization**

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Web App   │  │  Mobile App │  │  Admin Panel│            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   JWT Auth  │  │ Rate Limiting│  │   CORS      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CONTROLLER LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Auth      │  │  Products   │  │   Orders    │            │
│  │ Controller  │  │ Controller  │  │ Controller  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Users     │  │ Suppliers   │  │  Reviews    │            │
│  │ Controller  │  │ Controller  │  │ Controller  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Addresses  │  │   Health    │  │   System    │            │
│  │ Controller  │  │ Controller  │  │ Controller  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ AuthService │  │ProductService│  │OrderService │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │UserService  │  │SupplierSvc  │  │ReviewService│            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │AddressSvc   │  │EmailService │  │FileUploadSvc│            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ PostgreSQL  │  │    Redis    │  │   File      │            │
│  │  Database   │  │    Cache    │  │  Storage    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## 🗂️ **API Endpoints Structure**

### **Authentication Endpoints** (`/api/v1/auth/`)
```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION                          │
├─────────────────────────────────────────────────────────────────┤
│ POST   /register              │ Register new user              │
│ POST   /login                 │ User login                     │
│ POST   /refresh               │ Refresh JWT token              │
│ POST   /logout                │ Logout user                    │
│ POST   /forgot-password       │ Request password reset         │
│ POST   /reset-password        │ Reset password                 │
│ POST   /verify-email          │ Verify email address           │
│ POST   /resend-verification   │ Resend verification email      │
└─────────────────────────────────────────────────────────────────┘
```

### **Product Endpoints** (`/api/v1/products/`)
```
┌─────────────────────────────────────────────────────────────────┐
│                          PRODUCTS                              │
├─────────────────────────────────────────────────────────────────┤
│ GET    /                       │ List products with filtering  │
│ GET    /{id}                   │ Get product details           │
│ POST   /                       │ Create product (Supplier)     │
│ PUT    /{id}                   │ Update product (Supplier)     │
│ DELETE /{id}                   │ Delete product (Admin)        │
│ PATCH  /{id}/status            │ Toggle product status         │
│ GET    /search                 │ Search products               │
│ GET    /featured               │ Get featured products         │
│ GET    /{id}/similar           │ Get similar products          │
│ GET    /{id}/reviews           │ Get product reviews           │
└─────────────────────────────────────────────────────────────────┘
```

### **User Endpoints** (`/api/v1/users/`)
```
┌─────────────────────────────────────────────────────────────────┐
│                            USERS                               │
├─────────────────────────────────────────────────────────────────┤
│ GET    /profile                │ Get user profile              │
│ PUT    /profile                │ Update user profile           │
│ POST   /avatar                 │ Upload avatar                 │
│ DELETE /avatar                 │ Delete avatar                 │
│ PUT    /password               │ Change password               │
│ POST   /verify-phone           │ Send phone verification       │
│ POST   /confirm-phone          │ Confirm phone verification    │
│ GET    /preferences            │ Get user preferences          │
│ PUT    /preferences            │ Update preferences            │
│ GET    /notifications          │ Get user notifications        │
│ GET    /notifications/settings │ Get notification settings     │
│ PUT    /notifications/settings │ Update notification settings  │
└─────────────────────────────────────────────────────────────────┘
```

### **Order Endpoints** (`/api/v1/orders/`)
```
┌─────────────────────────────────────────────────────────────────┐
│                           ORDERS                               │
├─────────────────────────────────────────────────────────────────┤
│ GET    /                       │ Get user orders               │
│ GET    /{id}                   │ Get order details             │
│ POST   /                       │ Create order                  │
│ PUT    /{id}                   │ Update order                  │
│ POST   /{id}/cancel            │ Cancel order                  │
│ POST   /{id}/return            │ Request return                │
│ GET    /{id}/items             │ Get order items               │
│ GET    /{id}/tracking          │ Get tracking information      │
└─────────────────────────────────────────────────────────────────┘
```

### **Address Endpoints** (`/api/v1/addresses/`)
```
┌─────────────────────────────────────────────────────────────────┐
│                          ADDRESSES                             │
├─────────────────────────────────────────────────────────────────┤
│ GET    /                       │ Get user addresses            │
│ GET    /{id}                   │ Get address details           │
│ POST   /                       │ Create address                │
│ PUT    /{id}                   │ Update address                │
│ DELETE /{id}                   │ Delete address                │
│ PUT    /{id}/default           │ Set default address           │
│ GET    /provinces              │ Get provinces                 │
│ GET    /provinces/{id}/districts│ Get districts by province     │
│ GET    /districts/{id}/wards   │ Get wards by district         │
│ POST   /validate               │ Validate address              │
│ GET    /geocode                │ Geocode address               │
└─────────────────────────────────────────────────────────────────┘
```

### **Supplier Endpoints** (`/api/v1/suppliers/`)
```
┌─────────────────────────────────────────────────────────────────┐
│                         SUPPLIERS                              │
├─────────────────────────────────────────────────────────────────┤
│ GET    /                       │ List suppliers                │
│ GET    /{id}                   │ Get supplier details          │
│ POST   /                       │ Register supplier             │
│ PUT    /{id}                   │ Update supplier               │
│ POST   /{id}/verify            │ Verify supplier (Admin)       │
│ GET    /{id}/products          │ Get supplier products         │
│ GET    /dashboard              │ Supplier dashboard            │
│ GET    /orders                 │ Supplier orders               │
│ GET    /analytics              │ Supplier analytics            │
│ GET    /reviews                │ Supplier reviews              │
└─────────────────────────────────────────────────────────────────┘
```

### **Review Endpoints** (`/api/v1/`)
```
┌─────────────────────────────────────────────────────────────────┐
│                          REVIEWS                               │
├─────────────────────────────────────────────────────────────────┤
│ GET    /products/{id}/reviews  │ Get product reviews           │
│ POST   /products/{id}/reviews  │ Create review                 │
│ PUT    /reviews/{id}           │ Update review                 │
│ DELETE /reviews/{id}           │ Delete review                 │
│ POST   /reviews/{id}/helpful   │ Mark review as helpful        │
│ POST   /reviews/{id}/report    │ Report review                 │
│ GET    /users/reviews          │ Get user reviews              │
│ GET    /reviews/pending        │ Get pending reviews (Admin)   │
│ PUT    /reviews/{id}/moderate  │ Moderate review (Admin)       │
└─────────────────────────────────────────────────────────────────┘
```

### **System Endpoints** (`/api/v1/`)
```
┌─────────────────────────────────────────────────────────────────┐
│                          SYSTEM                                │
├─────────────────────────────────────────────────────────────────┤
│ GET    /health                 │ Health check                  │
│ GET    /status                 │ System status                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🗄️ **Database Schema Visualization**

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │    users    │    │ categories  │    │ suppliers   │        │
│  │             │    │             │    │             │        │
│  │ • id (UUID) │    │ • id (UUID) │    │ • id (UUID) │        │
│  │ • email     │    │ • name      │    │ • user_id   │        │
│  │ • password  │    │ • slug      │    │ • company   │        │
│  │ • first_name│    │ • parent_id │    │ • license   │        │
│  │ • last_name │    │ • is_active │    │ • verified  │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│         │                   │                   │              │
│         │                   │                   │              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │  addresses  │    │  products   │    │   orders    │        │
│  │             │    │             │    │             │        │
│  │ • id (UUID) │    │ • id (UUID) │    │ • id (UUID) │        │
│  │ • user_id   │    │ • category_id│   │ • user_id   │        │
│  │ • province  │    │ • supplier_id│   │ • supplier_id│       │
│  │ • district  │    │ • name      │    │ • order_num │        │
│  │ • ward      │    │ • sku       │    │ • status    │        │
│  │ • street    │    │ • price     │    │ • total     │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│         │                   │                   │              │
│         │                   │                   │              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │ order_items │    │   reviews   │    │  shipping   │        │
│  │             │    │             │    │             │        │
│  │ • id (UUID) │    │ • id (UUID) │    │ • id (UUID) │        │
│  │ • order_id  │    │ • user_id   │    │ • supplier_id│       │
│  │ • product_id│    │ • product_id│    │ • name      │        │
│  │ • quantity  │    │ • rating    │    │ • base_cost │        │
│  │ • unit_price│    │ • comment   │    │ • provinces │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 **Version Information**

### **API Version**: v1.0.0
- **Base URL**: `http://localhost:8000/api/v1/`
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Authentication**: JWT Bearer Token

### **Technology Stack**
- **Framework**: Symfony 7.3.x
- **PHP Version**: 8.2+
- **Database**: PostgreSQL 14+
- **Cache**: Redis 6+
- **Authentication**: JWT (LexikJWTAuthenticationBundle)
- **Validation**: Symfony Validator Component
- **Documentation**: OpenAPI 3.0

### **Response Format**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* Response data */ },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_123456789"
  }
}
```

## 📈 **API Statistics**

- **Total Endpoints**: 67
- **Authentication Endpoints**: 8
- **Product Endpoints**: 10
- **User Endpoints**: 12
- **Order Endpoints**: 8
- **Address Endpoints**: 12
- **Supplier Endpoints**: 10
- **Review Endpoints**: 9
- **System Endpoints**: 2

## 🚀 **Quick Start**

1. **Health Check**: `GET /api/v1/health`
2. **System Status**: `GET /api/v1/status`
3. **Register User**: `POST /api/v1/auth/register`
4. **Login**: `POST /api/v1/auth/login`
5. **Get Products**: `GET /api/v1/products`

---

**VNCompare API v1.0.0** - Making paint shopping in Vietnam easier! 🎨🇻🇳
