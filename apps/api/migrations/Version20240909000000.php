<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240909000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create VNCompare API database schema';
    }

    public function up(Schema $schema): void
    {
        // Create users table
        $this->addSql('CREATE TABLE users (
            id UUID PRIMARY KEY,
            email VARCHAR(180) NOT NULL UNIQUE,
            roles JSON NOT NULL,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NULL,
            avatar VARCHAR(255) NULL,
            preferences JSON NOT NULL DEFAULT \'{}\',
            is_active BOOLEAN NOT NULL DEFAULT true,
            email_verified BOOLEAN NOT NULL DEFAULT false,
            phone_verified BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            last_login_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
        )');

        // Create categories table
        $this->addSql('CREATE TABLE categories (
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(100) NOT NULL UNIQUE,
            description TEXT NULL,
            image VARCHAR(255) NULL,
            color VARCHAR(7) NULL,
            is_active BOOLEAN NOT NULL DEFAULT true,
            sort_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            parent_id UUID NULL,
            CONSTRAINT FK_CATEGORIES_PARENT FOREIGN KEY (parent_id) REFERENCES categories(id)
        )');

        // Create suppliers table
        $this->addSql('CREATE TABLE suppliers (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL UNIQUE,
            company_name VARCHAR(255) NOT NULL,
            business_license VARCHAR(50) NOT NULL UNIQUE,
            tax_code VARCHAR(20) NOT NULL UNIQUE,
            description TEXT NULL,
            logo VARCHAR(255) NULL,
            website VARCHAR(255) NULL,
            is_verified BOOLEAN NOT NULL DEFAULT false,
            rating DECIMAL(3,2) NULL,
            total_reviews INTEGER NOT NULL DEFAULT 0,
            service_areas JSON NOT NULL DEFAULT \'{}\',
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_SUPPLIERS_USER FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )');

        // Create products table
        $this->addSql('CREATE TABLE products (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            brand VARCHAR(100) NOT NULL,
            category_id UUID NOT NULL,
            supplier_id UUID NOT NULL,
            sku VARCHAR(100) NOT NULL UNIQUE,
            barcode VARCHAR(50) NULL,
            color VARCHAR(7) NULL,
            finish VARCHAR(20) NOT NULL,
            coverage DECIMAL(8,2) NOT NULL,
            volume DECIMAL(8,2) NOT NULL,
            weight DECIMAL(8,2) NULL,
            price DECIMAL(12,2) NOT NULL,
            discount_price DECIMAL(12,2) NULL,
            is_active BOOLEAN NOT NULL DEFAULT true,
            is_featured BOOLEAN NOT NULL DEFAULT false,
            images JSON NOT NULL DEFAULT \'{}\',
            specifications JSON NOT NULL DEFAULT \'{}\',
            tags JSON NOT NULL DEFAULT \'{}\',
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_PRODUCTS_CATEGORY FOREIGN KEY (category_id) REFERENCES categories(id),
            CONSTRAINT FK_PRODUCTS_SUPPLIER FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
        )');

        // Create addresses table
        $this->addSql('CREATE TABLE addresses (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
            type VARCHAR(20) NOT NULL,
            recipient_name VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            province VARCHAR(100) NOT NULL,
            district VARCHAR(100) NOT NULL,
            ward VARCHAR(100) NOT NULL,
            street VARCHAR(255) NOT NULL,
            house_number VARCHAR(50) NOT NULL,
            postal_code VARCHAR(10) NULL,
            is_default BOOLEAN NOT NULL DEFAULT false,
            coordinates JSON NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_ADDRESSES_USER FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )');

        // Create orders table
        $this->addSql('CREATE TABLE orders (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
            supplier_id UUID NOT NULL,
            order_number VARCHAR(20) NOT NULL UNIQUE,
            status VARCHAR(20) NOT NULL DEFAULT \'PENDING\',
            subtotal DECIMAL(12,2) NOT NULL,
            shipping_cost DECIMAL(12,2) NOT NULL,
            tax DECIMAL(12,2) NOT NULL,
            total DECIMAL(12,2) NOT NULL,
            payment_method VARCHAR(20) NOT NULL,
            payment_status VARCHAR(20) NOT NULL DEFAULT \'PENDING\',
            shipping_address_id UUID NOT NULL,
            notes TEXT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            delivered_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
            CONSTRAINT FK_ORDERS_USER FOREIGN KEY (user_id) REFERENCES users(id),
            CONSTRAINT FK_ORDERS_SUPPLIER FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
            CONSTRAINT FK_ORDERS_ADDRESS FOREIGN KEY (shipping_address_id) REFERENCES addresses(id)
        )');

        // Create order_items table
        $this->addSql('CREATE TABLE order_items (
            id UUID PRIMARY KEY,
            order_id UUID NOT NULL,
            product_id UUID NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price DECIMAL(12,2) NOT NULL,
            total_price DECIMAL(12,2) NOT NULL,
            notes TEXT NULL,
            CONSTRAINT FK_ORDER_ITEMS_ORDER FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            CONSTRAINT FK_ORDER_ITEMS_PRODUCT FOREIGN KEY (product_id) REFERENCES products(id)
        )');

        // Create reviews table
        $this->addSql('CREATE TABLE reviews (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
            product_id UUID NOT NULL,
            rating INTEGER NOT NULL,
            title VARCHAR(255) NULL,
            comment TEXT NULL,
            images JSON NOT NULL DEFAULT \'{}\',
            is_verified BOOLEAN NOT NULL DEFAULT false,
            helpful INTEGER NOT NULL DEFAULT 0,
            is_moderated BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_REVIEWS_USER FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT FK_REVIEWS_PRODUCT FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            CONSTRAINT UNIQ_REVIEWS_USER_PRODUCT UNIQUE (user_id, product_id)
        )');

        // Create shipping table
        $this->addSql('CREATE TABLE shipping (
            id UUID PRIMARY KEY,
            supplier_id UUID NOT NULL,
            name VARCHAR(100) NOT NULL,
            description TEXT NULL,
            provinces JSON NOT NULL DEFAULT \'{}\',
            districts JSON NOT NULL DEFAULT \'{}\',
            base_cost DECIMAL(12,2) NOT NULL,
            cost_per_km DECIMAL(12,2) NULL,
            free_shipping_threshold DECIMAL(12,2) NULL,
            estimated_days INTEGER NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_SHIPPING_SUPPLIER FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
        )');

        // Create prices table
        $this->addSql('CREATE TABLE prices (
            id UUID PRIMARY KEY,
            product_id UUID NOT NULL,
            price DECIMAL(12,2) NOT NULL,
            discount_price DECIMAL(12,2) NULL,
            effective_from TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            effective_to TIMESTAMP(0) WITHOUT TIME ZONE NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_PRICES_PRODUCT FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )');

        // Create projects table
        $this->addSql('CREATE TABLE projects (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            type VARCHAR(50) NOT NULL,
            area DECIMAL(8,2) NULL,
            rooms JSON NOT NULL DEFAULT \'{}\',
            products JSON NOT NULL DEFAULT \'{}\',
            estimated_cost DECIMAL(12,2) NULL,
            start_date TIMESTAMP(0) WITHOUT TIME ZONE NULL,
            end_date TIMESTAMP(0) WITHOUT TIME ZONE NULL,
            status VARCHAR(20) NOT NULL DEFAULT \'PLANNING\',
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_PROJECTS_USER FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )');

        // Create notifications table
        $this->addSql('CREATE TABLE notifications (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
            type VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NULL,
            action_url VARCHAR(255) NULL,
            is_read BOOLEAN NOT NULL DEFAULT false,
            data JSON NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_NOTIFICATIONS_USER FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )');

        // Create order_tracking table
        $this->addSql('CREATE TABLE order_tracking (
            id UUID PRIMARY KEY,
            order_id UUID NOT NULL,
            status VARCHAR(50) NOT NULL,
            description TEXT NULL,
            location VARCHAR(100) NULL,
            tracking_number VARCHAR(50) NULL,
            timestamp TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            metadata JSON NULL,
            CONSTRAINT FK_ORDER_TRACKING_ORDER FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )');

        // Create supplier_documents table
        $this->addSql('CREATE TABLE supplier_documents (
            id UUID PRIMARY KEY,
            supplier_id UUID NOT NULL,
            type VARCHAR(100) NOT NULL,
            filename VARCHAR(255) NOT NULL,
            file_url VARCHAR(500) NOT NULL,
            mime_type VARCHAR(50) NOT NULL,
            file_size INTEGER NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT \'PENDING\',
            rejection_reason TEXT NULL,
            uploaded_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            reviewed_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
            CONSTRAINT FK_SUPPLIER_DOCUMENTS_SUPPLIER FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
        )');

        // Create indexes
        $this->addSql('CREATE INDEX IDX_USERS_EMAIL ON users(email)');
        $this->addSql('CREATE INDEX IDX_PRODUCTS_SKU ON products(sku)');
        $this->addSql('CREATE INDEX IDX_PRODUCTS_CATEGORY ON products(category_id)');
        $this->addSql('CREATE INDEX IDX_PRODUCTS_SUPPLIER ON products(supplier_id)');
        $this->addSql('CREATE INDEX IDX_ORDERS_USER ON orders(user_id)');
        $this->addSql('CREATE INDEX IDX_ORDERS_SUPPLIER ON orders(supplier_id)');
        $this->addSql('CREATE INDEX IDX_ORDERS_NUMBER ON orders(order_number)');
        $this->addSql('CREATE INDEX IDX_REVIEWS_PRODUCT ON reviews(product_id)');
        $this->addSql('CREATE INDEX IDX_REVIEWS_USER ON reviews(user_id)');
        $this->addSql('CREATE INDEX IDX_ADDRESSES_USER ON addresses(user_id)');
        $this->addSql('CREATE INDEX IDX_NOTIFICATIONS_USER ON notifications(user_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE supplier_documents');
        $this->addSql('DROP TABLE order_tracking');
        $this->addSql('DROP TABLE notifications');
        $this->addSql('DROP TABLE projects');
        $this->addSql('DROP TABLE prices');
        $this->addSql('DROP TABLE shipping');
        $this->addSql('DROP TABLE reviews');
        $this->addSql('DROP TABLE order_items');
        $this->addSql('DROP TABLE orders');
        $this->addSql('DROP TABLE addresses');
        $this->addSql('DROP TABLE products');
        $this->addSql('DROP TABLE suppliers');
        $this->addSql('DROP TABLE categories');
        $this->addSql('DROP TABLE users');
    }
}
