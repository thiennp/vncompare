<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private JWTTokenManagerInterface $jwtManager,
        private ValidatorInterface $validator,
        private EmailService $emailService
    ) {}

    public function register(array $data): User
    {
        $this->validateRegistrationData($data);

        if ($this->userRepository->findOneBy(['email' => $data['email']])) {
            throw new \InvalidArgumentException('Email is already registered');
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setPhone($data['phone'] ?? null);
        $user->setRoles([$data['role'] ?? 'ROLE_USER']);

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException('Validation failed: ' . (string) $errors);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Send verification email
        $this->emailService->sendVerificationEmail($user);

        return $user;
    }

    public function login(string $email, string $password): ?User
    {
        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            return null;
        }

        if (!$user->isActive()) {
            throw new \InvalidArgumentException('Account is deactivated');
        }

        $user->setLastLoginAt(new \DateTime());
        $this->entityManager->flush();

        return $user;
    }

    public function generateToken(User $user): string
    {
        return $this->jwtManager->create($user);
    }

    public function sendPasswordResetEmail(string $email): void
    {
        $user = $this->userRepository->findOneBy(['email' => $email]);
        
        if (!$user) {
            // Don't reveal if email exists or not
            return;
        }

        $this->emailService->sendPasswordResetEmail($user);
    }

    public function resetPassword(string $token, string $newPassword): void
    {
        // In a real implementation, you would validate the token
        // and find the associated user
        throw new \InvalidArgumentException('Password reset not implemented yet');
    }

    public function verifyEmail(string $token): void
    {
        // In a real implementation, you would validate the token
        // and mark the user's email as verified
        throw new \InvalidArgumentException('Email verification not implemented yet');
    }

    public function resendVerificationEmail(string $email): void
    {
        $user = $this->userRepository->findOneBy(['email' => $email]);
        
        if (!$user) {
            throw new \InvalidArgumentException('Email not found');
        }

        if ($user->isEmailVerified()) {
            throw new \InvalidArgumentException('Email is already verified');
        }

        $this->emailService->sendVerificationEmail($user);
    }

    private function validateRegistrationData(array $data): void
    {
        $required = ['email', 'password', 'firstName', 'lastName'];
        
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                throw new \InvalidArgumentException("Field '{$field}' is required");
            }
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Invalid email format');
        }

        if (strlen($data['password']) < 8) {
            throw new \InvalidArgumentException('Password must be at least 8 characters long');
        }

        if (isset($data['phone']) && !preg_match('/^(\+84|84|0)[1-9][0-9]{8,9}$/', $data['phone'])) {
            throw new \InvalidArgumentException('Invalid Vietnamese phone number format');
        }
    }
}
