<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

abstract class BaseApiController extends AbstractController
{
    protected function successResponse(
        mixed $data = null,
        string $message = 'Success',
        int $statusCode = Response::HTTP_OK,
        array $meta = []
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'meta' => array_merge([
                'timestamp' => (new \DateTime())->format('c'),
                'requestId' => uniqid('req_', true),
            ], $meta)
        ];

        return new JsonResponse($response, $statusCode);
    }

    protected function errorResponse(
        string $message = 'An error occurred',
        int $statusCode = Response::HTTP_BAD_REQUEST,
        array $errors = [],
        array $meta = []
    ): JsonResponse {
        $response = [
            'success' => false,
            'error' => [
                'code' => $this->getErrorCode($statusCode),
                'message' => $message,
                'details' => $errors
            ],
            'meta' => array_merge([
                'timestamp' => (new \DateTime())->format('c'),
                'requestId' => uniqid('req_', true),
            ], $meta)
        ];

        return new JsonResponse($response, $statusCode);
    }

    protected function validationErrorResponse(
        array $errors,
        string $message = 'Validation failed'
    ): JsonResponse {
        return $this->errorResponse(
            $message,
            Response::HTTP_UNPROCESSABLE_ENTITY,
            $errors
        );
    }

    protected function notFoundResponse(
        string $message = 'Resource not found'
    ): JsonResponse {
        return $this->errorResponse(
            $message,
            Response::HTTP_NOT_FOUND
        );
    }

    protected function unauthorizedResponse(
        string $message = 'Unauthorized'
    ): JsonResponse {
        return $this->errorResponse(
            $message,
            Response::HTTP_UNAUTHORIZED
        );
    }

    protected function forbiddenResponse(
        string $message = 'Forbidden'
    ): JsonResponse {
        return $this->errorResponse(
            $message,
            Response::HTTP_FORBIDDEN
        );
    }

    protected function paginatedResponse(
        array $items,
        int $page,
        int $limit,
        int $total,
        array $filters = []
    ): JsonResponse {
        $totalPages = ceil($total / $limit);

        return $this->successResponse([
            'items' => $items,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => $totalPages,
                'hasNext' => $page < $totalPages,
                'hasPrevious' => $page > 1,
            ],
            'filters' => $filters
        ]);
    }

    private function getErrorCode(int $statusCode): string
    {
        return match ($statusCode) {
            400 => 'BAD_REQUEST',
            401 => 'UNAUTHORIZED',
            403 => 'FORBIDDEN',
            404 => 'NOT_FOUND',
            422 => 'VALIDATION_ERROR',
            429 => 'RATE_LIMIT_EXCEEDED',
            500 => 'INTERNAL_SERVER_ERROR',
            default => 'UNKNOWN_ERROR'
        };
    }
}
