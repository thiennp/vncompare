#!/bin/bash

# VNCompare Symfony API Deployment Script for Render
echo "🚀 Starting VNCompare API deployment..."

# Set production environment
export APP_ENV=prod
export APP_DEBUG=false

# Install dependencies
echo "📦 Installing dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Clear cache
echo "🧹 Clearing cache..."
php bin/console cache:clear --env=prod --no-debug

# Run database migrations
echo "🗄️ Running database migrations..."
php bin/console doctrine:migrations:migrate --no-interaction --env=prod

# Create database if it doesn't exist
echo "🗃️ Ensuring database exists..."
php bin/console doctrine:database:create --if-not-exists --env=prod

# Generate JWT keys if they don't exist
if [ ! -f "config/jwt/private.pem" ]; then
    echo "🔑 Generating JWT keys..."
    mkdir -p config/jwt
    openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:${JWT_PASSPHRASE:-vncompare2024}
    openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem -passin pass:${JWT_PASSPHRASE:-vncompare2024}
    chmod 644 config/jwt/public.pem
    chmod 600 config/jwt/private.pem
fi

# Warm up cache
echo "🔥 Warming up cache..."
php bin/console cache:warmup --env=prod

echo "✅ Deployment completed successfully!"
echo "🌐 Your API is ready at: https://your-app-name.onrender.com"
