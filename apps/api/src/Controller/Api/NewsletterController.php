<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

#[Route('/api/v1/newsletter')]
#[OA\Tag(name: 'Newsletter')]
class NewsletterController extends BaseApiController
{
    #[Route('/subscribe', name: 'api_newsletter_subscribe', methods: ['POST'])]
    #[OA\Post(
        path: '/api/v1/newsletter/subscribe',
        summary: 'Subscribe to newsletter',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email')
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Subscribed')
        ]
    )]
    public function subscribe(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $email = $data['email'] ?? '';

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->validationErrorResponse(['A valid email is required']);
        }

        // Placeholder: In a real app, persist subscription or call ESP
        return $this->successResponse([
            'email' => $email,
            'subscribed' => true
        ], 'Subscribed to newsletter');
    }
}


