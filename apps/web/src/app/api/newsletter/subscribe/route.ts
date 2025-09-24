import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscription = await prisma.user.findUnique({
      where: { email }
    })

    if (existingSubscription) {
      return NextResponse.json(
        { success: false, message: 'Email already subscribed' },
        { status: 409 }
      )
    }

    // Create newsletter subscription (using User model for simplicity)
    const subscription = await prisma.user.create({
      data: {
        email,
        name: 'Newsletter Subscriber',
        role: 'newsletter'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: { id: subscription.id }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
