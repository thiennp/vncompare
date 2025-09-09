<?php

namespace App\Service;

use App\Entity\Product;
use App\Entity\Category;
use App\Entity\Supplier;
use App\Repository\ProductRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class ProductService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ProductRepository $productRepository,
        private CategoryRepository $categoryRepository
    ) {}

    public function getProducts(array $filters): array
    {
        $queryBuilder = $this->productRepository->createQueryBuilder('p')
            ->leftJoin('p.category', 'c')
            ->leftJoin('p.supplier', 's')
            ->where('p.isActive = :active')
            ->setParameter('active', true);

        // Apply filters
        if (!empty($filters['category'])) {
            $queryBuilder->andWhere('c.slug = :category')
                ->setParameter('category', $filters['category']);
        }

        if (!empty($filters['brand'])) {
            $queryBuilder->andWhere('p.brand = :brand')
                ->setParameter('brand', $filters['brand']);
        }

        if (!empty($filters['minPrice'])) {
            $queryBuilder->andWhere('p.price >= :minPrice')
                ->setParameter('minPrice', $filters['minPrice']);
        }

        if (!empty($filters['maxPrice'])) {
            $queryBuilder->andWhere('p.price <= :maxPrice')
                ->setParameter('maxPrice', $filters['maxPrice']);
        }

        if (!empty($filters['color'])) {
            $queryBuilder->andWhere('p.color = :color')
                ->setParameter('color', $filters['color']);
        }

        if (!empty($filters['finish'])) {
            $queryBuilder->andWhere('p.finish = :finish')
                ->setParameter('finish', $filters['finish']);
        }

        if (!empty($filters['search'])) {
            $queryBuilder->andWhere('p.name LIKE :search OR p.description LIKE :search')
                ->setParameter('search', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['supplier'])) {
            $queryBuilder->andWhere('s.id = :supplier')
                ->setParameter('supplier', $filters['supplier']);
        }

        // Apply sorting
        switch ($filters['sort'] ?? 'newest') {
            case 'price_asc':
                $queryBuilder->orderBy('p.price', 'ASC');
                break;
            case 'price_desc':
                $queryBuilder->orderBy('p.price', 'DESC');
                break;
            case 'rating_desc':
                $queryBuilder->orderBy('p.rating', 'DESC');
                break;
            case 'newest':
            default:
                $queryBuilder->orderBy('p.createdAt', 'DESC');
                break;
        }

        // Get total count
        $totalQuery = clone $queryBuilder;
        $total = $totalQuery->select('COUNT(p.id)')->getQuery()->getSingleScalarResult();

        // Apply pagination
        $page = max(1, $filters['page'] ?? 1);
        $limit = min(100, max(1, $filters['limit'] ?? 20));
        $offset = ($page - 1) * $limit;

        $queryBuilder->setFirstResult($offset)
            ->setMaxResults($limit);

        $products = $queryBuilder->getQuery()->getResult();

        // Get filter options
        $filters = $this->getFilterOptions();

        return [
            'products' => $products,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => ceil($total / $limit),
            ],
            'filters' => $filters
        ];
    }

    public function getProduct(string $id): ?Product
    {
        return $this->productRepository->find($id);
    }

    public function createProduct(array $data, UserInterface $user): Product
    {
        $product = new Product();
        $product->setName($data['name']);
        $product->setDescription($data['description'] ?? null);
        $product->setBrand($data['brand']);
        $product->setSku($data['sku']);
        $product->setColor($data['color'] ?? null);
        $product->setFinish($data['finish']);
        $product->setCoverage($data['coverage']);
        $product->setVolume($data['volume']);
        $product->setPrice($data['price']);
        $product->setDiscountPrice($data['discountPrice'] ?? null);
        $product->setImages($data['images'] ?? []);
        $product->setSpecifications($data['specifications'] ?? []);
        $product->setTags($data['tags'] ?? []);

        // Set category
        if (isset($data['categoryId'])) {
            $category = $this->categoryRepository->find($data['categoryId']);
            if ($category) {
                $product->setCategory($category);
            }
        }

        // Set supplier (assuming user has supplier role)
        // In a real implementation, you'd get the supplier from the user
        // $product->setSupplier($user->getSupplier());

        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return $product;
    }

    public function updateProduct(string $id, array $data, UserInterface $user): ?Product
    {
        $product = $this->productRepository->find($id);
        
        if (!$product) {
            return null;
        }

        // Check if user can update this product
        // In a real implementation, you'd check if the user owns the supplier

        if (isset($data['name'])) {
            $product->setName($data['name']);
        }
        if (isset($data['description'])) {
            $product->setDescription($data['description']);
        }
        if (isset($data['brand'])) {
            $product->setBrand($data['brand']);
        }
        if (isset($data['price'])) {
            $product->setPrice($data['price']);
        }
        if (isset($data['discountPrice'])) {
            $product->setDiscountPrice($data['discountPrice']);
        }
        if (isset($data['images'])) {
            $product->setImages($data['images']);
        }
        if (isset($data['specifications'])) {
            $product->setSpecifications($data['specifications']);
        }

        $product->setUpdatedAt(new \DateTime());
        $this->entityManager->flush();

        return $product;
    }

    public function deleteProduct(string $id): bool
    {
        $product = $this->productRepository->find($id);
        
        if (!$product) {
            return false;
        }

        $this->entityManager->remove($product);
        $this->entityManager->flush();

        return true;
    }

    public function toggleProductStatus(string $id, bool $isActive, UserInterface $user): ?Product
    {
        $product = $this->productRepository->find($id);
        
        if (!$product) {
            return null;
        }

        // Check if user can update this product
        // In a real implementation, you'd check if the user owns the supplier

        $product->setActive($isActive);
        $product->setUpdatedAt(new \DateTime());
        $this->entityManager->flush();

        return $product;
    }

    public function searchProducts(string $query, array $filters): array
    {
        // Similar to getProducts but with search-specific logic
        return $this->getProducts(array_merge($filters, ['search' => $query]));
    }

    public function getFeaturedProducts(int $limit): array
    {
        return $this->productRepository->createQueryBuilder('p')
            ->where('p.isActive = :active')
            ->andWhere('p.isFeatured = :featured')
            ->setParameter('active', true)
            ->setParameter('featured', true)
            ->orderBy('p.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function getSimilarProducts(string $productId, int $limit): array
    {
        $product = $this->productRepository->find($productId);
        
        if (!$product) {
            return [];
        }

        return $this->productRepository->createQueryBuilder('p')
            ->where('p.isActive = :active')
            ->andWhere('p.id != :productId')
            ->andWhere('p.category = :category OR p.brand = :brand')
            ->setParameter('active', true)
            ->setParameter('productId', $productId)
            ->setParameter('category', $product->getCategory())
            ->setParameter('brand', $product->getBrand())
            ->orderBy('p.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    private function getFilterOptions(): array
    {
        // This would return available filter options
        return [
            'categories' => [],
            'brands' => [],
            'priceRange' => [
                'min' => 0,
                'max' => 10000000
            ]
        ];
    }
}
