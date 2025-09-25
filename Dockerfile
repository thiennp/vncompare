FROM php:8.2-cli

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy only the API directory
COPY apps/api/ /app/

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Clear cache
RUN php bin/console cache:clear --env=prod

# Expose port
EXPOSE 8000

# Start command
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
