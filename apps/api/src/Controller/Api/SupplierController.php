<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Service\SupplierService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/v1/suppliers')]
class SupplierController extends BaseApiController
{
    public function __construct(
        private SupplierService $supplierService
    ) {}

    #[Route('', name: 'api_suppliers_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        try {
            $filters = [
                'page' => (int) $request->query->get('page', 1),
                'limit' => min((int) $request->query->get('limit', 20), 100),
                'province' => $request->query->get('province'),
                'verified' => $request->query->get('verified'),
                'search' => $request->query->get('search'),
            ];

            $result = $this->supplierService->getSuppliers($filters);
            
            return $this->successResponse([
                'suppliers' => array_map([$this, 'serializeSupplier'], $result['suppliers']),
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch suppliers: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}', name: 'api_suppliers_show', methods: ['GET'])]
    public function show(string $id): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getSupplier($id);
            
            if (!$supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            return $this->successResponse([
                'supplier' => $this->serializeSupplierDetail($supplier)
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch supplier: ' . $e->getMessage(), 500);
        }
    }

    #[Route('', name: 'api_suppliers_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $supplier = $this->supplierService->registerSupplier($this->getUser(), $data);
            
            return $this->successResponse([
                'supplier' => $this->serializeSupplier($supplier)
            ], 'Supplier registration submitted successfully', 201);
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to register supplier: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}', name: 'api_suppliers_update', methods: ['PUT'])]
    #[IsGranted('ROLE_SUPPLIER')]
    public function update(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $supplier = $this->supplierService->updateSupplier($id, $data, $this->getUser());
            
            if (!$supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            return $this->successResponse([
                'supplier' => $this->serializeSupplier($supplier)
            ], 'Supplier updated successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update supplier: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}/verify', name: 'api_suppliers_verify', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function verify(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $verified = $data['verified'] ?? true;
            
            $supplier = $this->supplierService->verifySupplier($id, $verified);
            
            if (!$supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            return $this->successResponse([
                'supplier' => $this->serializeSupplier($supplier)
            ], 'Supplier verification updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to verify supplier: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}/products', name: 'api_suppliers_products', methods: ['GET'])]
    public function getProducts(string $id, Request $request): JsonResponse
    {
        try {
            $filters = [
                'page' => (int) $request->query->get('page', 1),
                'limit' => min((int) $request->query->get('limit', 20), 100),
                'category' => $request->query->get('category'),
                'search' => $request->query->get('search'),
            ];

            $result = $this->supplierService->getSupplierProducts($id, $filters);
            
            return $this->successResponse([
                'products' => array_map([$this, 'serializeProduct'], $result['products']),
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch supplier products: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/dashboard', name: 'api_suppliers_dashboard', methods: ['GET'])]
    #[IsGranted('ROLE_SUPPLIER')]
    public function dashboard(): JsonResponse
    {
        try {
            $dashboard = $this->supplierService->getDashboard($this->getUser());
            
            return $this->successResponse([
                'dashboard' => $dashboard
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch dashboard: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/orders', name: 'api_suppliers_orders', methods: ['GET'])]
    #[IsGranted('ROLE_SUPPLIER')]
    public function getOrders(Request $request): JsonResponse
    {
        try {
            $filters = [
                'page' => (int) $request->query->get('page', 1),
                'limit' => min((int) $request->query->get('limit', 20), 100),
                'status' => $request->query->get('status'),
                'dateFrom' => $request->query->get('dateFrom'),
                'dateTo' => $request->query->get('dateTo'),
            ];

            $result = $this->supplierService->getSupplierOrders($this->getUser(), $filters);
            
            return $this->successResponse([
                'orders' => array_map([$this, 'serializeOrder'], $result['orders']),
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch orders: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/analytics', name: 'api_suppliers_analytics', methods: ['GET'])]
    #[IsGranted('ROLE_SUPPLIER')]
    public function getAnalytics(Request $request): JsonResponse
    {
        try {
            $period = $request->query->get('period', '30d');
            $analytics = $this->supplierService->getAnalytics($this->getUser(), $period);
            
            return $this->successResponse([
                'analytics' => $analytics
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch analytics: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/reviews', name: 'api_suppliers_reviews', methods: ['GET'])]
    #[IsGranted('ROLE_SUPPLIER')]
    public function getReviews(Request $request): JsonResponse
    {
        try {
            $filters = [
                'page' => (int) $request->query->get('page', 1),
                'limit' => min((int) $request->query->get('limit', 20), 100),
                'rating' => $request->query->get('rating'),
            ];

            $result = $this->supplierService->getSupplierReviews($this->getUser(), $filters);
            
            return $this->successResponse([
                'reviews' => array_map([$this, 'serializeReview'], $result['reviews']),
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch reviews: ' . $e->getMessage(), 500);
        }
    }

    private function serializeSupplier($supplier): array
    {
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
    }

    private function serializeSupplierDetail($supplier): array
    {
        $base = $this->serializeSupplier($supplier);
        
        return array_merge($base, [
            'businessLicense' => $supplier->getBusinessLicense(),
            'taxCode' => $supplier->getTaxCode(),
            'deliveryZones' => array_map([$this, 'serializeShipping'], $supplier->getDeliveryZones()->toArray()),
            'products' => array_map([$this, 'serializeProduct'], $supplier->getProducts()->toArray()),
            'reviews' => array_map([$this, 'serializeReview'], $supplier->getProducts()->flatMap(fn($p) => $p->getReviews())->toArray()),
        ]);
    }

    private function serializeProduct($product): array
    {
        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'brand' => $product->getBrand(),
            'sku' => $product->getSku(),
            'price' => $product->getCurrentPrice(),
            'images' => $product->getImages(),
            'rating' => $product->getAverageRating(),
            'totalReviews' => $product->getTotalReviews(),
            'isActive' => $product->isActive(),
        ];
    }

    private function serializeOrder($order): array
    {
        return [
            'id' => $order->getId(),
            'orderNumber' => $order->getOrderNumber(),
            'status' => $order->getStatus(),
            'total' => $order->getTotal(),
            'paymentStatus' => $order->getPaymentStatus(),
            'createdAt' => $order->getCreatedAt()?->format('c'),
        ];
    }

    private function serializeReview($review): array
    {
        return [
            'id' => $review->getId(),
            'rating' => $review->getRating(),
            'title' => $review->getTitle(),
            'comment' => $review->getComment(),
            'isVerified' => $review->isVerified(),
            'createdAt' => $review->getCreatedAt()?->format('c'),
        ];
    }

    private function serializeShipping($shipping): array
    {
        return [
            'id' => $shipping->getId(),
            'name' => $shipping->getName(),
            'description' => $shipping->getDescription(),
            'baseCost' => $shipping->getBaseCost(),
            'estimatedDays' => $shipping->getEstimatedDays(),
            'isActive' => $shipping->isActive(),
        ];
    }
}
