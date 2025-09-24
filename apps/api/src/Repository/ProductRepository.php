<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function findTopProducts(int $limit = 3): array
    {
        // For now, return products ordered by creation date
        // In a full implementation, this would be ordered by sales/revenue
        return $this->createQueryBuilder('p')
            ->orderBy('p.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function countLowStockProducts(): int
    {
        // For now, return 0 as we don't have stock tracking
        // In a full implementation, this would count products with low stock
        return 0;
    }
}
