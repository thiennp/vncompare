<?php

echo "🎨 VNCompare API v1.0.0 - Interactive Viewer\n";
echo "============================================\n\n";

// Check if server is running
$healthUrl = 'http://localhost:8000/api/v1/health';
$statusUrl = 'http://localhost:8000/api/v1/status';

echo "🔍 CHECKING API STATUS...\n";
echo "========================\n\n";

// Test health endpoint
$healthResponse = @file_get_contents($healthUrl);
if ($healthResponse) {
    $healthData = json_decode($healthResponse, true);
    echo "✅ API is RUNNING!\n";
    echo "   Version: " . $healthData['data']['version'] . "\n";
    echo "   Status: " . $healthData['data']['status'] . "\n";
    echo "   Environment: " . $healthData['data']['environment'] . "\n";
    echo "   Timestamp: " . $healthData['data']['timestamp'] . "\n\n";
} else {
    echo "❌ API is NOT running!\n";
    echo "   Please start the server with: php -S localhost:8000 -t public\n\n";
    exit(1);
}

// Test status endpoint
$statusResponse = @file_get_contents($statusUrl);
if ($statusResponse) {
    $statusData = json_decode($statusResponse, true);
    echo "📊 SYSTEM STATUS:\n";
    echo "   API: " . $statusData['data']['api'] . "\n";
    echo "   Version: " . $statusData['data']['version'] . "\n";
    echo "   Status: " . $statusData['data']['status'] . "\n";
    echo "   Uptime: " . $statusData['data']['uptime'] . "\n";
    echo "   Database: " . $statusData['data']['database'] . "\n";
    echo "   Cache: " . $statusData['data']['cache'] . "\n\n";
}

echo "🚀 AVAILABLE ENDPOINTS:\n";
echo "=======================\n\n";

$endpoints = [
    'Authentication' => [
        'POST /auth/register' => 'Register new user',
        'POST /auth/login' => 'User login',
        'POST /auth/refresh' => 'Refresh JWT token',
        'POST /auth/logout' => 'Logout user',
    ],
    'Products' => [
        'GET /products' => 'List products with filtering',
        'GET /products/{id}' => 'Get product details',
        'POST /products' => 'Create product (Supplier)',
        'GET /products/search' => 'Search products',
        'GET /products/featured' => 'Get featured products',
    ],
    'Users' => [
        'GET /users/profile' => 'Get user profile',
        'PUT /users/profile' => 'Update user profile',
        'POST /users/avatar' => 'Upload avatar',
        'GET /users/notifications' => 'Get user notifications',
    ],
    'Orders' => [
        'GET /orders' => 'Get user orders',
        'POST /orders' => 'Create order',
        'GET /orders/{id}/tracking' => 'Get tracking information',
    ],
    'System' => [
        'GET /health' => 'Health check ✅',
        'GET /status' => 'System status ✅',
    ],
];

foreach ($endpoints as $category => $categoryEndpoints) {
    echo "📁 $category\n";
    echo str_repeat('-', strlen($category) + 3) . "\n";
    
    foreach ($categoryEndpoints as $endpoint => $description) {
        $status = strpos($description, '✅') !== false ? '✅' : '🔗';
        echo "  $status $endpoint - $description\n";
    }
    echo "\n";
}

echo "🧪 TEST COMMANDS:\n";
echo "=================\n";
echo "curl http://localhost:8000/api/v1/health\n";
echo "curl http://localhost:8000/api/v1/status\n";
echo "curl -X POST http://localhost:8000/api/v1/auth/register \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\"}'\n\n";

echo "📚 DOCUMENTATION:\n";
echo "=================\n";
echo "• API Structure: API_VISUALIZATION.md\n";
echo "• API Documentation: README.md\n";
echo "• Database Schema: migrations/Version20240909000000.php\n\n";

echo "🇻🇳 VNCompare API v1.0.0 - Ready to use! 🎨\n";
