<?php

namespace App\Service;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\Product;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Repository\AddressRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class OrderService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private OrderRepository $orderRepository,
        private ProductRepository $productRepository,
        private AddressRepository $addressRepository
    ) {}

    public function getUserOrders(UserInterface $user, array $filters): array
    {
        $queryBuilder = $this->orderRepository->createQueryBuilder('o')
            ->where('o.user = :user')
            ->setParameter('user', $user);

        // Apply filters
        if (!empty($filters['status'])) {
            $queryBuilder->andWhere('o.status = :status')
                ->setParameter('status', $filters['status']);
        }

        if (!empty($filters['dateFrom'])) {
            $queryBuilder->andWhere('o.createdAt >= :dateFrom')
                ->setParameter('dateFrom', new \DateTime($filters['dateFrom']));
        }

        if (!empty($filters['dateTo'])) {
            $queryBuilder->andWhere('o.createdAt <= :dateTo')
                ->setParameter('dateTo', new \DateTime($filters['dateTo']));
        }

        // Get total count
        $totalQuery = clone $queryBuilder;
        $total = $totalQuery->select('COUNT(o.id)')->getQuery()->getSingleScalarResult();

        // Apply pagination
        $page = max(1, $filters['page'] ?? 1);
        $limit = min(100, max(1, $filters['limit'] ?? 20));
        $offset = ($page - 1) * $limit;

        $queryBuilder->setFirstResult($offset)
            ->setMaxResults($limit)
            ->orderBy('o.createdAt', 'DESC');

        $orders = $queryBuilder->getQuery()->getResult();

        return [
            'orders' => $orders,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => ceil($total / $limit),
            ]
        ];
    }

    public function getOrder(string $id, UserInterface $user): ?Order
    {
        return $this->orderRepository->findOneBy(['id' => $id, 'user' => $user]);
    }

    public function createOrder(UserInterface $user, array $data): Order
    {
        $order = new Order();
        $order->setUser($user);

        // Set shipping address
        if (isset($data['shippingAddressId'])) {
            $address = $this->addressRepository->find($data['shippingAddressId']);
            if ($address && $address->getUser() === $user) {
                $order->setShippingAddress($address);
            } else {
                throw new \InvalidArgumentException('Invalid shipping address');
            }
        }

        $order->setPaymentMethod($data['paymentMethod'] ?? 'VNPAY');
        $order->setNotes($data['notes'] ?? null);

        // Add order items
        $subtotal = 0;
        foreach ($data['items'] as $itemData) {
            $product = $this->productRepository->find($itemData['productId']);
            if (!$product || !$product->isActive()) {
                throw new \InvalidArgumentException('Product not found or inactive');
            }

            $orderItem = new OrderItem();
            $orderItem->setOrder($order);
            $orderItem->setProduct($product);
            $orderItem->setQuantity($itemData['quantity']);
            $orderItem->setUnitPrice($product->getCurrentPrice());
            $orderItem->calculateTotalPrice();

            $order->addOrderItem($orderItem);
            $subtotal += floatval($orderItem->getTotalPrice());
        }

        $order->setSubtotal((string) $subtotal);
        $order->setShippingCost('0'); // Calculate based on shipping service
        $order->setTax('0'); // Calculate tax
        $order->calculateTotal();

        // Set supplier (from first product)
        if ($order->getOrderItems()->count() > 0) {
            $firstItem = $order->getOrderItems()->first();
            $order->setSupplier($firstItem->getProduct()->getSupplier());
        }

        $this->entityManager->persist($order);
        $this->entityManager->flush();

        return $order;
    }

    public function updateOrder(string $id, array $data, UserInterface $user): ?Order
    {
        $order = $this->getOrder($id, $user);
        
        if (!$order) {
            return null;
        }

        if (!$order->canBeCancelled()) {
            throw new \InvalidArgumentException('Order cannot be updated');
        }

        if (isset($data['notes'])) {
            $order->setNotes($data['notes']);
        }

        $order->setUpdatedAt(new \DateTime());
        $this->entityManager->flush();

        return $order;
    }

    public function cancelOrder(string $id, UserInterface $user): ?Order
    {
        $order = $this->getOrder($id, $user);
        
        if (!$order) {
            return null;
        }

        if (!$order->canBeCancelled()) {
            throw new \InvalidArgumentException('Order cannot be cancelled');
        }

        $order->setStatus('CANCELLED');
        $order->setUpdatedAt(new \DateTime());
        $this->entityManager->flush();

        return $order;
    }

    public function requestReturn(string $id, UserInterface $user, ?string $reason = null): ?Order
    {
        $order = $this->getOrder($id, $user);
        
        if (!$order) {
            return null;
        }

        if (!$order->canBeReturned()) {
            throw new \InvalidArgumentException('Order cannot be returned');
        }

        // In a real implementation, you would create a return request
        $order->setStatus('RETURN_REQUESTED');
        $order->setNotes($order->getNotes() . "\nReturn reason: " . ($reason ?? 'No reason provided'));
        $order->setUpdatedAt(new \DateTime());
        $this->entityManager->flush();

        return $order;
    }
}
