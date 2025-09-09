<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\Notification;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UserService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private FileUploadService $fileUploadService
    ) {}

    public function updateProfile(User $user, array $data): User
    {
        if (isset($data['firstName'])) {
            $user->setFirstName($data['firstName']);
        }
        if (isset($data['lastName'])) {
            $user->setLastName($data['lastName']);
        }
        if (isset($data['phone'])) {
            $user->setPhone($data['phone']);
        }
        if (isset($data['preferences'])) {
            $user->setPreferences($data['preferences']);
        }

        $user->setUpdatedAt(new \DateTime());
        $this->entityManager->flush();

        return $user;
    }

    public function uploadAvatar(User $user, UploadedFile $file): string
    {
        $avatarUrl = $this->fileUploadService->uploadFile($file, 'avatars');
        $user->setAvatar($avatarUrl);
        $this->entityManager->flush();

        return $avatarUrl;
    }

    public function deleteAvatar(User $user): void
    {
        if ($user->getAvatar()) {
            $this->fileUploadService->deleteFile($user->getAvatar());
            $user->setAvatar(null);
            $this->entityManager->flush();
        }
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (!$this->passwordHasher->isPasswordValid($user, $currentPassword)) {
            throw new \InvalidArgumentException('Current password is incorrect');
        }

        if (strlen($newPassword) < 8) {
            throw new \InvalidArgumentException('New password must be at least 8 characters long');
        }

        $user->setPassword($this->passwordHasher->hashPassword($user, $newPassword));
        $this->entityManager->flush();
    }

    public function sendPhoneVerification(User $user, string $phone): void
    {
        // In a real implementation, you would send SMS
        $user->setPhone($phone);
        $this->entityManager->flush();
    }

    public function confirmPhoneVerification(User $user, string $code): void
    {
        // In a real implementation, you would verify the code
        $user->setPhoneVerified(true);
        $this->entityManager->flush();
    }

    public function updatePreferences(User $user, array $preferences): void
    {
        $user->setPreferences($preferences);
        $this->entityManager->flush();
    }

    public function updateNotificationSettings(User $user, array $settings): void
    {
        $preferences = $user->getPreferences();
        $preferences['notifications'] = $settings;
        $user->setPreferences($preferences);
        $this->entityManager->flush();
    }

    public function getNotifications(User $user, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;

        $notifications = $this->entityManager->getRepository(Notification::class)
            ->createQueryBuilder('n')
            ->where('n.user = :user')
            ->setParameter('user', $user)
            ->orderBy('n.createdAt', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        $total = $this->entityManager->getRepository(Notification::class)
            ->createQueryBuilder('n')
            ->select('COUNT(n.id)')
            ->where('n.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'notifications' => $notifications,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => ceil($total / $limit),
            ]
        ];
    }
}
