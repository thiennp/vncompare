<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Service\OrderService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/v1/orders')]
class OrderController extends BaseApiController
{
    public function __construct(
        private OrderService $orderService
    ) {}

    #[Route('', name: 'api_orders_list', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function list(Request $request): JsonResponse
    {
        try {
            $filters = [
                'page' => (int) $request->query->get('page', 1),
                'limit' => min((int) $request->query->get('limit', 20), 100),
                'status' => $request->query->get('status'),
                'dateFrom' => $request->query->get('dateFrom'),
                'dateTo' => $request->query->get('dateTo'),
            ];

            $result = $this->orderService->getUserOrders($this->getUser(), $filters);
            
            return $this->successResponse([
                'orders' => array_map([$this, 'serializeOrder'], $result['orders']),
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch orders: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}', name: 'api_orders_show', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function show(string $id): JsonResponse
    {
        try {
            $order = $this->orderService->getOrder($id, $this->getUser());
            
            if (!$order) {
                return $this->notFoundResponse('Order not found');
            }

            return $this->successResponse([
                'order' => $this->serializeOrderDetail($order)
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch order: ' . $e->getMessage(), 500);
        }
    }

    #[Route('', name: 'api_orders_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $order = $this->orderService->createOrder($this->getUser(), $data);
            
            return $this->successResponse([
                'order' => $this->serializeOrder($order),
                'paymentUrl' => $order->getPaymentStatus() === 'PENDING' ? $this->generatePaymentUrl($order) : null,
                'orderNumber' => $order->getOrderNumber()
            ], 'Order created successfully', 201);
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create order: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}', name: 'api_orders_update', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function update(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $order = $this->orderService->updateOrder($id, $data, $this->getUser());
            
            if (!$order) {
                return $this->notFoundResponse('Order not found');
            }

            return $this->successResponse([
                'order' => $this->serializeOrder($order)
            ], 'Order updated successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update order: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}/cancel', name: 'api_orders_cancel', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function cancel(string $id): JsonResponse
    {
        try {
            $order = $this->orderService->cancelOrder($id, $this->getUser());
            
            if (!$order) {
                return $this->notFoundResponse('Order not found');
            }

            if (!$order->canBeCancelled()) {
                return $this->errorResponse('Order cannot be cancelled', 400);
            }

            return $this->successResponse([
                'order' => $this->serializeOrder($order)
            ], 'Order cancelled successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to cancel order: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}/return', name: 'api_orders_return', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function requestReturn(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $reason = $data['reason'] ?? null;
            
            $order = $this->orderService->requestReturn($id, $this->getUser(), $reason);
            
            if (!$order) {
                return $this->notFoundResponse('Order not found');
            }

            if (!$order->canBeReturned()) {
                return $this->errorResponse('Order cannot be returned', 400);
            }

            return $this->successResponse([
                'order' => $this->serializeOrder($order)
            ], 'Return request submitted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to request return: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}/items', name: 'api_orders_items', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getItems(string $id): JsonResponse
    {
        try {
            $order = $this->orderService->getOrder($id, $this->getUser());
            
            if (!$order) {
                return $this->notFoundResponse('Order not found');
            }

            return $this->successResponse([
                'items' => array_map([$this, 'serializeOrderItem'], $order->getOrderItems()->toArray())
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch order items: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}/tracking', name: 'api_orders_tracking', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getTracking(string $id): JsonResponse
    {
        try {
            $order = $this->orderService->getOrder($id, $this->getUser());
            
            if (!$order) {
                return $this->notFoundResponse('Order not found');
            }

            return $this->successResponse([
                'tracking' => array_map([$this, 'serializeTracking'], $order->getTracking()->toArray())
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch tracking information: ' . $e->getMessage(), 500);
        }
    }

    private function serializeOrder($order): array
    {
        return [
            'id' => $order->getId(),
            'orderNumber' => $order->getOrderNumber(),
            'status' => $order->getStatus(),
            'subtotal' => $order->getSubtotal(),
            'shippingCost' => $order->getShippingCost(),
            'tax' => $order->getTax(),
            'total' => $order->getTotal(),
            'paymentMethod' => $order->getPaymentMethod(),
            'paymentStatus' => $order->getPaymentStatus(),
            'shippingAddress' => $this->serializeAddress($order->getShippingAddress()),
            'notes' => $order->getNotes(),
            'createdAt' => $order->getCreatedAt()?->format('c'),
            'deliveredAt' => $order->getDeliveredAt()?->format('c'),
            'canBeCancelled' => $order->canBeCancelled(),
            'canBeReturned' => $order->canBeReturned(),
        ];
    }

    private function serializeOrderDetail($order): array
    {
        $base = $this->serializeOrder($order);
        
        return array_merge($base, [
            'items' => array_map([$this, 'serializeOrderItem'], $order->getOrderItems()->toArray()),
            'tracking' => array_map([$this, 'serializeTracking'], $order->getTracking()->toArray()),
            'supplier' => [
                'id' => $order->getSupplier()?->getId(),
                'companyName' => $order->getSupplier()?->getCompanyName(),
                'rating' => $order->getSupplier()?->getRating(),
            ],
        ]);
    }

    private function serializeOrderItem($item): array
    {
        return [
            'id' => $item->getId(),
            'product' => [
                'id' => $item->getProduct()?->getId(),
                'name' => $item->getProduct()?->getName(),
                'sku' => $item->getProduct()?->getSku(),
                'images' => $item->getProduct()?->getImages(),
            ],
            'quantity' => $item->getQuantity(),
            'unitPrice' => $item->getUnitPrice(),
            'totalPrice' => $item->getTotalPrice(),
            'notes' => $item->getNotes(),
        ];
    }

    private function serializeTracking($tracking): array
    {
        return [
            'id' => $tracking->getId(),
            'status' => $tracking->getStatus(),
            'description' => $tracking->getDescription(),
            'location' => $tracking->getLocation(),
            'trackingNumber' => $tracking->getTrackingNumber(),
            'timestamp' => $tracking->getTimestamp()?->format('c'),
            'metadata' => $tracking->getMetadata(),
        ];
    }

    private function serializeAddress($address): array
    {
        if (!$address) {
            return null;
        }

        return [
            'id' => $address->getId(),
            'type' => $address->getType(),
            'recipientName' => $address->getRecipientName(),
            'phone' => $address->getPhone(),
            'province' => $address->getProvince(),
            'district' => $address->getDistrict(),
            'ward' => $address->getWard(),
            'street' => $address->getStreet(),
            'houseNumber' => $address->getHouseNumber(),
            'postalCode' => $address->getPostalCode(),
            'fullAddress' => $address->getFullAddress(),
        ];
    }

    private function generatePaymentUrl($order): ?string
    {
        // This would generate the actual payment URL based on the payment method
        return match ($order->getPaymentMethod()) {
            'VNPAY' => 'https://vnpay.vn/payment/' . $order->getId(),
            'MOMO' => 'https://momo.vn/payment/' . $order->getId(),
            'ZALOPAY' => 'https://zalopay.vn/payment/' . $order->getId(),
            default => null
        };
    }
}
