<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailService
{
    public function __construct(
        private MailerInterface $mailer
    ) {}

    public function sendVerificationEmail(User $user): void
    {
        $email = (new Email())
            ->from('noreply@vncompare.com')
            ->to($user->getEmail())
            ->subject('Verify your email address - VNCompare')
            ->html($this->getVerificationEmailTemplate($user));

        $this->mailer->send($email);
    }

    public function sendPasswordResetEmail(User $user): void
    {
        $email = (new Email())
            ->from('noreply@vncompare.com')
            ->to($user->getEmail())
            ->subject('Reset your password - VNCompare')
            ->html($this->getPasswordResetEmailTemplate($user));

        $this->mailer->send($email);
    }

    public function sendOrderConfirmationEmail(User $user, $order): void
    {
        $email = (new Email())
            ->from('noreply@vncompare.com')
            ->to($user->getEmail())
            ->subject('Order Confirmation - VNCompare')
            ->html($this->getOrderConfirmationEmailTemplate($user, $order));

        $this->mailer->send($email);
    }

    public function sendOrderStatusUpdateEmail(User $user, $order): void
    {
        $email = (new Email())
            ->from('noreply@vncompare.com')
            ->to($user->getEmail())
            ->subject('Order Status Update - VNCompare')
            ->html($this->getOrderStatusUpdateEmailTemplate($user, $order));

        $this->mailer->send($email);
    }

    private function getVerificationEmailTemplate(User $user): string
    {
        return "
            <h1>Welcome to VNCompare!</h1>
            <p>Hello {$user->getFirstName()},</p>
            <p>Thank you for registering with VNCompare. Please click the link below to verify your email address:</p>
            <p><a href='https://vncompare.com/verify-email?token=VERIFICATION_TOKEN'>Verify Email</a></p>
            <p>If you didn't create an account, please ignore this email.</p>
            <p>Best regards,<br>VNCompare Team</p>
        ";
    }

    private function getPasswordResetEmailTemplate(User $user): string
    {
        return "
            <h1>Password Reset Request</h1>
            <p>Hello {$user->getFirstName()},</p>
            <p>You requested to reset your password. Please click the link below to reset it:</p>
            <p><a href='https://vncompare.com/reset-password?token=RESET_TOKEN'>Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>VNCompare Team</p>
        ";
    }

    private function getOrderConfirmationEmailTemplate(User $user, $order): string
    {
        return "
            <h1>Order Confirmation</h1>
            <p>Hello {$user->getFirstName()},</p>
            <p>Thank you for your order! Your order #{$order->getOrderNumber()} has been confirmed.</p>
            <p>Order Total: " . number_format($order->getTotal()) . " VND</p>
            <p>We'll send you updates on your order status.</p>
            <p>Best regards,<br>VNCompare Team</p>
        ";
    }

    private function getOrderStatusUpdateEmailTemplate(User $user, $order): string
    {
        return "
            <h1>Order Status Update</h1>
            <p>Hello {$user->getFirstName()},</p>
            <p>Your order #{$order->getOrderNumber()} status has been updated to: {$order->getStatus()}</p>
            <p>You can track your order at: <a href='https://vncompare.com/orders/{$order->getId()}'>Track Order</a></p>
            <p>Best regards,<br>VNCompare Team</p>
        ";
    }
}
