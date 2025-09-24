<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Repository\SupplierRepository;
use App\Repository\UserRepository;
use App\Repository\AddressRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/v1/test')]
class TestController extends BaseApiController
{
    public function __construct(
        private SupplierRepository $supplierRepository,
        private UserRepository $userRepository,
        private AddressRepository $addressRepository,
        private EntityManagerInterface $entityManager
    ) {
    }
    #[Route('/suppliers', name: 'api_test_suppliers', methods: ['GET'])]
    public function getSuppliers(): JsonResponse
    {
        // Debug: Log that we're using database
        error_log('TestController: Using database for suppliers');
        $suppliers = $this->supplierRepository->findAll();
        error_log('TestController: Found ' . count($suppliers) . ' suppliers in database');
        
        $suppliersData = array_map(function ($supplier) {
            return [
                'id' => $supplier->getId(),
                'companyName' => $supplier->getCompanyName(),
                'description' => $supplier->getDescription(),
                'logo' => $supplier->getLogo(),
                'website' => $supplier->getWebsite(),
                'isVerified' => $supplier->isVerified(),
                'rating' => $supplier->getRating(),
                'totalReviews' => $supplier->getTotalReviews(),
                'serviceAreas' => $supplier->getServiceAreas(),
                'totalProducts' => $supplier->getTotalProducts(),
                'activeProducts' => $supplier->getActiveProducts(),
                'createdAt' => $supplier->getCreatedAt()?->format('c'),
            ];
        }, $suppliers);

        return $this->successResponse([
            'suppliers' => $suppliersData,
            'pagination' => [
                'page' => 1,
                'limit' => 50,
                'total' => count($suppliersData),
                'totalPages' => 1,
            ]
        ]);
    }

    #[Route('/suppliers', name: 'api_test_create_supplier', methods: ['POST'])]
    public function createSupplier(): JsonResponse
    {
        // Create a new User entity for the supplier
        $user = new \App\Entity\User();
        $user->setEmail('supplier' . uniqid() . '@example.com');
        $user->setFirstName('Supplier');
        $user->setLastName('User');
        $user->setPassword('password123');
        $user->setRoles(['ROLE_SUPPLIER']);
        $user->setActive(true);
        $user->setCreatedAt(new \DateTime());

        // Create a new Supplier entity
        $supplier = new \App\Entity\Supplier();
        $supplier->setUser($user);
        $supplier->setCompanyName('New Supplier');
        $supplier->setBusinessLicense('BL' . uniqid());
        $supplier->setTaxCode('TC' . uniqid());
        $supplier->setDescription('Newly created supplier');
        $supplier->setLogo(null);
        $supplier->setWebsite(null);
        $supplier->setVerified(false);
        $supplier->setRating(null);
        $supplier->setTotalReviews(0);
        $supplier->setServiceAreas([]);
        $supplier->setCreatedAt(new \DateTime());

        // Save to database
        $this->entityManager->persist($user);
        $this->entityManager->persist($supplier);
        $this->entityManager->flush();

        // Return the created supplier data
        $supplierData = [
            'id' => (string) $supplier->getId(),
            'companyName' => $supplier->getCompanyName(),
            'description' => $supplier->getDescription(),
            'logo' => $supplier->getLogo(),
            'website' => $supplier->getWebsite(),
            'isVerified' => $supplier->isVerified(),
            'rating' => $supplier->getRating(),
            'totalReviews' => $supplier->getTotalReviews(),
            'serviceAreas' => $supplier->getServiceAreas(),
            'totalProducts' => $supplier->getTotalProducts(),
            'activeProducts' => $supplier->getActiveProducts(),
            'createdAt' => $supplier->getCreatedAt()?->format('c'),
        ];

        return $this->successResponse([
            'supplier' => $supplierData
        ], 'Supplier created successfully', 201);
    }

    #[Route('/suppliers/{id}/verify', name: 'api_test_verify_supplier', methods: ['POST'])]
    public function verifySupplier(string $id): JsonResponse
    {
        // Find the supplier in the database
        $supplier = $this->supplierRepository->find($id);
        
        if (!$supplier) {
            return $this->errorResponse('Supplier not found', 404);
        }

        // Update supplier verification status
        $supplier->setVerified(true);
        $supplier->setRating('4.0');
        
        // Save changes to database
        $this->entityManager->flush();

        // Return the updated supplier data
        $supplierData = [
            'id' => (string) $supplier->getId(),
            'companyName' => $supplier->getCompanyName(),
            'description' => $supplier->getDescription(),
            'logo' => $supplier->getLogo(),
            'website' => $supplier->getWebsite(),
            'isVerified' => $supplier->isVerified(),
            'rating' => $supplier->getRating(),
            'totalReviews' => $supplier->getTotalReviews(),
            'serviceAreas' => $supplier->getServiceAreas(),
            'totalProducts' => $supplier->getTotalProducts(),
            'activeProducts' => $supplier->getActiveProducts(),
            'createdAt' => $supplier->getCreatedAt()?->format('c'),
        ];

        return $this->successResponse([
            'supplier' => $supplierData
        ], 'Supplier verification updated successfully');
    }

    #[Route('/users', name: 'api_test_users', methods: ['GET'], options: ['trailing_slash_on_root' => false])]
    public function getUsers(): JsonResponse
    {
        $users = $this->userRepository->findAll();
        
        $usersData = array_map(function ($user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'phone' => $user->getPhone(),
                'role' => $user->getRoles()[0] ?? 'USER',
                'isActive' => $user->isActive(),
                'emailVerified' => $user->isEmailVerified(),
                'phoneVerified' => $user->isPhoneVerified(),
                'createdAt' => $user->getCreatedAt()?->format('c'),
                'lastLoginAt' => $user->getLastLoginAt()?->format('c'),
            ];
        }, $users);

        return $this->successResponse([
            'users' => $usersData,
            'pagination' => [
                'page' => 1,
                'limit' => 50,
                'total' => count($usersData),
                'totalPages' => 1,
            ]
        ]);
    }

    #[Route('/users', name: 'api_test_create_user', methods: ['POST'])]
    public function createUser(): JsonResponse
    {
        $newUser = [
            'id' => 'user-' . uniqid(),
            'email' => 'newuser@example.com',
            'firstName' => 'New',
            'lastName' => 'User',
            'phone' => '+84901234570',
            'role' => 'USER',
            'isActive' => true,
            'emailVerified' => false,
            'phoneVerified' => false,
            'createdAt' => date('c'),
            'lastLoginAt' => null,
        ];

        return $this->successResponse([
            'user' => $newUser
        ], 'User created successfully', 201);
    }

    #[Route('/addresses', name: 'api_test_addresses', methods: ['GET'])]
    public function getAddresses(): JsonResponse
    {
        $addresses = $this->addressRepository->findAll();
        
        $addressesData = array_map(function ($address) {
            return [
                'id' => $address->getId(),
                'street' => $address->getStreet(),
                'ward' => $address->getWard(),
                'district' => $address->getDistrict(),
                'province' => $address->getProvince(),
                'postalCode' => $address->getPostalCode(),
                'isServiceArea' => $address->isServiceArea(),
                'deliveryFee' => $address->getDeliveryFee(),
                'estimatedDays' => $address->getEstimatedDays(),
                'createdAt' => $address->getCreatedAt()?->format('c'),
                'updatedAt' => $address->getUpdatedAt()?->format('c'),
            ];
        }, $addresses);

        return $this->successResponse([
            'addresses' => $addressesData,
            'pagination' => [
                'page' => 1,
                'limit' => 50,
                'total' => count($addressesData),
                'totalPages' => 1,
            ]
        ]);
    }

    #[Route('/addresses', name: 'api_test_create_address', methods: ['POST'])]
    public function createAddress(): JsonResponse
    {
        $newAddress = [
            'id' => 'addr-' . uniqid(),
            'street' => 'New Street Address',
            'ward' => 'New Ward',
            'district' => 'New District',
            'province' => 'New Province',
            'postalCode' => '000000',
            'isServiceArea' => true,
            'deliveryFee' => 30000,
            'estimatedDays' => 2,
            'createdAt' => date('c'),
            'updatedAt' => date('c'),
        ];

        return $this->successResponse([
            'address' => $newAddress
        ], 'Address created successfully', 201);
    }
}
