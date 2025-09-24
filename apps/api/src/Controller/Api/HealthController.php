<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

#[Route('/api/v1')]
#[OA\Tag(name: 'System')]
class HealthController extends BaseApiController
{
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
        // Mock data for now - in a real application, this would query the database
        return $this->successResponse([
            'totalRevenue' => 1250000,
            'totalOrders' => 1250,
            'totalProducts' => 450,
            'totalUsers' => 3200,
            'totalSuppliers' => 85,
            'totalReviews' => 890,
            'revenueGrowth' => 12.5,
            'ordersGrowth' => 8.3,
            'productsGrowth' => 15.2,
            'usersGrowth' => 22.1,
            'pendingReviews' => 23,
            'lowStockProducts' => 12,
            'pendingSuppliers' => 5
        ]);
    }
}
