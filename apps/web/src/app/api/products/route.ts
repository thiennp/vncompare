import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } }
      ]
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    // Transform products to match the expected format
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.originalPrice || product.basePrice || 0,
      currentPrice: product.basePrice || product.originalPrice || 0,
      discountPrice: product.basePrice && product.originalPrice && product.basePrice < product.originalPrice ? product.basePrice : null,
      discountPercentage: product.basePrice && product.originalPrice && product.basePrice < product.originalPrice 
        ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
        : null,
      coverage: product.coverageRate || 0,
      volume: product.unit?.replace(/[^\d.]/g, '') || '0',
      unit: product.unit || 'L',
      finish: 'Matte', // Default value
      color: '#FFFFFF', // Default value
      rating: 4.5, // Default value
      totalReviews: Math.floor(Math.random() * 100) + 10, // Random reviews
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch products'
        }
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
