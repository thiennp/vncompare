<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Entity\User;
use App\Service\AuthService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/v1/auth')]
#[OA\Tag(name: 'Authentication')]
class AuthController extends BaseApiController
{
    public function __construct(
        private AuthService $authService,
        private ValidatorInterface $validator
    ) {}

    #[Route('/register', name: 'api_auth_register', methods: ['POST'])]
    #[OA\Post(
        path: '/api/v1/auth/register',
        summary: 'Register a new user',
        description: 'Creates a new user account with email and password',
        tags: ['Authentication'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password', 'firstName', 'lastName'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'user@example.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password123'),
                    new OA\Property(property: 'firstName', type: 'string', example: 'John'),
                    new OA\Property(property: 'lastName', type: 'string', example: 'Doe'),
                    new OA\Property(property: 'phone', type: 'string', example: '+84901234567'),
                    new OA\Property(property: 'role', type: 'string', example: 'ROLE_USER')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'User registered successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'User registered successfully'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(
                                    property: 'user',
                                    type: 'object',
                                    properties: [
                                        new OA\Property(property: 'id', type: 'string', format: 'uuid'),
                                        new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                                        new OA\Property(property: 'firstName', type: 'string', example: 'John'),
                                        new OA\Property(property: 'lastName', type: 'string', example: 'Doe'),
                                        new OA\Property(property: 'role', type: 'string', example: 'ROLE_USER'),
                                        new OA\Property(property: 'isActive', type: 'boolean', example: true),
                                        new OA\Property(property: 'emailVerified', type: 'boolean', example: false)
                                    ]
                                ),
                                new OA\Property(property: 'token', type: 'string', example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...')
                            ]
                        )
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: 'Validation failed',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')
            )
        ]
    )]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->errorResponse('Invalid JSON data');
        }

        try {
            $user = $this->authService->register($data);
            
            return $this->successResponse([
                'user' => $this->serializeUser($user),
                'token' => $this->authService->generateToken($user)
            ], 'User registered successfully', 201);
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/login', name: 'api_auth_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email']) || !isset($data['password'])) {
            return $this->errorResponse('Email and password are required');
        }

        try {
            $user = $this->authService->login($data['email'], $data['password']);
            
            if (!$user) {
                return $this->unauthorizedResponse('Invalid credentials');
            }

            return $this->successResponse([
                'user' => $this->serializeUser($user),
                'token' => $this->authService->generateToken($user),
                'expiresAt' => (new \DateTime('+1 hour'))->format('c')
            ], 'Login successful');
        } catch (\Exception $e) {
            return $this->errorResponse('Login failed: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/refresh', name: 'api_auth_refresh', methods: ['POST'])]
    public function refresh(Request $request): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user) {
            return $this->unauthorizedResponse();
        }

        try {
            return $this->successResponse([
                'token' => $this->authService->generateToken($user),
                'expiresAt' => (new \DateTime('+1 hour'))->format('c')
            ], 'Token refreshed successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Token refresh failed: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/logout', name: 'api_auth_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // In a real implementation, you might want to blacklist the token
        return $this->successResponse(null, 'Logout successful');
    }

    #[Route('/forgot-password', name: 'api_auth_forgot_password', methods: ['POST'])]
    public function forgotPassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email'])) {
            return $this->errorResponse('Email is required');
        }

        try {
            $this->authService->sendPasswordResetEmail($data['email']);
            
            return $this->successResponse(null, 'Password reset email sent');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to send password reset email: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/reset-password', name: 'api_auth_reset_password', methods: ['POST'])]
    public function resetPassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['token']) || !isset($data['password'])) {
            return $this->errorResponse('Token and password are required');
        }

        try {
            $this->authService->resetPassword($data['token'], $data['password']);
            
            return $this->successResponse(null, 'Password reset successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        } catch (\Exception $e) {
            return $this->errorResponse('Password reset failed: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/verify-email', name: 'api_auth_verify_email', methods: ['POST'])]
    public function verifyEmail(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['token'])) {
            return $this->errorResponse('Verification token is required');
        }

        try {
            $this->authService->verifyEmail($data['token']);
            
            return $this->successResponse(null, 'Email verified successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        } catch (\Exception $e) {
            return $this->errorResponse('Email verification failed: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/resend-verification', name: 'api_auth_resend_verification', methods: ['POST'])]
    public function resendVerification(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email'])) {
            return $this->errorResponse('Email is required');
        }

        try {
            $this->authService->resendVerificationEmail($data['email']);
            
            return $this->successResponse(null, 'Verification email sent');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to send verification email: ' . $e->getMessage(), 500);
        }
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phone' => $user->getPhone(),
            'avatar' => $user->getAvatar(),
            'role' => $user->getRoles()[0] ?? 'ROLE_USER',
            'isActive' => $user->isActive(),
            'emailVerified' => $user->isEmailVerified(),
            'phoneVerified' => $user->isPhoneVerified(),
            'createdAt' => $user->getCreatedAt()?->format('c'),
            'lastLoginAt' => $user->getLastLoginAt()?->format('c'),
        ];
    }
}
