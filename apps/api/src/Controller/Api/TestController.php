<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Repository\SupplierRepository;
use App\Repository\UserRepository;
use App\Repository\AddressRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/v1/test')]
class TestController extends BaseApiController
{
    public function __construct(
        private SupplierRepository $supplierRepository,
        private UserRepository $userRepository,
        private AddressRepository $addressRepository
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
        $newSupplier = [
            'id' => 'sup-' . uniqid(),
            'companyName' => 'New Supplier',
            'description' => 'Newly created supplier',
            'logo' => null,
            'website' => null,
            'isVerified' => false,
            'rating' => null,
            'totalReviews' => 0,
            'serviceAreas' => [],
            'totalProducts' => 0,
            'activeProducts' => 0,
            'createdAt' => date('c'),
        ];

        return $this->successResponse([
            'supplier' => $newSupplier
        ], 'Supplier created successfully', 201);
    }

    #[Route('/suppliers/{id}/verify', name: 'api_test_verify_supplier', methods: ['POST'])]
    public function verifySupplier(string $id): JsonResponse
    {
        $supplier = [
            'id' => $id,
            'companyName' => 'Updated Supplier',
            'description' => 'Verified supplier',
            'logo' => null,
            'website' => null,
            'isVerified' => true,
            'rating' => 4.0,
            'totalReviews' => 0,
            'serviceAreas' => [],
            'totalProducts' => 0,
            'activeProducts' => 0,
            'createdAt' => date('c'),
        ];

        return $this->successResponse([
            'supplier' => $supplier
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
