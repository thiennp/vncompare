<?php

namespace App\Service;

use App\Entity\Review;
use App\Entity\Product;
use App\Repository\ReviewRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class ReviewService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ReviewRepository $reviewRepository,
        private ProductRepository $productRepository
    ) {}

    public function getProductReviews(string $productId, array $filters): array
    {
        $product = $this->productRepository->find($productId);
        
        if (!$product) {
            return [
                'reviews' => [],
                'pagination' => ['page' => 1, 'limit' => 20, 'total' => 0, 'totalPages' => 0],
                'summary' => ['average' => 0, 'total' => 0, 'distribution' => []]
            ];
        }

        $queryBuilder = $this->reviewRepository->createQueryBuilder('r')
            ->where('r.product = :product')
            ->andWhere('r.isModerated = :moderated')
            ->setParameter('product', $product)
            ->setParameter('moderated', true);

        // Apply filters
        if (!empty($filters['rating'])) {
            $queryBuilder->andWhere('r.rating = :rating')
                ->setParameter('rating', $filters['rating']);
        }

        // Apply sorting
        switch ($filters['sort'] ?? 'newest') {
            case 'oldest':
                $queryBuilder->orderBy('r.createdAt', 'ASC');
                break;
            case 'helpful':
                $queryBuilder->orderBy('r.helpful', 'DESC');
                break;
            case 'newest':
            default:
                $queryBuilder->orderBy('r.createdAt', 'DESC');
                break;
        }

        // Get total count
        $totalQuery = clone $queryBuilder;
        $total = $totalQuery->select('COUNT(r.id)')->getQuery()->getSingleScalarResult();

        // Apply pagination
        $page = max(1, $filters['page'] ?? 1);
        $limit = min(100, max(1, $filters['limit'] ?? 20));
        $offset = ($page - 1) * $limit;

        $queryBuilder->setFirstResult($offset)
            ->setMaxResults($limit);

        $reviews = $queryBuilder->getQuery()->getResult();

        // Calculate summary
        $summary = $this->calculateReviewSummary($product);

        return [
            'reviews' => $reviews,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => ceil($total / $limit),
            ],
            'summary' => $summary
        ];
    }

    public function createReview(string $productId, UserInterface $user, array $data): Review
    {
        $product = $this->productRepository->find($productId);
        
        if (!$product) {
            throw new \InvalidArgumentException('Product not found');
        }

        // Check if user already reviewed this product
        $existingReview = $this->reviewRepository->findOneBy([
            'user' => $user,
            'product' => $product
        ]);

        if ($existingReview) {
            throw new \InvalidArgumentException('You have already reviewed this product');
        }

        $review = new Review();
        $review->setUser($user);
        $review->setProduct($product);
        $review->setRating($data['rating']);
        $review->setTitle($data['title'] ?? null);
        $review->setComment($data['comment'] ?? null);
        $review->setImages($data['images'] ?? []);

        $this->entityManager->persist($review);
        $this->entityManager->flush();

        // Update product rating
        $this->updateProductRating($product);

        return $review;
    }

    public function updateReview(string $id, array $data, UserInterface $user): ?Review
    {
        $review = $this->reviewRepository->findOneBy(['id' => $id, 'user' => $user]);
        
        if (!$review) {
            return null;
        }

        if (isset($data['rating'])) {
            $review->setRating($data['rating']);
        }
        if (isset($data['title'])) {
            $review->setTitle($data['title']);
        }
        if (isset($data['comment'])) {
            $review->setComment($data['comment']);
        }
        if (isset($data['images'])) {
            $review->setImages($data['images']);
        }

        $review->setUpdatedAt(new \DateTime());
        $this->entityManager->flush();

        // Update product rating
        $this->updateProductRating($review->getProduct());

        return $review;
    }

    public function deleteReview(string $id, UserInterface $user): bool
    {
        $review = $this->reviewRepository->findOneBy(['id' => $id, 'user' => $user]);
        
        if (!$review) {
            return false;
        }

        $product = $review->getProduct();
        $this->entityManager->remove($review);
        $this->entityManager->flush();

        // Update product rating
        $this->updateProductRating($product);

        return true;
    }

    public function markHelpful(string $id, UserInterface $user): ?Review
    {
        $review = $this->reviewRepository->find($id);
        
        if (!$review) {
            return null;
        }

        $review->incrementHelpful();
        $this->entityManager->flush();

        return $review;
    }

    public function reportReview(string $id, UserInterface $user, ?string $reason = null): void
    {
        $review = $this->reviewRepository->find($id);
        
        if (!$review) {
            throw new \InvalidArgumentException('Review not found');
        }

        // In a real implementation, you would create a report record
        // For now, we'll just mark the review as needing moderation
        $review->setModerated(false);
        $this->entityManager->flush();
    }

    public function getUserReviews(UserInterface $user, array $filters): array
    {
        $queryBuilder = $this->reviewRepository->createQueryBuilder('r')
            ->where('r.user = :user')
            ->setParameter('user', $user);

        // Get total count
        $totalQuery = clone $queryBuilder;
        $total = $totalQuery->select('COUNT(r.id)')->getQuery()->getSingleScalarResult();

        // Apply pagination
        $page = max(1, $filters['page'] ?? 1);
        $limit = min(100, max(1, $filters['limit'] ?? 20));
        $offset = ($page - 1) * $limit;

        $queryBuilder->setFirstResult($offset)
            ->setMaxResults($limit)
            ->orderBy('r.createdAt', 'DESC');

        $reviews = $queryBuilder->getQuery()->getResult();

        return [
            'reviews' => $reviews,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => ceil($total / $limit),
            ]
        ];
    }

    public function getPendingReviews(array $filters): array
    {
        $queryBuilder = $this->reviewRepository->createQueryBuilder('r')
            ->where('r.isModerated = :moderated')
            ->setParameter('moderated', false);

        // Get total count
        $totalQuery = clone $queryBuilder;
        $total = $totalQuery->select('COUNT(r.id)')->getQuery()->getSingleScalarResult();

        // Apply pagination
        $page = max(1, $filters['page'] ?? 1);
        $limit = min(100, max(1, $filters['limit'] ?? 20));
        $offset = ($page - 1) * $limit;

        $queryBuilder->setFirstResult($offset)
            ->setMaxResults($limit)
            ->orderBy('r.createdAt', 'DESC');

        $reviews = $queryBuilder->getQuery()->getResult();

        return [
            'reviews' => $reviews,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => ceil($total / $limit),
            ]
        ];
    }

    public function moderateReview(string $id, bool $approved, ?string $reason = null): ?Review
    {
        $review = $this->reviewRepository->find($id);
        
        if (!$review) {
            return null;
        }

        $review->setModerated(true);
        if (!$approved) {
            // In a real implementation, you might want to delete or hide the review
            $review->setComment('This review has been moderated and removed.');
        }

        $this->entityManager->flush();

        return $review;
    }

    private function calculateReviewSummary(Product $product): array
    {
        $reviews = $product->getReviews()->toArray();
        
        if (empty($reviews)) {
            return [
                'average' => 0,
                'total' => 0,
                'distribution' => ['5' => 0, '4' => 0, '3' => 0, '2' => 0, '1' => 0]
            ];
        }

        $total = count($reviews);
        $sum = array_sum(array_map(fn($r) => $r->getRating(), $reviews));
        $average = round($sum / $total, 1);

        $distribution = ['5' => 0, '4' => 0, '3' => 0, '2' => 0, '1' => 0];
        foreach ($reviews as $review) {
            $rating = (string) $review->getRating();
            if (isset($distribution[$rating])) {
                $distribution[$rating]++;
            }
        }

        return [
            'average' => $average,
            'total' => $total,
            'distribution' => $distribution
        ];
    }

    private function updateProductRating(Product $product): void
    {
        $reviews = $product->getReviews()->toArray();
        
        if (empty($reviews)) {
            return;
        }

        $total = count($reviews);
        $sum = array_sum(array_map(fn($r) => $r->getRating(), $reviews));
        $average = round($sum / $total, 1);

        // Update supplier rating as well
        $supplier = $product->getSupplier();
        if ($supplier) {
            $supplier->updateRating();
        }
    }
}
