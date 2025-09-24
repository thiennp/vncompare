<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\Supplier;
use App\Entity\User;
use App\Entity\Review;
use App\Entity\Address;
use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\OrderTracking;
use App\Entity\Price;
use App\Entity\Shipping;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // No hardcoded data - all data will be created through the API
        // This fixture is kept for future use if needed for testing or seeding
        
        $manager->flush();
    }

    private function createCategories(ObjectManager $manager): array
    {
        $categories = [];
        
        // No hardcoded category data - categories will be created through the API
        // This method is kept for future use if needed for testing or seeding

        return $categories;
    }

    private function createSuppliers(ObjectManager $manager): array
    {
        $suppliers = [];
        
        // No hardcoded supplier data - suppliers will be created through the API
        // This method is kept for future use if needed for testing or seeding

        return $suppliers;
    }

    private function createProducts(ObjectManager $manager, array $categories, array $suppliers): array
    {
        $products = [];
        
        // No hardcoded product data - products will be created through the API
        // This method is kept for future use if needed for testing or seeding

        return $products;
    }

    private function createSampleUsers(ObjectManager $manager): array
    {
        $users = [];
        
        // No hardcoded user data - users will be created through the API
        // This method is kept for future use if needed for testing or seeding

        return $users;
    }

    private function createAddresses(ObjectManager $manager, array $users): array
    {
        $addresses = [];
        
        // No hardcoded address data - addresses will be created through the API
        // This method is kept for future use if needed for testing or seeding

        return $addresses;
    }

    private function createOrders(ObjectManager $manager, array $users, array $products, array $suppliers, array $addresses): void
    {
        // No hardcoded order data - orders will be created through the API
        // This method is kept for future use if needed for testing or seeding
    }

    private function createReviews(ObjectManager $manager, array $users, array $products): void
    {
        // No hardcoded review data - reviews will be created through the API
        // This method is kept for future use if needed for testing or seeding
    }

    private function createPrices(ObjectManager $manager, array $products): void
    {
        // No hardcoded price data - prices will be created through the API
        // This method is kept for future use if needed for testing or seeding
    }
}