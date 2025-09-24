<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/v1/test')]
class TestController extends BaseApiController
{
    #[Route('/suppliers', name: 'api_test_suppliers', methods: ['GET'])]
    public function getSuppliers(): JsonResponse
    {
        $suppliers = [
            [
                'id' => 'sup-1',
                'companyName' => 'Dulux Vietnam',
                'description' => 'Premium paint supplier',
                'logo' => null,
                'website' => 'https://dulux.vn',
                'isVerified' => true,
                'rating' => 4.8,
                'totalReviews' => 25,
                'serviceAreas' => ['Ho Chi Minh', 'Hanoi'],
                'totalProducts' => 25,
                'activeProducts' => 25,
                'createdAt' => '2024-01-01T00:00:00Z',
            ],
            [
                'id' => 'sup-2',
                'companyName' => 'Jotun Vietnam',
                'description' => 'Quality paint solutions',
                'logo' => null,
                'website' => 'https://jotun.vn',
                'isVerified' => false,
                'rating' => 4.5,
                'totalReviews' => 18,
                'serviceAreas' => ['Ho Chi Minh', 'Da Nang'],
                'totalProducts' => 18,
                'activeProducts' => 18,
                'createdAt' => '2024-01-05T00:00:00Z',
            ],
            [
                'id' => 'sup-3',
                'companyName' => 'Kova Paint',
                'description' => 'Local paint manufacturer',
                'logo' => null,
                'website' => 'https://kova.vn',
                'isVerified' => true,
                'rating' => 4.9,
                'totalReviews' => 32,
                'serviceAreas' => ['Hanoi', 'Hai Phong'],
                'totalProducts' => 32,
                'activeProducts' => 32,
                'createdAt' => '2024-01-10T00:00:00Z',
            ]
        ];

        return $this->successResponse([
            'suppliers' => $suppliers,
            'pagination' => [
                'page' => 1,
                'limit' => 50,
                'total' => 3,
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

    #[Route('/users', name: 'api_test_users', methods: ['GET'])]
    public function getUsers(): JsonResponse
    {
        $users = [
            [
                'id' => 'user-1',
                'email' => 'admin@vncompare.com',
                'firstName' => 'Admin',
                'lastName' => 'User',
                'phone' => '+84901234567',
                'role' => 'ADMIN',
                'isActive' => true,
                'emailVerified' => true,
                'phoneVerified' => true,
                'createdAt' => '2024-01-01T00:00:00Z',
                'lastLoginAt' => '2024-01-15T10:30:00Z',
            ],
            [
                'id' => 'user-2',
                'email' => 'john.doe@example.com',
                'firstName' => 'John',
                'lastName' => 'Doe',
                'phone' => '+84901234568',
                'role' => 'USER',
                'isActive' => true,
                'emailVerified' => true,
                'phoneVerified' => false,
                'createdAt' => '2024-01-02T00:00:00Z',
                'lastLoginAt' => '2024-01-14T15:20:00Z',
            ],
            [
                'id' => 'user-3',
                'email' => 'supplier@example.com',
                'firstName' => 'Jane',
                'lastName' => 'Smith',
                'phone' => '+84901234569',
                'role' => 'SUPPLIER',
                'isActive' => true,
                'emailVerified' => true,
                'phoneVerified' => true,
                'createdAt' => '2024-01-03T00:00:00Z',
                'lastLoginAt' => '2024-01-13T09:15:00Z',
            ]
        ];

        return $this->successResponse([
            'users' => $users,
            'pagination' => [
                'page' => 1,
                'limit' => 50,
                'total' => 3,
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
        $addresses = [
            [
                'id' => 'addr-1',
                'street' => '123 Nguyen Hue Boulevard',
                'ward' => 'Ward 1',
                'district' => 'District 1',
                'province' => 'Ho Chi Minh City',
                'postalCode' => '700000',
                'isServiceArea' => true,
                'deliveryFee' => 50000,
                'estimatedDays' => 1,
                'createdAt' => '2024-01-01T00:00:00Z',
                'updatedAt' => '2024-01-15T10:30:00Z',
            ],
            [
                'id' => 'addr-2',
                'street' => '456 Le Loi Street',
                'ward' => 'Ward 2',
                'district' => 'District 1',
                'province' => 'Ho Chi Minh City',
                'postalCode' => '700000',
                'isServiceArea' => true,
                'deliveryFee' => 50000,
                'estimatedDays' => 1,
                'createdAt' => '2024-01-02T00:00:00Z',
                'updatedAt' => '2024-01-15T14:20:00Z',
            ]
        ];

        return $this->successResponse([
            'addresses' => $addresses,
            'pagination' => [
                'page' => 1,
                'limit' => 50,
                'total' => 2,
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
