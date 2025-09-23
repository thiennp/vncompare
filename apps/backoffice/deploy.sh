#!/bin/bash

# VNCompare Backoffice Deployment Script
# This script builds and deploys the backoffice to Netlify

set -e

echo "🚀 Starting VNCompare Backoffice deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the backoffice directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist/backoffice" ]; then
    echo "❌ Error: Build failed. dist/backoffice directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
if command -v netlify &> /dev/null; then
    # Deploy the already-built directory without running Netlify Build (avoids angular runtime plugin path issues)
    netlify deploy --prod --dir=dist/backoffice --build false
    echo "✅ Deployment completed successfully!"
    echo "🌍 Your backoffice is now live at admin.vncompare.com"
else
    echo "⚠️  Netlify CLI not found. Please install it with: npm install -g netlify-cli"
    echo "📁 Build files are ready in dist/backoffice/"
    echo "🔧 You can manually deploy these files to Netlify or any other hosting service."
fi

echo "🎉 Deployment process completed!"
