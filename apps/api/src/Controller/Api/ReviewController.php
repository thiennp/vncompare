<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Service\ReviewService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/v1')]
class ReviewController extends BaseApiController
{
    public function __construct(
        private ReviewService $reviewService
    ) {}

    #[Route('/products/{id}/reviews', name: 'api_products_reviews', methods: ['GET'])]
    public function getProductReviews(string $id, Request $request): JsonResponse
    {
        try {
            $filters = [
                'page' => (int) $request->query->get('page', 1),
                'limit' => min((int) $request->query->get('limit', 20), 100),
                'rating' => $request->query->get('rating'),
                'sort' => $request->query->get('sort', 'newest'),
            ];

            $result = $this->reviewService->getProductReviews($id, $filters);
            
            return $this->successResponse([
                'reviews' => array_map([$this, 'serializeReview'], $result['reviews']),
                'pagination' => $result['pagination'],
                'summary' => $result['summary']
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch reviews: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/products/{id}/reviews', name: 'api_products_create_review', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function createReview(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $review = $this->reviewService->createReview($id, $this->getUser(), $data);
            
            return $this->successResponse([
                'review' => $this->serializeReview($review)
            ], 'Review created successfully', 201);
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create review: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/reviews/{id}', name: 'api_reviews_update', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function updateReview(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $review = $this->reviewService->updateReview($id, $data, $this->getUser());
            
            if (!$review) {
                return $this->notFoundResponse('Review not found');
            }

            return $this->successResponse([
                'review' => $this->serializeReview($review)
            ], 'Review updated successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update review: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/reviews/{id}', name: 'api_reviews_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function deleteReview(string $id): JsonResponse
    {
        try {
            $deleted = $this->reviewService->deleteReview($id, $this->getUser());
            
            if (!$deleted) {
                return $this->notFoundResponse('Review not found');
            }

            return $this->successResponse(null, 'Review deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete review: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/reviews/{id}/helpful', name: 'api_reviews_helpful', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function markHelpful(string $id): JsonResponse
    {
        try {
            $review = $this->reviewService->markHelpful($id, $this->getUser());
            
            if (!$review) {
                return $this->notFoundResponse('Review not found');
            }

            return $this->successResponse([
                'helpful' => $review->getHelpful()
            ], 'Review marked as helpful');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to mark review as helpful: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/reviews/{id}/report', name: 'api_reviews_report', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function reportReview(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $reason = $data['reason'] ?? null;
            
            $this->reviewService->reportReview($id, $this->getUser(), $reason);
            
            return $this->successResponse(null, 'Review reported successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to report review: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/users/reviews', name: 'api_users_reviews', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getUserReviews(Request $request): JsonResponse
    {
        try {
            $filters = [
                'page' => (int) $request->query->get('page', 1),
                'limit' => min((int) $request->query->get('limit', 20), 100),
            ];

            $result = $this->reviewService->getUserReviews($this->getUser(), $filters);
            
            return $this->successResponse([
                'reviews' => array_map([$this, 'serializeReview'], $result['reviews']),
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch user reviews: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/reviews/pending', name: 'api_reviews_pending', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getPendingReviews(Request $request): JsonResponse
    {
        try {
            $filters = [
                'page' => (int) $request->query->get('page', 1),
                'limit' => min((int) $request->query->get('limit', 20), 100),
            ];

            $result = $this->reviewService->getPendingReviews($filters);
            
            return $this->successResponse([
                'reviews' => array_map([$this, 'serializeReview'], $result['reviews']),
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch pending reviews: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/reviews/{id}/moderate', name: 'api_reviews_moderate', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function moderateReview(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $approved = $data['approved'] ?? true;
            $reason = $data['reason'] ?? null;
            
            $review = $this->reviewService->moderateReview($id, $approved, $reason);
            
            if (!$review) {
                return $this->notFoundResponse('Review not found');
            }

            return $this->successResponse([
                'review' => $this->serializeReview($review)
            ], 'Review moderation updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to moderate review: ' . $e->getMessage(), 500);
        }
    }

    private function serializeReview($review): array
    {
        return [
            'id' => $review->getId(),
            'user' => [
                'id' => $review->getUser()?->getId(),
                'firstName' => $review->getUser()?->getFirstName(),
                'lastName' => $review->getUser()?->getLastName(),
                'avatar' => $review->getUser()?->getAvatar(),
            ],
            'product' => [
                'id' => $review->getProduct()?->getId(),
                'name' => $review->getProduct()?->getName(),
                'images' => $review->getProduct()?->getImages(),
            ],
            'rating' => $review->getRating(),
            'title' => $review->getTitle(),
            'comment' => $review->getComment(),
            'images' => $review->getImages(),
            'isVerified' => $review->isVerified(),
            'helpful' => $review->getHelpful(),
            'isModerated' => $review->isModerated(),
            'createdAt' => $review->getCreatedAt()?->format('c'),
        ];
    }
}
