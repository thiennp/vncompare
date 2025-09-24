import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get featured products from database
    const featuredProducts = await prisma.product.findMany({
      where: {
        isActive: true
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to the expected format
    const limitedProducts = featuredProducts.map(product => ({
      id: product.id.toString(),
      name: product.name,
      description: product.description || '',
      brand: product.brand || '',
      category: {
        id: '1',
        name: product.category || 'Uncategorized',
        slug: (product.category || 'uncategorized').toLowerCase().replace(/\s+/g, '-')
      },
      sku: `SKU-${product.id}`,
      color: 'White', // Default color
      finish: 'Matte', // Default finish
      coverage: product.coverageRate || 10,
      volume: 1, // Default volume
      price: product.basePrice || 0,
      currentPrice: product.originalPrice || product.basePrice || 0,
      images: [], // No images in current schema
      rating: 4.0, // Default rating
      totalReviews: 0,
      isFeatured: true,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: {
        products: limitedProducts
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch featured products',
        details: []
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }, { status: 500 })
  }
}


