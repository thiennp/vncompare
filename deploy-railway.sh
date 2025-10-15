#!/bin/bash

echo "🚀 VNCompare API Railway Deployment Script"
echo "=========================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    pnpm add -g @railway/cli
fi

echo "✅ Railway CLI is installed"

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway:"
    echo "Run: railway login"
    echo "This will open a browser window for authentication"
    exit 1
fi

echo "✅ Logged in to Railway"

# Check if project is initialized
if [ ! -f ".railway/project.json" ]; then
    echo "📁 Initializing Railway project..."
    railway init
fi

echo "✅ Railway project initialized"

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to Railway dashboard: https://railway.app/dashboard"
echo "2. Select your project"
echo "3. Go to 'Variables' tab"
echo "4. Add these environment variables:"
echo "   - MONGODB_URI: Your MongoDB Atlas connection string"
echo "   - JWT_SECRET: A secure random string"
echo "   - NODE_ENV: production"
echo "5. Redeploy: railway up"
echo ""
echo "🧪 Test your deployment:"
echo "curl https://your-app-name.railway.app/api/health"
echo "curl https://your-app-name.railway.app/api-docs/"
