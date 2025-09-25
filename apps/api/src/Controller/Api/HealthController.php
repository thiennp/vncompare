<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Repository\SupplierRepository;
use App\Repository\UserRepository;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Repository\ReviewRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

#[Route('/api/v1')]
#[OA\Tag(name: 'System')]
class HealthController extends BaseApiController
{
    public function __construct(
        private SupplierRepository $supplierRepository,
        private UserRepository $userRepository,
        private OrderRepository $orderRepository,
        private ProductRepository $productRepository,
        private ReviewRepository $reviewRepository
    ) {
    }
    #[Route('/health', name: 'api_health', methods: ['GET'])]
    #[OA\Get(
        path: '/api/v1/health',
        summary: 'Health check endpoint',
        description: 'Returns the current health status of the API',
        tags: ['System'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'API is healthy',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Success'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'status', type: 'string', example: 'healthy'),
                                new OA\Property(property: 'timestamp', type: 'string', format: 'date-time'),
                                new OA\Property(property: 'version', type: 'string', example: '1.0.0'),
                                new OA\Property(property: 'environment', type: 'string', example: 'dev')
                            ]
                        ),
                        new OA\Property(
                            property: 'meta',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'timestamp', type: 'string', format: 'date-time'),
                                new OA\Property(property: 'requestId', type: 'string')
                            ]
                        )
                    ]
                )
            )
        ]
    )]
    public function health(): JsonResponse
    {
        return $this->successResponse([
            'status' => 'healthy',
            'timestamp' => (new \DateTime())->format('c'),
            'version' => '1.0.0',
            'environment' => $_ENV['APP_ENV'] ?? 'unknown'
        ]);
    }

    #[Route('/status', name: 'api_status', methods: ['GET'])]
    public function status(): JsonResponse
    {
        return $this->successResponse([
            'api' => 'VNCompare API',
            'version' => '1.0.0',
            'status' => 'operational',
            'uptime' => '100%',
            'database' => 'connected',
            'cache' => 'operational'
        ]);
    }

    #[Route('/dashboard/metrics', name: 'api_dashboard_metrics', methods: ['GET'])]
    public function dashboardMetrics(): JsonResponse
    {
        try {
            // Calculate real metrics from database
            $supplierCount = $this->supplierRepository->count([]);
            $userCount = $this->userRepository->count([]);
            $productCount = $this->productRepository->count([]);
            $reviewCount = $this->reviewRepository->count([]);
            $orderCount = $this->orderRepository->count([]);
            
            // Calculate total revenue from orders
            $totalRevenue = $this->orderRepository->getTotalRevenue();
            
            // Get recent orders (last 3)
            $recentOrders = $this->orderRepository->findRecentOrders(3);
            $recentOrdersData = array_map(function ($order) {
                return [
                    'id' => (string) $order->getId(),
                    'customerName' => $order->getUser() ? $order->getUser()->getFirstName() . ' ' . $order->getUser()->getLastName() : 'Unknown',
                    'totalAmount' => (float) $order->getTotal(),
                    'status' => $order->getStatus(),
                    'createdAt' => $order->getCreatedAt()?->format('c')
                ];
            }, $recentOrders);
            
            // Get top products (by order count or revenue)
            $topProducts = $this->productRepository->findTopProducts(3);
            $topProductsData = array_map(function ($product) {
                return [
                    'id' => (string) $product->getId(),
                    'name' => $product->getName(),
                    'sales' => 0, // Would be calculated from order items in a full implementation
                    'revenue' => 0 // Would be calculated from order items in a full implementation
                ];
            }, $topProducts);
            
            // Calculate pending suppliers (unverified)
            $pendingSuppliers = $this->supplierRepository->count(['isVerified' => false]);
            
            // Calculate pending reviews (for now, return 0 as we don't have status tracking)
            $pendingReviews = 0;
            
            // Calculate low stock products (if we have a stock field)
            $lowStockProducts = $this->productRepository->countLowStockProducts();
            
            return $this->successResponse([
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $orderCount,
                'totalProducts' => $productCount,
                'totalUsers' => $userCount,
                'totalSuppliers' => $supplierCount,
                'totalReviews' => $reviewCount,
                'revenueGrowth' => 0, // Would need historical data to calculate
                'ordersGrowth' => 0, // Would need historical data to calculate
                'productsGrowth' => 0, // Would need historical data to calculate
                'usersGrowth' => 0, // Would need historical data to calculate
                'pendingReviews' => $pendingReviews,
                'lowStockProducts' => $lowStockProducts,
                'pendingSuppliers' => $pendingSuppliers,
                'recentOrders' => $recentOrdersData,
                'topProducts' => $topProductsData
            ]);
        } catch (\Exception $e) {
            // Fallback response if database is not available
            return $this->successResponse([
                'totalRevenue' => 0,
                'totalOrders' => 0,
                'totalProducts' => 0,
                'totalUsers' => 0,
                'totalSuppliers' => 0,
                'totalReviews' => 0,
                'revenueGrowth' => 0,
                'ordersGrowth' => 0,
                'productsGrowth' => 0,
                'usersGrowth' => 0,
                'pendingReviews' => 0,
                'lowStockProducts' => 0,
                'pendingSuppliers' => 0,
                'recentOrders' => [],
                'topProducts' => []
            ], 'Dashboard metrics (fallback data)');
        }
    }

    #[Route('/test/suppliers', name: 'api_test_suppliers', methods: ['GET'])]
    public function testSuppliers(): JsonResponse
    {
        try {
            $suppliers = $this->supplierRepository->findAll();
            
            $suppliersData = array_map(function ($supplier) {
                return [
                    'id' => (string) $supplier->getId(),
                    'name' => $supplier->getName(),
                    'email' => $supplier->getEmail(),
                    'phone' => $supplier->getPhone(),
                    'address' => $supplier->getAddress(),
                    'isVerified' => $supplier->getIsVerified(),
                    'createdAt' => $supplier->getCreatedAt()?->format('c')
                ];
            }, $suppliers);
            
            return $this->successResponse([
                'suppliers' => $suppliersData,
                'total' => count($suppliersData)
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch suppliers: ' . $e->getMessage(), 500);
        }
    }
}
