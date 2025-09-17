# Create New API Endpoint - VNCompare.com

## 🎯 Context
You are working on VNCompare.com, a paint comparison platform for Vietnam. Before creating any new API, you MUST:

1. **Read `AI_PROJECT_CONTEXT.md`** to understand the project structure
2. **Follow the established patterns** in the Symfony API backend
3. **Maintain consistency** with existing business logic

## 📋 API Creation Checklist

### 1. Project Structure
- **Backend**: Use Symfony 7.x in `apps/api/`
- **Database**: PostgreSQL with Doctrine ORM
- **Authentication**: JWT tokens with Lexik JWT Authentication Bundle
- **Documentation**: OpenAPI 3.0 with Nelmio API Doc Bundle

### 2. Required Files to Create/Update

#### Controller
- Create new controller in `apps/api/src/Controller/Api/`
- Follow naming convention: `{Entity}Controller.php`
- Extend `BaseApiController.php`
- Use proper annotations for OpenAPI documentation

#### Entity (if new)
- Create entity in `apps/api/src/Entity/`
- Follow existing patterns for relationships
- Include proper validation constraints
- Add Doctrine annotations

#### Repository
- Create repository in `apps/api/src/Repository/`
- Extend `ServiceEntityRepository`
- Add custom query methods if needed

#### Service
- Create service in `apps/api/src/Service/`
- Handle business logic
- Inject dependencies properly
- Follow single responsibility principle

### 3. API Endpoint Structure

#### Standard Endpoints
```php
GET    /api/v1/{resource}           // List with pagination and filters
GET    /api/v1/{resource}/{id}      // Get single item
POST   /api/v1/{resource}           // Create new item
PUT    /api/v1/{resource}/{id}      // Update item
DELETE /api/v1/{resource}/{id}      // Delete item
```

#### Response Format
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

### 4. Business Logic Considerations

#### Vietnam-Specific Features
- **Address Validation**: Use Vietnam administrative divisions (provinces, districts, wards)
- **Currency**: Always use VND (Vietnamese Dong)
- **Phone Numbers**: Validate Vietnamese phone format (+84)
- **Coverage Calculator**: Include paint coverage calculations (m²/liter)

#### Critical Business Rules
- **Coverage Formula**: `Paint Needed = Total Area ÷ Coverage Rate × Number of Coats`
- **Price Calculation**: `Total Price = Base Price + Shipping + Taxes`
- **Address Hierarchy**: Province → District → Ward

### 5. Security & Validation

#### Authentication
- Use JWT tokens for protected endpoints
- Implement role-based access control (USER, SUPPLIER, ADMIN)
- Add proper authorization checks

#### Validation
- Use Symfony Validator Component
- Create custom validators for Vietnamese-specific data
- Validate all input data
- Sanitize user inputs

#### Security Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-API-Version: v1
```

### 6. Database Considerations

#### Entity Relationships
- Follow existing relationship patterns
- Use proper foreign key constraints
- Consider cascade operations carefully
- Add indexes for performance

#### Migrations
- Create migration file in `apps/api/migrations/`
- Use descriptive migration names
- Test migrations on development database

### 7. Testing Requirements

#### Unit Tests
- Test service layer methods
- Test entity validation
- Test repository queries
- Mock external dependencies

#### Integration Tests
- Test API endpoints
- Test authentication flow
- Test database operations
- Test error handling

### 8. Documentation

#### OpenAPI Annotations
```php
/**
 * @OA\Get(
 *     path="/api/v1/products",
 *     summary="Get products list",
 *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Success")
 * )
 */
```

#### API Documentation
- Add comprehensive endpoint documentation
- Include request/response examples
- Document error codes and messages
- Add business logic explanations

### 9. Error Handling

#### Standard Error Response
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

#### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Authentication required
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `INTERNAL_ERROR`: Server error

### 10. Performance Considerations

#### Caching
- Implement Redis caching for frequently accessed data
- Cache product listings and supplier data
- Use appropriate cache TTL values

#### Database Optimization
- Add proper indexes
- Use efficient queries
- Consider pagination for large datasets
- Optimize N+1 query problems

### 11. Example Implementation

#### Controller Example
```php
<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Service\ProductService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

#[Route('/api/v1/products')]
class ProductController extends BaseApiController
{
    public function __construct(
        private ProductService $productService
    ) {}

    #[Route('', methods: ['GET'])]
    #[OA\Get(
        path: '/api/v1/products',
        summary: 'Get products list',
        responses: [
            new OA\Response(response: 200, description: 'Success')
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        try {
            $products = $this->productService->getProducts($request->query->all());
            return $this->successResponse($products);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
}
```

### 12. Deployment Considerations

#### Environment Variables
- Add new environment variables if needed
- Update `.env.example` file
- Document configuration requirements

#### Database Changes
- Test migrations on staging environment
- Plan for zero-downtime deployments
- Backup database before major changes

## 🚨 Important Reminders

1. **Always read `AI_PROJECT_CONTEXT.md` first**
2. **Follow existing patterns and conventions**
3. **Test critical business logic thoroughly**
4. **Validate Vietnam-specific data properly**
5. **Update documentation after implementation**
6. **Consider performance implications**
7. **Implement proper error handling**
8. **Add comprehensive tests**

## 📚 Reference Files

- `AI_PROJECT_CONTEXT.md`: Project overview and architecture
- `apps/api/src/Controller/Api/`: Existing API controllers
- `apps/api/src/Entity/`: Database entities
- `apps/api/src/Service/`: Business logic services
- `API_STRUCTURE.md`: Detailed API documentation

---

**Remember**: This is a Vietnam-specific paint comparison platform. Always consider the local market requirements, address system, and business logic when creating new APIs.
