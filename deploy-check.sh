#!/bin/bash

echo "🚀 VNCompare API Server Deployment"
echo "=================================="

# Check if server is running
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Server is running on http://localhost:3001"
    echo "📚 API Documentation: http://localhost:3001/api-docs"
    echo "🔍 Health Check: http://localhost:3001/api/health"
    echo ""
    echo "🧪 Test endpoints:"
    echo "curl http://localhost:3001/api/users"
    echo "curl -X POST http://localhost:3001/api/login -H 'Content-Type: application/json' -d '{\"email\":\"nguyenphongthien@gmail.com\",\"password\":\"Kimtuoc2\"}'"
else
    echo "❌ Server is not running"
    echo "Start the server with: npm run server:deploy"
fi

echo ""
echo "🌐 For Railway deployment:"
echo "1. Push this code to GitHub"
echo "2. Connect repository to Railway"
echo "3. Railway will auto-deploy using railway.toml"
echo "4. Access your API at the Railway URL"
