<?php

namespace App\Service;

use App\Entity\Supplier;
use App\Repository\SupplierRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class SupplierService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SupplierRepository $supplierRepository
    ) {}

    public function getSuppliers(array $filters): array
    {
        $queryBuilder = $this->supplierRepository->createQueryBuilder('s')
            ->where('s.isVerified = :verified')
            ->setParameter('verified', true);

        // Apply filters
        if (!empty($filters['province'])) {
            $queryBuilder->andWhere('JSON_CONTAINS(s.serviceAreas, :province) = 1')
                ->setParameter('province', json_encode($filters['province']));
        }

        if (!empty($filters['search'])) {
            $queryBuilder->andWhere('s.companyName LIKE :search OR s.description LIKE :search')
                ->setParameter('search', '%' . $filters['search'] . '%');
        }

        // Get total count
        $totalQuery = clone $queryBuilder;
        $total = $totalQuery->select('COUNT(s.id)')->getQuery()->getSingleScalarResult();

        // Apply pagination
        $page = max(1, $filters['page'] ?? 1);
        $limit = min(100, max(1, $filters['limit'] ?? 20));
        $offset = ($page - 1) * $limit;

        $queryBuilder->setFirstResult($offset)
            ->setMaxResults($limit)
            ->orderBy('s.rating', 'DESC');

        $suppliers = $queryBuilder->getQuery()->getResult();

        return [
            'suppliers' => $suppliers,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => ceil($total / $limit),
            ]
        ];
    }

    public function getSupplier(string $id): ?Supplier
    {
        return $this->supplierRepository->find($id);
    }

    public function registerSupplier(UserInterface $user, array $data): Supplier
    {
        $supplier = new Supplier();
        $supplier->setUser($user);
        $supplier->setCompanyName($data['companyName']);
        $supplier->setBusinessLicense($data['businessLicense']);
        $supplier->setTaxCode($data['taxCode']);
        $supplier->setDescription($data['description'] ?? null);
        $supplier->setWebsite($data['website'] ?? null);
        $supplier->setServiceAreas($data['serviceAreas'] ?? []);

        $this->entityManager->persist($supplier);
        $this->entityManager->flush();

        return $supplier;
    }

    public function updateSupplier(string $id, array $data, UserInterface $user): ?Supplier
    {
        $supplier = $this->supplierRepository->find($id);
        
        if (!$supplier || $supplier->getUser() !== $user) {
            return null;
        }

        if (isset($data['companyName'])) {
            $supplier->setCompanyName($data['companyName']);
        }
        if (isset($data['description'])) {
            $supplier->setDescription($data['description']);
        }
        if (isset($data['website'])) {
            $supplier->setWebsite($data['website']);
        }
        if (isset($data['serviceAreas'])) {
            $supplier->setServiceAreas($data['serviceAreas']);
        }

        $supplier->setUpdatedAt(new \DateTime());
        $this->entityManager->flush();

        return $supplier;
    }

    public function verifySupplier(string $id, bool $verified): ?Supplier
    {
        $supplier = $this->supplierRepository->find($id);
        
        if (!$supplier) {
            return null;
        }

        $supplier->setVerified($verified);
        $this->entityManager->flush();

        return $supplier;
    }

    public function getSupplierProducts(string $id, array $filters): array
    {
        // This would be implemented to get products for a specific supplier
        return [
            'products' => [],
            'pagination' => [
                'page' => 1,
                'limit' => 20,
                'total' => 0,
                'totalPages' => 0,
            ]
        ];
    }

    public function getDashboard(UserInterface $user): array
    {
        $supplier = $user->getSupplier();
        
        if (!$supplier) {
            return [];
        }

        return [
            'totalProducts' => $supplier->getTotalProducts(),
            'activeProducts' => $supplier->getActiveProducts(),
            'totalOrders' => $supplier->getOrders()->count(),
            'rating' => $supplier->getRating(),
            'totalReviews' => $supplier->getTotalReviews(),
        ];
    }

    public function getSupplierOrders(UserInterface $user, array $filters): array
    {
        $supplier = $user->getSupplier();
        
        if (!$supplier) {
            return [
                'orders' => [],
                'pagination' => [
                    'page' => 1,
                    'limit' => 20,
                    'total' => 0,
                    'totalPages' => 0,
                ]
            ];
        }

        // This would be implemented to get orders for the supplier
        return [
            'orders' => $supplier->getOrders()->toArray(),
            'pagination' => [
                'page' => 1,
                'limit' => 20,
                'total' => $supplier->getOrders()->count(),
                'totalPages' => 1,
            ]
        ];
    }

    public function getAnalytics(UserInterface $user, string $period): array
    {
        // This would be implemented to get analytics data
        return [
            'sales' => [],
            'orders' => [],
            'products' => [],
        ];
    }

    public function getSupplierReviews(UserInterface $user, array $filters): array
    {
        $supplier = $user->getSupplier();
        
        if (!$supplier) {
            return [
                'reviews' => [],
                'pagination' => [
                    'page' => 1,
                    'limit' => 20,
                    'total' => 0,
                    'totalPages' => 0,
                ]
            ];
        }

        // This would be implemented to get reviews for the supplier's products
        return [
            'reviews' => [],
            'pagination' => [
                'page' => 1,
                'limit' => 20,
                'total' => 0,
                'totalPages' => 0,
            ]
        ];
    }
}
