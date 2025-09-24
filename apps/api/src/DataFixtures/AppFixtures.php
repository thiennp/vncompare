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
        // Load existing data from database - no fixtures needed
        // All data is already available in the database
        
        $manager->flush();
    }

    private function createCategories(ObjectManager $manager): array
    {
        $categories = [];
        
        // Load existing categories from database
        $categories = $manager->getRepository(Category::class)->findAll();

        return $categories;
    }

    private function createSuppliers(ObjectManager $manager): array
    {
        $suppliers = [];
        
        // Load existing suppliers from database
        $suppliers = $manager->getRepository(Supplier::class)->findAll();

        return $suppliers;
    }

    private function createProducts(ObjectManager $manager, array $categories, array $suppliers): array
    {
        $products = [];
        
        // Load existing products from database
        $products = $manager->getRepository(Product::class)->findAll();

        return $products;
    }

    private function createSampleUsers(ObjectManager $manager): array
    {
        $users = [];
        
        // Load existing users from database
        $users = $manager->getRepository(User::class)->findAll();

        return $users;
    }

    private function createAddresses(ObjectManager $manager, array $users): array
    {
        $addresses = [];
        
        // Load existing addresses from database
        $addresses = $manager->getRepository(Address::class)->findAll();

        return $addresses;
    }

    private function createOrders(ObjectManager $manager, array $users, array $products, array $suppliers, array $addresses): void
    {
        // Load existing orders from database
        $orders = $manager->getRepository(Order::class)->findAll();
    }

    private function createReviews(ObjectManager $manager, array $users, array $products): void
    {
        // Load existing reviews from database
        $reviews = $manager->getRepository(Review::class)->findAll();
    }

    private function createPrices(ObjectManager $manager, array $products): void
    {
        // Load existing prices from database
        $prices = $manager->getRepository(Price::class)->findAll();
    }
}