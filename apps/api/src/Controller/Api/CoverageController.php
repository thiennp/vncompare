<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Attributes as OA;

#[Route('/api/v1/coverage')]
#[OA\Tag(name: 'Coverage')]
class CoverageController extends BaseApiController
{
    #[Route('/calculate', name: 'api_coverage_calculate', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    #[OA\Post(
        path: '/api/v1/coverage/calculate',
        summary: 'Calculate paint coverage requirements',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'areaSquareMeters', type: 'number', format: 'float'),
                    new OA\Property(property: 'coverageRate', type: 'number', format: 'float', description: 'm² per liter'),
                    new OA\Property(property: 'coats', type: 'integer', default: 1)
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Coverage calculated')
        ]
    )]
    public function calculate(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $area = (float)($data['areaSquareMeters'] ?? 0);
        $rate = (float)($data['coverageRate'] ?? 0);
        $coats = (int)($data['coats'] ?? 1);

        if ($area <= 0 || $rate <= 0 || $coats <= 0) {
            return $this->validationErrorResponse(['areaSquareMeters, coverageRate and coats must be positive']);
        }

        $litersRequired = ($area / $rate) * $coats;
        $wasteFactor = 0.1; // 10% extra
        $litersWithWaste = $litersRequired * (1 + $wasteFactor);

        return $this->successResponse([
            'litersRequired' => round($litersRequired, 2),
            'litersRecommended' => round($litersWithWaste, 2),
            'coats' => $coats,
            'parameters' => [
                'areaSquareMeters' => $area,
                'coverageRate' => $rate,
                'wasteFactor' => $wasteFactor
            ]
        ], 'Coverage calculated');
    }
}


