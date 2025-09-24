import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get categories from database
    const categories = await prisma.product.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    })

    // Transform to the expected format
    const categoryData = categories
      .filter(cat => cat.category)
      .map((cat, index) => ({
        id: (index + 1).toString(),
        name: cat.category!,
        slug: cat.category!.toLowerCase().replace(/\s+/g, '-'),
        description: `Sản phẩm ${cat.category}`,
        productCount: 0, // Will be calculated separately if needed
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgSavings: 0,
        comparisonCount: 0,
        topBrands: [],
        icon: 'paint',
        color: 'blue'
      }))

    return NextResponse.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: {
        categories: categoryData
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch categories',
        details: []
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }, { status: 500 })
  }
}
