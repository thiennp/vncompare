#!/bin/bash

echo "🚀 Preparing backoffice files for manual upload..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Create _redirects file
    echo "🔧 Creating _redirects file..."
    echo "/*    /index.html   200" > dist/backoffice/browser/_redirects
    
    # Verify files
    echo "📋 Files ready for upload:"
    echo "📁 Upload directory: $(pwd)/dist/backoffice/browser/"
    echo ""
    echo "📄 Key files:"
    ls -la dist/backoffice/browser/ | head -10
    echo ""
    echo "🔑 _redirects file content:"
    cat dist/backoffice/browser/_redirects
    echo ""
    echo "🎯 Next steps:"
    echo "1. Go to https://app.netlify.com/"
    echo "2. Find 'vncompare-backoffice' site"
    echo "3. Go to 'Deploys' tab"
    echo "4. Click 'Deploy manually' or 'Drag and drop'"
    echo "5. Upload the entire 'dist/backoffice/browser' folder"
    echo ""
    echo "✅ Files are ready for manual upload!"
    
else
    echo "❌ Build failed!"
    exit 1
fi
