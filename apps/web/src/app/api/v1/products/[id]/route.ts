import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid product ID',
          details: ['Product ID must be a valid number']
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}`
        }
      }, { status: 400 })
    }

    // Get product from database
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        isActive: true
      }
    })

    if (!product) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found',
          details: [`Product with ID ${productId} does not exist or is not active`]
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}`
        }
      }, { status: 404 })
    }

    // Get product reviews count
    const reviewCount = await prisma.review.count({
      where: {
        productId: productId
      }
    })

    // Transform to the expected format
    const productData = {
      id: product.id.toString(),
      name: product.name,
      description: product.description || '',
      brand: product.brand || '',
      category: {
        id: product.category ? '1' : '0',
        name: product.category || 'Uncategorized',
        slug: product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : 'uncategorized'
      },
      sku: `SKU-${product.id}`,
      color: 'White', // Default color
      finish: 'Matte', // Default finish
      coverage: product.coverageRate || 10,
      volume: 1, // Default volume
      price: product.basePrice || 0,
      currentPrice: product.originalPrice || product.basePrice || 0,
      discountPrice: product.basePrice || 0,
      discountPercentage: product.originalPrice && product.basePrice 
        ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
        : 0,
      images: [], // No images in current schema
      rating: 4, // Default rating
      totalReviews: reviewCount,
      isFeatured: false, // Will be determined by business logic
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Product retrieved successfully',
      data: {
        product: productData
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch product',
        details: []
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }, { status: 500 })
  }
}
