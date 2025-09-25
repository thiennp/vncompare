<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Attributes as OA;

#[Route('/api/v1/shipping')]
#[OA\Tag(name: 'Shipping')]
class ShippingController extends BaseApiController
{
    #[Route('/calculate', name: 'api_shipping_calculate', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    #[OA\Post(
        path: '/api/v1/shipping/calculate',
        summary: 'Calculate shipping cost and options',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'supplierId', type: 'string'),
                    new OA\Property(property: 'addressId', type: 'string'),
                    new OA\Property(
                        property: 'items',
                        type: 'array',
                        items: new OA\Items(properties: [
                            new OA\Property(property: 'productId', type: 'string'),
                            new OA\Property(property: 'quantity', type: 'integer'),
                            new OA\Property(property: 'weight', type: 'number', format: 'float', nullable: true)
                        ], type: 'object')
                    )
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Shipping options calculated')
        ]
    )]
    public function calculate(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!isset($data['supplierId']) || !isset($data['addressId']) || !isset($data['items']) || !is_array($data['items'])) {
            return $this->validationErrorResponse(['supplierId, addressId and items are required']);
        }

        // Simple placeholder calculation
        $totalWeight = 0.0;
        foreach ($data['items'] as $item) {
            $qty = (int)($item['quantity'] ?? 1);
            $weight = (float)($item['weight'] ?? 1.0);
            $totalWeight += $qty * $weight;
        }

        $baseCost = 50000; // VND
        $costPerKg = 10000; // VND per kg
        $estimatedDays = $totalWeight > 10 ? 4 : 2;

        return $this->successResponse([
            'shippingOptions' => [
                [
                    'id' => 'standard',
                    'name' => 'Giao hàng tiêu chuẩn',
                    'description' => 'Giao hàng trong 2-4 ngày làm việc',
                    'cost' => $baseCost + (int)ceil($totalWeight) * $costPerKg,
                    'estimatedDays' => $estimatedDays,
                    'isAvailable' => true
                ],
                [
                    'id' => 'express',
                    'name' => 'Giao hàng nhanh',
                    'description' => 'Giao hàng trong 1-2 ngày làm việc',
                    'cost' => $baseCost + 30000 + (int)ceil($totalWeight) * ($costPerKg + 5000),
                    'estimatedDays' => max(1, $estimatedDays - 1),
                    'isAvailable' => true
                ]
            ],
            'freeShippingThreshold' => 500000,
            'isEligibleForFreeShipping' => false
        ], 'Shipping options calculated');
    }
}


