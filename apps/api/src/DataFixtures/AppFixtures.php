<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\Supplier;
use App\Entity\User;
use App\Entity\Review;
use App\Entity\Address;
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
        $this->createProducts($manager, $categories, $suppliers);
        
        // Create sample users
        $this->createSampleUsers($manager);
        
        $manager->flush();
    }

    private function createCategories(ObjectManager $manager): array
    {
        $categories = [];
        
        // Main paint categories
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
                'description' => 'Sơn chống thấm, chống nắng cho tường ngoài',
                'color' => '#4ECDC4'
            ],
            [
                'name' => 'Sơn Gỗ',
                'slug' => 'son-go',
                'description' => 'Sơn chuyên dụng cho gỗ, cửa, tủ',
                'color' => '#45B7D1'
            ],
            [
                'name' => 'Sơn Kim Loại',
                'slug' => 'son-kim-loai',
                'description' => 'Sơn chống rỉ cho sắt thép, cổng, hàng rào',
                'color' => '#96CEB4'
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
                    ->setSortOrder(count($categories));
            
            $manager->persist($category);
            $categories[] = $category;
        }

        return $categories;
    }

    private function createSuppliers(ObjectManager $manager): array
    {
        $suppliers = [];
        
        $supplierData = [
            [
                'companyName' => 'Công ty TNHH Sơn KOVA',
                'businessLicense' => '0101234567',
                'taxCode' => '0101234567',
                'description' => 'Nhà sản xuất sơn hàng đầu Việt Nam với hơn 30 năm kinh nghiệm',
                'website' => 'https://kova.com.vn',
                'isVerified' => true,
                'serviceAreas' => ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'],
                'user' => [
                    'email' => 'contact@kova.com.vn',
                    'firstName' => 'KOVA',
                    'lastName' => 'Paint',
                    'phone' => '02812345678',
                    'roles' => ['ROLE_SUPPLIER']
                ]
            ],
            [
                'companyName' => 'Công ty CP Sơn Jotun Việt Nam',
                'businessLicense' => '0102345678',
                'taxCode' => '0102345678',
                'description' => 'Thương hiệu sơn quốc tế uy tín, chuyên sơn công nghiệp và dân dụng',
                'website' => 'https://jotun.com.vn',
                'isVerified' => true,
                'serviceAreas' => ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng'],
                'user' => [
                    'email' => 'info@jotun.com.vn',
                    'firstName' => 'Jotun',
                    'lastName' => 'Vietnam',
                    'phone' => '02823456789',
                    'roles' => ['ROLE_SUPPLIER']
                ]
            ],
            [
                'companyName' => 'Công ty TNHH Sơn Dulux Việt Nam',
                'businessLicense' => '0103456789',
                'taxCode' => '0103456789',
                'description' => 'Thương hiệu sơn toàn cầu, đa dạng sản phẩm cho mọi nhu cầu',
                'website' => 'https://dulux.com.vn',
                'isVerified' => true,
                'serviceAreas' => ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Nha Trang'],
                'user' => [
                    'email' => 'contact@dulux.com.vn',
                    'firstName' => 'Dulux',
                    'lastName' => 'Vietnam',
                    'phone' => '02834567890',
                    'roles' => ['ROLE_SUPPLIER']
                ]
            ],
            [
                'companyName' => 'Công ty TNHH Sơn Nippon Việt Nam',
                'businessLicense' => '0104567890',
                'taxCode' => '0104567890',
                'description' => 'Sơn Nhật Bản chất lượng cao, công nghệ tiên tiến',
                'website' => 'https://nipponpaint.com.vn',
                'isVerified' => true,
                'serviceAreas' => ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Vũng Tàu'],
                'user' => [
                    'email' => 'info@nipponpaint.com.vn',
                    'firstName' => 'Nippon',
                    'lastName' => 'Paint',
                    'phone' => '02845678901',
                    'roles' => ['ROLE_SUPPLIER']
                ]
            ],
            [
                'companyName' => 'Công ty TNHH Sơn Maxilite',
                'businessLicense' => '0105678901',
                'taxCode' => '0105678901',
                'description' => 'Sơn giá rẻ, chất lượng tốt cho thị trường đại chúng',
                'website' => 'https://maxilite.com.vn',
                'isVerified' => false,
                'serviceAreas' => ['Hồ Chí Minh', 'Hà Nội'],
                'user' => [
                    'email' => 'contact@maxilite.com.vn',
                    'firstName' => 'Maxilite',
                    'lastName' => 'Paint',
                    'phone' => '02856789012',
                    'roles' => ['ROLE_SUPPLIER']
                ]
            ]
        ];

        foreach ($supplierData as $data) {
            // Create user
            $user = new User();
            $user->setEmail($data['user']['email'])
                 ->setFirstName($data['user']['firstName'])
                 ->setLastName($data['user']['lastName'])
                 ->setPhone($data['user']['phone'])
                 ->setRoles($data['user']['roles'])
                 ->setPassword($this->passwordHasher->hashPassword($user, 'password123'))
                 ->setIsActive(true)
                 ->setEmailVerified(true);
            
            $manager->persist($user);

            // Create supplier
            $supplier = new Supplier();
            $supplier->setUser($user)
                    ->setCompanyName($data['companyName'])
                    ->setBusinessLicense($data['businessLicense'])
                    ->setTaxCode($data['taxCode'])
                    ->setDescription($data['description'])
                    ->setWebsite($data['website'])
                    ->setIsVerified($data['isVerified'])
                    ->setServiceAreas($data['serviceAreas'])
                    ->setRating('4.5');
            
            $manager->persist($supplier);
            $suppliers[] = $supplier;
        }

        return $suppliers;
    }

    private function createProducts(ObjectManager $manager, array $categories, array $suppliers): void
    {
        $products = [
            // KOVA Products
            [
                'name' => 'KOVA Premium Interior',
                'description' => 'Sơn nội thất cao cấp, chống ẩm mốc, dễ lau chùi',
                'brand' => 'KOVA',
                'category' => 0, // Sơn Nội Thất
                'supplier' => 0, // KOVA
                'sku' => 'KOVA-PREMIUM-INT-001',
                'color' => '#FFFFFF',
                'finish' => 'MATTE',
                'coverage' => '12.00',
                'volume' => '18.00',
                'weight' => '20.00',
                'price' => '850000.00',
                'discountPrice' => '750000.00',
                'isFeatured' => true,
                'images' => ['https://example.com/kova-premium-1.jpg', 'https://example.com/kova-premium-2.jpg'],
                'specifications' => [
                    'Thời gian khô' => '2-4 giờ',
                    'Độ bền' => '5-7 năm',
                    'Chống ẩm mốc' => 'Có',
                    'Dễ lau chùi' => 'Có'
                ],
                'tags' => ['cao-cấp', 'chống-ẩm', 'dễ-lau-chùi', 'nội-thất']
            ],
            [
                'name' => 'KOVA Weathershield',
                'description' => 'Sơn ngoại thất chống thấm, chống nắng, bền màu',
                'brand' => 'KOVA',
                'category' => 1, // Sơn Ngoại Thất
                'supplier' => 0, // KOVA
                'sku' => 'KOVA-WEATHER-EXT-001',
                'color' => '#F5F5F5',
                'finish' => 'SATIN',
                'coverage' => '10.00',
                'volume' => '18.00',
                'weight' => '22.00',
                'price' => '950000.00',
                'discountPrice' => '850000.00',
                'isFeatured' => true,
                'images' => ['https://example.com/kova-weather-1.jpg'],
                'specifications' => [
                    'Chống thấm' => 'Có',
                    'Chống nắng' => 'Có',
                    'Độ bền' => '7-10 năm',
                    'Thời gian khô' => '4-6 giờ'
                ],
                'tags' => ['chống-thấm', 'ngoại-thất', 'bền-màu', 'chống-nắng']
            ],
            // Jotun Products
            [
                'name' => 'Jotun Lady Interior',
                'description' => 'Sơn nội thất thân thiện môi trường, không mùi',
                'brand' => 'Jotun',
                'category' => 0, // Sơn Nội Thất
                'supplier' => 1, // Jotun
                'sku' => 'JOTUN-LADY-INT-001',
                'color' => '#FFE4E1',
                'finish' => 'MATTE',
                'coverage' => '11.00',
                'volume' => '18.00',
                'weight' => '19.00',
                'price' => '1200000.00',
                'discountPrice' => '1100000.00',
                'isFeatured' => true,
                'images' => ['https://example.com/jotun-lady-1.jpg'],
                'specifications' => [
                    'Không mùi' => 'Có',
                    'Thân thiện môi trường' => 'Có',
                    'Độ bền' => '6-8 năm',
                    'Thời gian khô' => '2-3 giờ'
                ],
                'tags' => ['không-mùi', 'thân-thiện-môi-trường', 'nội-thất', 'cao-cấp']
            ],
            [
                'name' => 'Jotun Weatherguard',
                'description' => 'Sơn ngoại thất chống thấm cao cấp, bền màu lâu dài',
                'brand' => 'Jotun',
                'category' => 1, // Sơn Ngoại Thất
                'supplier' => 1, // Jotun
                'sku' => 'JOTUN-WEATHER-EXT-001',
                'color' => '#F0F8FF',
                'finish' => 'SEMI_GLOSS',
                'coverage' => '9.00',
                'volume' => '18.00',
                'weight' => '23.00',
                'price' => '1350000.00',
                'discountPrice' => '1250000.00',
                'isFeatured' => true,
                'images' => ['https://example.com/jotun-weather-1.jpg'],
                'specifications' => [
                    'Chống thấm cao' => 'Có',
                    'Bền màu' => '10-12 năm',
                    'Chống nắng' => 'Có',
                    'Thời gian khô' => '6-8 giờ'
                ],
                'tags' => ['chống-thấm-cao', 'ngoại-thất', 'bền-màu', 'cao-cấp']
            ],
            // Dulux Products
            [
                'name' => 'Dulux Easycare Interior',
                'description' => 'Sơn nội thất dễ lau chùi, chống bám bẩn',
                'brand' => 'Dulux',
                'category' => 0, // Sơn Nội Thất
                'supplier' => 2, // Dulux
                'sku' => 'DULUX-EASYCARE-INT-001',
                'color' => '#FFFFFF',
                'finish' => 'SATIN',
                'coverage' => '12.50',
                'volume' => '18.00',
                'weight' => '20.50',
                'price' => '980000.00',
                'discountPrice' => '880000.00',
                'isFeatured' => false,
                'images' => ['https://example.com/dulux-easycare-1.jpg'],
                'specifications' => [
                    'Dễ lau chùi' => 'Có',
                    'Chống bám bẩn' => 'Có',
                    'Độ bền' => '5-6 năm',
                    'Thời gian khô' => '3-4 giờ'
                ],
                'tags' => ['dễ-lau-chùi', 'chống-bám-bẩn', 'nội-thất']
            ],
            [
                'name' => 'Dulux Weathershield Max',
                'description' => 'Sơn ngoại thất chống thấm tối đa, bền màu',
                'brand' => 'Dulux',
                'category' => 1, // Sơn Ngoại Thất
                'supplier' => 2, // Dulux
                'sku' => 'DULUX-WEATHER-MAX-001',
                'color' => '#F5F5F5',
                'finish' => 'GLOSS',
                'coverage' => '10.50',
                'volume' => '18.00',
                'weight' => '24.00',
                'price' => '1150000.00',
                'discountPrice' => '1050000.00',
                'isFeatured' => true,
                'images' => ['https://example.com/dulux-weather-max-1.jpg'],
                'specifications' => [
                    'Chống thấm tối đa' => 'Có',
                    'Bền màu' => '8-10 năm',
                    'Chống nắng' => 'Có',
                    'Thời gian khô' => '5-7 giờ'
                ],
                'tags' => ['chống-thấm-tối-đa', 'ngoại-thất', 'bền-màu']
            ],
            // Nippon Products
            [
                'name' => 'Nippon Odour-less',
                'description' => 'Sơn nội thất không mùi, thân thiện môi trường',
                'brand' => 'Nippon',
                'category' => 0, // Sơn Nội Thất
                'supplier' => 3, // Nippon
                'sku' => 'NIPPON-ODOUR-INT-001',
                'color' => '#FFF8DC',
                'finish' => 'MATTE',
                'coverage' => '11.50',
                'volume' => '18.00',
                'weight' => '19.50',
                'price' => '1100000.00',
                'discountPrice' => '1000000.00',
                'isFeatured' => false,
                'images' => ['https://example.com/nippon-odour-1.jpg'],
                'specifications' => [
                    'Không mùi' => 'Có',
                    'Thân thiện môi trường' => 'Có',
                    'Độ bền' => '6-7 năm',
                    'Thời gian khô' => '2-3 giờ'
                ],
                'tags' => ['không-mùi', 'thân-thiện-môi-trường', 'nội-thất']
            ],
            [
                'name' => 'Nippon Weatherbond',
                'description' => 'Sơn ngoại thất chống thấm, chống nắng',
                'brand' => 'Nippon',
                'category' => 1, // Sơn Ngoại Thất
                'supplier' => 3, // Nippon
                'sku' => 'NIPPON-WEATHER-EXT-001',
                'color' => '#F0F0F0',
                'finish' => 'SEMI_GLOSS',
                'coverage' => '10.00',
                'volume' => '18.00',
                'weight' => '22.50',
                'price' => '1250000.00',
                'discountPrice' => '1150000.00',
                'isFeatured' => false,
                'images' => ['https://example.com/nippon-weather-1.jpg'],
                'specifications' => [
                    'Chống thấm' => 'Có',
                    'Chống nắng' => 'Có',
                    'Độ bền' => '7-9 năm',
                    'Thời gian khô' => '4-6 giờ'
                ],
                'tags' => ['chống-thấm', 'chống-nắng', 'ngoại-thất']
            ],
            // Maxilite Products
            [
                'name' => 'Maxilite Economy Interior',
                'description' => 'Sơn nội thất giá rẻ, chất lượng tốt',
                'brand' => 'Maxilite',
                'category' => 0, // Sơn Nội Thất
                'supplier' => 4, // Maxilite
                'sku' => 'MAXILITE-ECON-INT-001',
                'color' => '#FFFFFF',
                'finish' => 'MATTE',
                'coverage' => '10.00',
                'volume' => '18.00',
                'weight' => '18.00',
                'price' => '450000.00',
                'discountPrice' => '400000.00',
                'isFeatured' => false,
                'images' => ['https://example.com/maxilite-econ-1.jpg'],
                'specifications' => [
                    'Giá rẻ' => 'Có',
                    'Chất lượng tốt' => 'Có',
                    'Độ bền' => '3-4 năm',
                    'Thời gian khô' => '4-6 giờ'
                ],
                'tags' => ['giá-rẻ', 'chất-lượng-tốt', 'nội-thất']
            ],
            [
                'name' => 'Maxilite Weatherproof',
                'description' => 'Sơn ngoại thất chống thấm cơ bản',
                'brand' => 'Maxilite',
                'category' => 1, // Sơn Ngoại Thất
                'supplier' => 4, // Maxilite
                'sku' => 'MAXILITE-WEATHER-EXT-001',
                'color' => '#F5F5F5',
                'finish' => 'SATIN',
                'coverage' => '9.00',
                'volume' => '18.00',
                'weight' => '20.00',
                'price' => '550000.00',
                'discountPrice' => '500000.00',
                'isFeatured' => false,
                'images' => ['https://example.com/maxilite-weather-1.jpg'],
                'specifications' => [
                    'Chống thấm cơ bản' => 'Có',
                    'Giá rẻ' => 'Có',
                    'Độ bền' => '4-5 năm',
                    'Thời gian khô' => '6-8 giờ'
                ],
                'tags' => ['chống-thấm-cơ-bản', 'giá-rẻ', 'ngoại-thất']
            ]
        ];

        foreach ($products as $productData) {
            $product = new Product();
            $product->setName($productData['name'])
                   ->setDescription($productData['description'])
                   ->setBrand($productData['brand'])
                   ->setCategory($categories[$productData['category']])
                   ->setSupplier($suppliers[$productData['supplier']])
                   ->setSku($productData['sku'])
                   ->setColor($productData['color'])
                   ->setFinish($productData['finish'])
                   ->setCoverage($productData['coverage'])
                   ->setVolume($productData['volume'])
                   ->setWeight($productData['weight'])
                   ->setPrice($productData['price'])
                   ->setDiscountPrice($productData['discountPrice'])
                   ->setIsFeatured($productData['isFeatured'])
                   ->setImages($productData['images'])
                   ->setSpecifications($productData['specifications'])
                   ->setTags($productData['tags']);
            
            $manager->persist($product);
        }
    }

    private function createSampleUsers(ObjectManager $manager): void
    {
        $users = [
            [
                'email' => 'admin@vncompare.com',
                'firstName' => 'Admin',
                'lastName' => 'VNCompare',
                'phone' => '0901234567',
                'roles' => ['ROLE_ADMIN']
            ],
            [
                'email' => 'nguyenphongthien@gmail.com',
                'firstName' => 'Phong',
                'lastName' => 'Thien',
                'phone' => '0901234566',
                'roles' => ['ROLE_ADMIN'],
                'password' => 'Kimtuoc2'
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
            ]
        ];

        foreach ($users as $userData) {
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
        }
    }
}

