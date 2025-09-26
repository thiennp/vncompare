#!/bin/bash

# VNCompare Development Startup Script

echo "🚀 Starting VNCompare Development Environment..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    mkdir -p /tmp/mongodb
    mongod --dbpath /tmp/mongodb --port 27017 &
    sleep 3
    echo "✅ MongoDB started"
else
    echo "✅ MongoDB is already running"
fi

# Check if database is seeded
echo "🌱 Checking database..."
if ! mongosh vncompare --eval "db.users.countDocuments()" --quiet | grep -q "[1-9]"; then
    echo "📊 Seeding database with sample data..."
    MONGODB_URI=mongodb://localhost:27017/vncompare JWT_SECRET=your-super-secret-jwt-key-for-development-only NODE_ENV=development pnpm run db:seed
    echo "✅ Database seeded"
else
    echo "✅ Database already has data"
fi

# Start development server
echo "🎯 Starting development server..."
echo "📍 Application will be available at: http://localhost:3000"
echo "👤 Admin account: admin@vncompare.com / admin123"
echo "👤 Customer account: customer@example.com / customer123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

MONGODB_URI=mongodb://localhost:27017/vncompare JWT_SECRET=your-super-secret-jwt-key-for-development-only NODE_ENV=development pnpm dev
