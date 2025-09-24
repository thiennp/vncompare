import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Email sending function (placeholder - implement with your preferred email service)
async function sendPasswordResetEmail(email: string, resetUrl: string) {
  // In a real application, you would use a service like:
  // - SendGrid
  // - AWS SES
  // - Nodemailer with SMTP
  // - Resend
  // - Mailgun
  
  console.log(`Sending password reset email to ${email}`);
  console.log(`Reset URL: ${resetUrl}`);
  
  // For now, just log the email content
  const emailContent = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset for your account.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  
  console.log('Email content:', emailContent);
  
  // In production, replace this with actual email sending
  return Promise.resolve();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // In a real application, you would send an email here
    // For demo purposes, we'll just return the token
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    // Send email with resetUrl
    try {
      await sendPasswordResetEmail(email, resetUrl);
      console.log('Password reset email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Continue anyway - don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.',
      // In development, include the reset URL for testing
      ...(process.env.NODE_ENV === 'development' && { resetUrl })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
