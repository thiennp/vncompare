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
}
