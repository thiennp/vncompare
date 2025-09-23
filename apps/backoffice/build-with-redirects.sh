#!/bin/bash

# Build script with automatic _redirects file creation
echo "🚀 Building backoffice with routing fix..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Create _redirects file for SPA routing
    echo "🔧 Creating _redirects file for SPA routing..."
    echo "/*    /index.html   200" > dist/backoffice/browser/_redirects
    
    # Verify the file was created
    if [ -f "dist/backoffice/browser/_redirects" ]; then
        echo "✅ _redirects file created successfully!"
        echo "📋 Content of _redirects file:"
        cat dist/backoffice/browser/_redirects
    else
        echo "❌ Failed to create _redirects file!"
        exit 1
    fi
    
    echo ""
    echo "🎯 Ready for deployment!"
    echo "📁 Build output: dist/backoffice/browser/"
    echo "🌐 After deployment, test: https://vncompare-backoffice.netlify.app/products/add"
    
else
    echo "❌ Build failed!"
    exit 1
fi
