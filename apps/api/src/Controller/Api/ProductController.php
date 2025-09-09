<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Entity\Product;
use App\Service\ProductService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Attributes as OA;

#[Route('/api/v1/products')]
#[OA\Tag(name: 'Products')]
class ProductController extends BaseApiController
{
    public function __construct(
        private ProductService $productService
    ) {}

    #[Route('', name: 'api_products_list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/v1/products',
        summary: 'List products',
        description: 'Get a paginated list of products with filtering options',
        tags: ['Products'],
        parameters: [
            new OA\Parameter(
                name: 'page',
                in: 'query',
                description: 'Page number',
                required: false,
                schema: new OA\Schema(type: 'integer', default: 1)
            ),
            new OA\Parameter(
                name: 'limit',
                in: 'query',
                description: 'Number of items per page',
                required: false,
                schema: new OA\Schema(type: 'integer', default: 20, maximum: 100)
            ),
            new OA\Parameter(
                name: 'category',
                in: 'query',
                description: 'Filter by category slug',
                required: false,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'brand',
                in: 'query',
                description: 'Filter by brand',
                required: false,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'minPrice',
                in: 'query',
                description: 'Minimum price filter',
                required: false,
                schema: new OA\Schema(type: 'number', format: 'float')
            ),
            new OA\Parameter(
                name: 'maxPrice',
                in: 'query',
                description: 'Maximum price filter',
                required: false,
                schema: new OA\Schema(type: 'number', format: 'float')
            ),
            new OA\Parameter(
                name: 'search',
                in: 'query',
                description: 'Search term',
                required: false,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'sort',
                in: 'query',
                description: 'Sort order',
                required: false,
                schema: new OA\Schema(type: 'string', enum: ['newest', 'price_asc', 'price_desc', 'rating_desc'], default: 'newest')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Products retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Success'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(
                                    property: 'products',
                                    type: 'array',
                                    items: new OA\Items(
                                        type: 'object',
                                        properties: [
                                            new OA\Property(property: 'id', type: 'string', format: 'uuid'),
                                            new OA\Property(property: 'name', type: 'string', example: 'Premium Interior Paint'),
                                            new OA\Property(property: 'brand', type: 'string', example: 'Dulux'),
                                            new OA\Property(property: 'price', type: 'string', example: '450000'),
                                            new OA\Property(property: 'currentPrice', type: 'string', example: '400000'),
                                            new OA\Property(property: 'rating', type: 'number', format: 'float', example: 4.5),
                                            new OA\Property(property: 'totalReviews', type: 'integer', example: 25),
                                            new OA\Property(property: 'images', type: 'array', items: new OA\Items(type: 'string')),
                                            new OA\Property(property: 'isFeatured', type: 'boolean', example: true)
                                        ]
                                    )
                                ),
                                new OA\Property(
                                    property: 'pagination',
                                    type: 'object',
                                    properties: [
                                        new OA\Property(property: 'page', type: 'integer', example: 1),
                                        new OA\Property(property: 'limit', type: 'integer', example: 20),
                                        new OA\Property(property: 'total', type: 'integer', example: 150),
                                        new OA\Property(property: 'totalPages', type: 'integer', example: 8)
                                    ]
                                )
                            ]
                        )
                    ]
                )
            )
        ]
    )]
    public function list(Request $request): JsonResponse
    {
        try {
            $filters = [
                'page' => (int) $request->query->get('page', 1),
                'limit' => min((int) $request->query->get('limit', 20), 100),
                'category' => $request->query->get('category'),
                'brand' => $request->query->get('brand'),
                'minPrice' => $request->query->get('minPrice'),
                'maxPrice' => $request->query->get('maxPrice'),
                'color' => $request->query->get('color'),
                'finish' => $request->query->get('finish'),
                'search' => $request->query->get('search'),
                'sort' => $request->query->get('sort', 'newest'),
                'supplier' => $request->query->get('supplier'),
            ];

            $result = $this->productService->getProducts($filters);

            return $this->successResponse([
                'products' => array_map([$this, 'serializeProduct'], $result['products']),
                'pagination' => $result['pagination'],
                'filters' => $result['filters']
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch products: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}', name: 'api_products_show', methods: ['GET'])]
    public function show(string $id): JsonResponse
    {
        try {
            $product = $this->productService->getProduct($id);
            
            if (!$product) {
                return $this->notFoundResponse('Product not found');
            }

            return $this->successResponse([
                'product' => $this->serializeProductDetail($product)
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch product: ' . $e->getMessage(), 500);
        }
    }

    #[Route('', name: 'api_products_create', methods: ['POST'])]
    #[IsGranted('ROLE_SUPPLIER')]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $product = $this->productService->createProduct($data, $this->getUser());
            
            return $this->successResponse([
                'product' => $this->serializeProduct($product)
            ], 'Product created successfully', 201);
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create product: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}', name: 'api_products_update', methods: ['PUT'])]
    #[IsGranted('ROLE_SUPPLIER')]
    public function update(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $product = $this->productService->updateProduct($id, $data, $this->getUser());
            
            if (!$product) {
                return $this->notFoundResponse('Product not found');
            }

            return $this->successResponse([
                'product' => $this->serializeProduct($product)
            ], 'Product updated successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update product: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}', name: 'api_products_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(string $id): JsonResponse
    {
        try {
            $deleted = $this->productService->deleteProduct($id);
            
            if (!$deleted) {
                return $this->notFoundResponse('Product not found');
            }

            return $this->successResponse(null, 'Product deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete product: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}/status', name: 'api_products_toggle_status', methods: ['PATCH'])]
    #[IsGranted('ROLE_SUPPLIER')]
    public function toggleStatus(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $isActive = $data['isActive'] ?? null;
            
            if ($isActive === null) {
                return $this->errorResponse('isActive field is required');
            }

            $product = $this->productService->toggleProductStatus($id, $isActive, $this->getUser());
            
            if (!$product) {
                return $this->notFoundResponse('Product not found');
            }

            return $this->successResponse([
                'product' => $this->serializeProduct($product)
            ], 'Product status updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update product status: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/search', name: 'api_products_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->query->get('q', '');
            $filters = [
                'page' => (int) $request->query->get('page', 1),
                'limit' => min((int) $request->query->get('limit', 20), 100),
                'category' => $request->query->get('category'),
                'brand' => $request->query->get('brand'),
                'minPrice' => $request->query->get('minPrice'),
                'maxPrice' => $request->query->get('maxPrice'),
            ];

            $result = $this->productService->searchProducts($query, $filters);

            return $this->successResponse([
                'products' => array_map([$this, 'serializeProduct'], $result['products']),
                'pagination' => $result['pagination'],
                'suggestions' => $result['suggestions'] ?? []
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Search failed: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/featured', name: 'api_products_featured', methods: ['GET'])]
    public function featured(Request $request): JsonResponse
    {
        try {
            $limit = min((int) $request->query->get('limit', 10), 50);
            $products = $this->productService->getFeaturedProducts($limit);

            return $this->successResponse([
                'products' => array_map([$this, 'serializeProduct'], $products)
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch featured products: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}/similar', name: 'api_products_similar', methods: ['GET'])]
    public function similar(string $id, Request $request): JsonResponse
    {
        try {
            $limit = min((int) $request->query->get('limit', 5), 20);
            $products = $this->productService->getSimilarProducts($id, $limit);

            return $this->successResponse([
                'products' => array_map([$this, 'serializeProduct'], $products)
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch similar products: ' . $e->getMessage(), 500);
        }
    }

    private function serializeProduct(Product $product): array
    {
        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'brand' => $product->getBrand(),
            'category' => [
                'id' => $product->getCategory()?->getId(),
                'name' => $product->getCategory()?->getName(),
                'slug' => $product->getCategory()?->getSlug(),
            ],
            'supplier' => [
                'id' => $product->getSupplier()?->getId(),
                'companyName' => $product->getSupplier()?->getCompanyName(),
                'rating' => $product->getSupplier()?->getRating(),
            ],
            'sku' => $product->getSku(),
            'color' => $product->getColor(),
            'finish' => $product->getFinish(),
            'coverage' => $product->getCoverage(),
            'volume' => $product->getVolume(),
            'price' => $product->getPrice(),
            'discountPrice' => $product->getDiscountPrice(),
            'currentPrice' => $product->getCurrentPrice(),
            'discountPercentage' => $product->getDiscountPercentage(),
            'images' => $product->getImages(),
            'rating' => $product->getAverageRating(),
            'totalReviews' => $product->getTotalReviews(),
            'isFeatured' => $product->isFeatured(),
            'isActive' => $product->isActive(),
            'createdAt' => $product->getCreatedAt()?->format('c'),
        ];
    }

    private function serializeProductDetail(Product $product): array
    {
        $base = $this->serializeProduct($product);
        
        return array_merge($base, [
            'specifications' => $product->getSpecifications(),
            'tags' => $product->getTags(),
            'reviews' => [
                'average' => $product->getAverageRating(),
                'total' => $product->getTotalReviews(),
                'distribution' => $this->getReviewDistribution($product),
            ],
            'relatedProducts' => [], // This would be populated by the service
            'priceHistory' => [], // This would be populated by the service
        ]);
    }

    private function getReviewDistribution(Product $product): array
    {
        // This would be calculated from actual reviews
        return [
            '5' => 0,
            '4' => 0,
            '3' => 0,
            '2' => 0,
            '1' => 0,
        ];
    }
}
