<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Entity\User;
use App\Service\UserService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/v1/users')]
class UserController extends BaseApiController
{
    public function __construct(
        private UserService $userService
    ) {}

    #[Route('/profile', name: 'api_users_profile', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function profile(): JsonResponse
    {
        $user = $this->getUser();
        
        return $this->successResponse([
            'user' => $this->serializeUser($user)
        ]);
    }

    #[Route('/profile', name: 'api_users_update_profile', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $user = $this->userService->updateProfile($this->getUser(), $data);
            
            return $this->successResponse([
                'user' => $this->serializeUser($user)
            ], 'Profile updated successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update profile: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/avatar', name: 'api_users_upload_avatar', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function uploadAvatar(Request $request): JsonResponse
    {
        try {
            $file = $request->files->get('avatar');
            
            if (!$file) {
                return $this->errorResponse('Avatar file is required');
            }

            $avatarUrl = $this->userService->uploadAvatar($this->getUser(), $file);
            
            return $this->successResponse([
                'avatar' => $avatarUrl
            ], 'Avatar uploaded successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to upload avatar: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/avatar', name: 'api_users_delete_avatar', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function deleteAvatar(): JsonResponse
    {
        try {
            $this->userService->deleteAvatar($this->getUser());
            
            return $this->successResponse(null, 'Avatar deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete avatar: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/password', name: 'api_users_change_password', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data || !isset($data['currentPassword']) || !isset($data['newPassword'])) {
                return $this->errorResponse('Current password and new password are required');
            }

            $this->userService->changePassword(
                $this->getUser(),
                $data['currentPassword'],
                $data['newPassword']
            );
            
            return $this->successResponse(null, 'Password changed successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to change password: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/verify-phone', name: 'api_users_verify_phone', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function verifyPhone(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data || !isset($data['phone'])) {
                return $this->errorResponse('Phone number is required');
            }

            $this->userService->sendPhoneVerification($this->getUser(), $data['phone']);
            
            return $this->successResponse(null, 'Verification SMS sent');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to send verification SMS: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/confirm-phone', name: 'api_users_confirm_phone', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function confirmPhone(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data || !isset($data['code'])) {
                return $this->errorResponse('Verification code is required');
            }

            $this->userService->confirmPhoneVerification($this->getUser(), $data['code']);
            
            return $this->successResponse(null, 'Phone number verified successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to verify phone: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/preferences', name: 'api_users_preferences', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getPreferences(): JsonResponse
    {
        $user = $this->getUser();
        
        return $this->successResponse([
            'preferences' => $user->getPreferences()
        ]);
    }

    #[Route('/preferences', name: 'api_users_update_preferences', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function updatePreferences(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $this->userService->updatePreferences($this->getUser(), $data);
            
            return $this->successResponse(null, 'Preferences updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update preferences: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/notifications', name: 'api_users_notifications', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getNotifications(Request $request): JsonResponse
    {
        try {
            $page = (int) $request->query->get('page', 1);
            $limit = min((int) $request->query->get('limit', 20), 100);
            
            $result = $this->userService->getNotifications($this->getUser(), $page, $limit);
            
            return $this->successResponse([
                'notifications' => array_map([$this, 'serializeNotification'], $result['notifications']),
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch notifications: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/notifications/settings', name: 'api_users_notification_settings', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getNotificationSettings(): JsonResponse
    {
        $user = $this->getUser();
        
        return $this->successResponse([
            'settings' => $user->getPreferences()['notifications'] ?? []
        ]);
    }

    #[Route('/notifications/settings', name: 'api_users_update_notification_settings', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function updateNotificationSettings(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $this->userService->updateNotificationSettings($this->getUser(), $data);
            
            return $this->successResponse(null, 'Notification settings updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update notification settings: ' . $e->getMessage(), 500);
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
            'preferences' => $user->getPreferences(),
            'createdAt' => $user->getCreatedAt()?->format('c'),
            'lastLoginAt' => $user->getLastLoginAt()?->format('c'),
        ];
    }

    private function serializeNotification($notification): array
    {
        return [
            'id' => $notification->getId(),
            'type' => $notification->getType(),
            'title' => $notification->getTitle(),
            'message' => $notification->getMessage(),
            'actionUrl' => $notification->getActionUrl(),
            'isRead' => $notification->isRead(),
            'data' => $notification->getData(),
            'createdAt' => $notification->getCreatedAt()?->format('c'),
        ];
    }
}
