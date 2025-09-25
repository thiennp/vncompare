<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

#[Route('/api/v1/categories')]
#[OA\Tag(name: 'Categories')]
class CategoryController extends BaseApiController
{
    #[Route('', name: 'api_categories_list', methods: ['GET'])]
    #[OA\Get(path: '/api/v1/categories', summary: 'List product categories')]
    public function list(Request $request): JsonResponse
    {
        // Placeholder list until real repository wired
        $categories = [
            ['id' => 'interior', 'name' => 'Interior Paint', 'slug' => 'interior-paint'],
            ['id' => 'exterior', 'name' => 'Exterior Paint', 'slug' => 'exterior-paint'],
            ['id' => 'primer', 'name' => 'Primer', 'slug' => 'primer'],
            ['id' => 'wood', 'name' => 'Wood Coatings', 'slug' => 'wood-coatings'],
        ];

        return $this->successResponse([
            'categories' => $categories
        ]);
    }
}


