<?php

echo "🎨 VNCompare API v1.0.0 - Visual Structure\n";
echo "==========================================\n\n";

echo "📊 API VERSION INFORMATION\n";
echo "-------------------------\n";
echo "Version: 1.0.0\n";
echo "Base URL: http://localhost:8000/api/v1/\n";
echo "Protocol: HTTP/HTTPS\n";
echo "Format: JSON\n";
echo "Authentication: JWT Bearer Token\n\n";

echo "🔗 API ENDPOINTS STRUCTURE\n";
echo "==========================\n\n";

$endpoints = [
    'Authentication' => [
        'POST /auth/register' => 'Register new user',
        'POST /auth/login' => 'User login',
        'POST /auth/refresh' => 'Refresh JWT token',
        'POST /auth/logout' => 'Logout user',
        'POST /auth/forgot-password' => 'Request password reset',
        'POST /auth/reset-password' => 'Reset password',
        'POST /auth/verify-email' => 'Verify email address',
        'POST /auth/resend-verification' => 'Resend verification email',
    ],
    'Products' => [
        'GET /products' => 'List products with filtering',
        'GET /products/{id}' => 'Get product details',
        'POST /products' => 'Create product (Supplier)',
        'PUT /products/{id}' => 'Update product (Supplier)',
        'DELETE /products/{id}' => 'Delete product (Admin)',
        'PATCH /products/{id}/status' => 'Toggle product status',
        'GET /products/search' => 'Search products',
        'GET /products/featured' => 'Get featured products',
        'GET /products/{id}/similar' => 'Get similar products',
        'GET /products/{id}/reviews' => 'Get product reviews',
    ],
    'Users' => [
        'GET /users/profile' => 'Get user profile',
        'PUT /users/profile' => 'Update user profile',
        'POST /users/avatar' => 'Upload avatar',
        'DELETE /users/avatar' => 'Delete avatar',
        'PUT /users/password' => 'Change password',
        'POST /users/verify-phone' => 'Send phone verification',
        'POST /users/confirm-phone' => 'Confirm phone verification',
        'GET /users/preferences' => 'Get user preferences',
        'PUT /users/preferences' => 'Update preferences',
        'GET /users/notifications' => 'Get user notifications',
        'GET /users/notifications/settings' => 'Get notification settings',
        'PUT /users/notifications/settings' => 'Update notification settings',
    ],
    'Orders' => [
        'GET /orders' => 'Get user orders',
        'GET /orders/{id}' => 'Get order details',
        'POST /orders' => 'Create order',
        'PUT /orders/{id}' => 'Update order',
        'POST /orders/{id}/cancel' => 'Cancel order',
        'POST /orders/{id}/return' => 'Request return',
        'GET /orders/{id}/items' => 'Get order items',
        'GET /orders/{id}/tracking' => 'Get tracking information',
    ],
    'Addresses' => [
        'GET /addresses' => 'Get user addresses',
        'GET /addresses/{id}' => 'Get address details',
        'POST /addresses' => 'Create address',
        'PUT /addresses/{id}' => 'Update address',
        'DELETE /addresses/{id}' => 'Delete address',
        'PUT /addresses/{id}/default' => 'Set default address',
        'GET /addresses/provinces' => 'Get provinces',
        'GET /addresses/provinces/{id}/districts' => 'Get districts by province',
        'GET /addresses/districts/{id}/wards' => 'Get wards by district',
        'POST /addresses/validate' => 'Validate address',
        'GET /addresses/geocode' => 'Geocode address',
    ],
    'Suppliers' => [
        'GET /suppliers' => 'List suppliers',
        'GET /suppliers/{id}' => 'Get supplier details',
        'POST /suppliers' => 'Register supplier',
        'PUT /suppliers/{id}' => 'Update supplier',
        'POST /suppliers/{id}/verify' => 'Verify supplier (Admin)',
        'GET /suppliers/{id}/products' => 'Get supplier products',
        'GET /suppliers/dashboard' => 'Supplier dashboard',
        'GET /suppliers/orders' => 'Supplier orders',
        'GET /suppliers/analytics' => 'Supplier analytics',
        'GET /suppliers/reviews' => 'Supplier reviews',
    ],
    'Reviews' => [
        'GET /products/{id}/reviews' => 'Get product reviews',
        'POST /products/{id}/reviews' => 'Create review',
        'PUT /reviews/{id}' => 'Update review',
        'DELETE /reviews/{id}' => 'Delete review',
        'POST /reviews/{id}/helpful' => 'Mark review as helpful',
        'POST /reviews/{id}/report' => 'Report review',
        'GET /users/reviews' => 'Get user reviews',
        'GET /reviews/pending' => 'Get pending reviews (Admin)',
        'PUT /reviews/{id}/moderate' => 'Moderate review (Admin)',
    ],
    'System' => [
        'GET /health' => 'Health check',
        'GET /status' => 'System status',
    ],
];

$totalEndpoints = 0;
foreach ($endpoints as $category => $categoryEndpoints) {
    echo "📁 $category\n";
    echo str_repeat('-', strlen($category) + 3) . "\n";
    
    foreach ($categoryEndpoints as $endpoint => $description) {
        echo sprintf("  %-30s %s\n", $endpoint, $description);
        $totalEndpoints++;
    }
    echo "\n";
}

echo "📈 API STATISTICS\n";
echo "================\n";
echo "Total Endpoints: $totalEndpoints\n";
echo "Authentication: 8 endpoints\n";
echo "Products: 10 endpoints\n";
echo "Users: 12 endpoints\n";
echo "Orders: 8 endpoints\n";
echo "Addresses: 12 endpoints\n";
echo "Suppliers: 10 endpoints\n";
echo "Reviews: 9 endpoints\n";
echo "System: 2 endpoints\n\n";

echo "🚀 QUICK TEST COMMANDS\n";
echo "=====================\n";
echo "curl http://localhost:8000/api/v1/health\n";
echo "curl http://localhost:8000/api/v1/status\n";
echo "curl -X POST http://localhost:8000/api/v1/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\"}'\n\n";

echo "🎯 RESPONSE FORMAT\n";
echo "==================\n";
echo "Success Response:\n";
echo "{\n";
echo "  \"success\": true,\n";
echo "  \"message\": \"Operation completed successfully\",\n";
echo "  \"data\": { /* Response data */ },\n";
echo "  \"meta\": {\n";
echo "    \"timestamp\": \"2024-01-01T00:00:00Z\",\n";
echo "    \"requestId\": \"req_123456789\"\n";
echo "  }\n";
echo "}\n\n";

echo "Error Response:\n";
echo "{\n";
echo "  \"success\": false,\n";
echo "  \"error\": {\n";
echo "    \"code\": \"VALIDATION_ERROR\",\n";
echo "    \"message\": \"Validation failed\",\n";
echo "    \"details\": [/* Error details */]\n";
echo "  },\n";
echo "  \"meta\": {\n";
echo "    \"timestamp\": \"2024-01-01T00:00:00Z\",\n";
echo "    \"requestId\": \"req_123456789\"\n";
echo "  }\n";
echo "}\n\n";

echo "🇻🇳 VNCompare API v1.0.0 - Making paint shopping in Vietnam easier! 🎨\n";
