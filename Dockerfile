# Force PHP 8.2 with Composer
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install zip pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy only the API directory (exclude Node.js files)
COPY apps/api/ /app/

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Clear cache
RUN php bin/console cache:clear --env=prod

# Create database if it doesn't exist
RUN php bin/console doctrine:database:create --if-not-exists --env=prod

# Run migrations
RUN php bin/console doctrine:migrations:migrate --no-interaction --env=prod

# Expose port
EXPOSE 8000

# Start command
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
