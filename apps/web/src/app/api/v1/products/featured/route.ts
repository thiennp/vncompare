import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const limit = parseInt(searchParams.get('limit') || '10')

    // TODO: Connect to real database instead of mock data
    const featuredProducts: any[] = []

    // Return limited number of featured products
    const limitedProducts = featuredProducts.slice(0, limit)

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


