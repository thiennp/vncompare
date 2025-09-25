import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'createdAt'

    // Build where clause for filtering
    const where: any = {
      isActive: true
    }

    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive'
      }
    }

    if (brand) {
      where.brand = {
        contains: brand,
        mode: 'insensitive'
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (minPrice || maxPrice) {
      where.basePrice = {}
      if (minPrice) {
        where.basePrice.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        where.basePrice.lte = parseFloat(maxPrice)
      }
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price_asc') {
      orderBy = { basePrice: 'asc' }
    } else if (sort === 'price_desc') {
      orderBy = { basePrice: 'desc' }
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' }
    } else if (sort === 'name_desc') {
      orderBy = { name: 'desc' }
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where })

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy
    })

    // Transform to the expected format
    const paginatedProducts = products.map(product => ({
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
      totalReviews: 0, // Will be calculated from reviews table
      isFeatured: false, // Will be determined by business logic
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch products',
        details: []
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }, { status: 500 })
  }
}
