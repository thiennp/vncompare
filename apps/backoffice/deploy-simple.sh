#!/bin/bash

# Simple deployment script for backoffice
echo "🚀 Starting backoffice deployment..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if dist directory exists
    if [ -d "dist/backoffice/browser" ]; then
        echo "📁 Build output found at dist/backoffice/browser"
        
        # List files to verify
        echo "📋 Files in build output:"
        ls -la dist/backoffice/browser/ | head -10
        
        echo ""
        echo "🎯 Next steps:"
        echo "1. Go to https://app.netlify.com/"
        echo "2. Find your 'vncompare-backoffice' site"
        echo "3. Go to 'Deploys' tab"
        echo "4. Click 'Trigger deploy' or 'Deploy site'"
        echo "5. The new build will use the updated configuration"
        echo ""
        echo "✅ The application is ready for deployment!"
        echo "🌐 After deployment, test: https://vncompare-backoffice.netlify.app/products/add"
        
    else
        echo "❌ Build output not found!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
