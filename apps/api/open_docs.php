<?php

echo "🎨 VNCompare API Documentation\n";
echo "==============================\n\n";

echo "📚 Available Documentation:\n";
echo "1. Interactive Swagger UI: http://localhost:8000/api-docs.html\n";
echo "2. OpenAPI JSON Spec: http://localhost:8000/api/doc.json\n";
echo "3. API Health Check: http://localhost:8000/api/v1/health\n";
echo "4. API Status: http://localhost:8000/api/v1/status\n\n";

echo "🚀 Opening documentation in browser...\n";

// Try to open the documentation in the default browser
$url = 'http://localhost:8000/api-docs.html';

if (PHP_OS_FAMILY === 'Darwin') {
    // macOS
    exec("open '$url'");
} elseif (PHP_OS_FAMILY === 'Windows') {
    // Windows
    exec("start '$url'");
} else {
    // Linux
    exec("xdg-open '$url'");
}

echo "✅ Documentation should now be open in your browser!\n\n";

echo "📖 What you can do in the documentation:\n";
echo "• Browse all API endpoints\n";
echo "• Test endpoints directly in the browser\n";
echo "• View request/response examples\n";
echo "• Copy cURL commands\n";
echo "• Download the OpenAPI specification\n\n";

echo "🔧 API Endpoints Overview:\n";
echo "• System: Health check, status\n";
echo "• Authentication: Register, login, logout\n";
echo "• Products: List, search, details\n";
echo "• Users: Profile management\n";
echo "• Orders: Order processing\n";
echo "• Addresses: Vietnam-specific address management\n";
echo "• Suppliers: Supplier management\n";
echo "• Reviews: Product reviews and ratings\n\n";

echo "🇻🇳 VNCompare API v1.0.0 - Ready for development! 🎨\n";
