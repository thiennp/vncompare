import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get cart items from localStorage (simplified for demo)
    // In production, you'd store cart in database
    const cartItems = JSON.parse(request.headers.get('cart-items') || '[]');

    return NextResponse.json({
      success: true,
      data: cartItems
    });

  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, message: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.basePrice,
      quantity: quantity,
      total: (product.basePrice || 0) * quantity
    };

    return NextResponse.json({
      success: true,
      data: cartItem
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
