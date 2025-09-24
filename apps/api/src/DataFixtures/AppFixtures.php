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
        // Create categories
        $categories = $this->createCategories($manager);
        
        // Create users and suppliers
        $suppliers = $this->createSuppliers($manager);
        
        // Create products
        $products = $this->createProducts($manager, $categories, $suppliers);
        
        // Create sample users
        $users = $this->createSampleUsers($manager);
        
        // Create addresses for users
        $addresses = $this->createAddresses($manager, $users);
        
        // Create orders
        $this->createOrders($manager, $users, $products, $suppliers, $addresses);
        
        // Create reviews
        $this->createReviews($manager, $users, $products);
        
        // Create prices
        $this->createPrices($manager, $products);
        
        $manager->flush();
    }

    private function createCategories(ObjectManager $manager): array
    {
        $categories = [];
        
        $paintCategories = [
            [
                'name' => 'Sơn Nội Thất',
                'slug' => 'son-noi-that',
                'description' => 'Sơn dành cho nội thất, phòng khách, phòng ngủ',
                'color' => '#FF6B6B'
            ],
            [
                'name' => 'Sơn Ngoại Thất',
                'slug' => 'son-ngoai-that',
                'description' => 'Sơn dành cho ngoại thất, chống thấm, chống nắng',
                'color' => '#4ECDC4'
            ],
            [
                'name' => 'Sơn Chống Thấm',
                'slug' => 'son-chong-tham',
                'description' => 'Sơn chống thấm chuyên dụng',
                'color' => '#FFEAA7'
            ]
        ];

        foreach ($paintCategories as $catData) {
            $category = new Category();
            $category->setName($catData['name'])
                    ->setSlug($catData['slug'])
                    ->setDescription($catData['description'])
                    ->setColor($catData['color'])
                    ->setCreatedAt(new \DateTime())
                    ->setUpdatedAt(new \DateTime());

            $manager->persist($category);
            $categories[] = $category;
        }

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
        $usersData = [
            [
                'email' => 'admin@vncompare.com',
                'firstName' => 'Admin',
                'lastName' => 'VNCompare',
                'phone' => '0901234567',
                'roles' => ['ROLE_ADMIN']
            ],
            [
                'email' => 'customer1@example.com',
                'firstName' => 'Nguyễn',
                'lastName' => 'Văn A',
                'phone' => '0901234568',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'customer2@example.com',
                'firstName' => 'Trần',
                'lastName' => 'Thị B',
                'phone' => '0901234569',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'customer3@example.com',
                'firstName' => 'Lê',
                'lastName' => 'Văn C',
                'phone' => '0901234570',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'customer4@example.com',
                'firstName' => 'Phạm',
                'lastName' => 'Thị D',
                'phone' => '0901234571',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'customer5@example.com',
                'firstName' => 'Hoàng',
                'lastName' => 'Văn E',
                'phone' => '0901234572',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'customer6@example.com',
                'firstName' => 'Võ',
                'lastName' => 'Thị Jenny',
                'phone' => '0901234577',
                'roles' => ['ROLE_USER']
            ]
        ];

        $users = [];
        foreach ($usersData as $userData) {
            $user = new User();
            $password = $userData['password'] ?? 'password123';
            $user->setEmail($userData['email'])
                 ->setFirstName($userData['firstName'])
                 ->setLastName($userData['lastName'])
                 ->setPhone($userData['phone'])
                 ->setRoles($userData['roles'])
                 ->setPassword($this->passwordHasher->hashPassword($user, $password))
                 ->setIsActive(true)
                 ->setEmailVerified(true);
            
            $manager->persist($user);
            $users[] = $user;
        }

        return $users;
    }

    private function createAddresses(ObjectManager $manager, array $users): array
    {
        $addresses = [
            [
                'user' => 1, // customer1@example.com
                'type' => 'HOME',
                'recipientName' => 'Nguyễn Văn A',
                'phone' => '0901234568',
                'street' => '123 Đường Lê Lợi',
                'houseNumber' => '123',
                'ward' => 'Phường Bến Nghé',
                'district' => 'Quận 1',
                'province' => 'Hồ Chí Minh',
                'postalCode' => '700000',
                'isDefault' => true
            ],
            [
                'user' => 2, // customer2@example.com
                'type' => 'WORK',
                'recipientName' => 'Trần Thị B',
                'phone' => '0901234569',
                'street' => '456 Đường Nguyễn Huệ',
                'houseNumber' => '456',
                'ward' => 'Phường Đa Kao',
                'district' => 'Quận 1',
                'province' => 'Hồ Chí Minh',
                'postalCode' => '700000',
                'isDefault' => true
            ],
            [
                'user' => 3, // customer3@example.com
                'type' => 'HOME',
                'recipientName' => 'Lê Văn C',
                'phone' => '0901234570',
                'street' => '789 Đường Cách Mạng Tháng 8',
                'houseNumber' => '789',
                'ward' => 'Phường 10',
                'district' => 'Quận 3',
                'province' => 'Hồ Chí Minh',
                'postalCode' => '700000',
                'isDefault' => true
            ],
            [
                'user' => 4, // customer4@example.com
                'type' => 'HOME',
                'recipientName' => 'Phạm Thị D',
                'phone' => '0901234571',
                'street' => '321 Đường Võ Văn Tần',
                'houseNumber' => '321',
                'ward' => 'Phường 6',
                'district' => 'Quận 3',
                'province' => 'Hồ Chí Minh',
                'postalCode' => '700000',
                'isDefault' => true
            ],
            [
                'user' => 5, // customer5@example.com
                'type' => 'WORK',
                'recipientName' => 'Hoàng Văn E',
                'phone' => '0901234572',
                'street' => '654 Đường Điện Biên Phủ',
                'houseNumber' => '654',
                'ward' => 'Phường 25',
                'district' => 'Quận Bình Thạnh',
                'province' => 'Hồ Chí Minh',
                'postalCode' => '700000',
                'isDefault' => true
            ]
        ];

        $addressEntities = [];
        foreach ($addresses as $addressData) {
            $address = new Address();
            $address->setUser($users[$addressData['user']])
                    ->setType($addressData['type'])
                    ->setRecipientName($addressData['recipientName'])
                    ->setPhone($addressData['phone'])
                    ->setStreet($addressData['street'])
                    ->setHouseNumber($addressData['houseNumber'])
                    ->setWard($addressData['ward'])
                    ->setDistrict($addressData['district'])
                    ->setProvince($addressData['province'])
                    ->setPostalCode($addressData['postalCode'])
                    ->setDefault($addressData['isDefault'])
                    ->setCreatedAt(new \DateTime())
                    ->setUpdatedAt(new \DateTime());

            $manager->persist($address);
            $addressEntities[] = $address;
        }

        return $addressEntities;
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