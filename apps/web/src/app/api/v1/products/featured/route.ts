import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const limit = parseInt(searchParams.get('limit') || '10')

    // Mock featured products data
    const featuredProducts = [
      {
        id: '1',
        name: 'Sơn Dulux Weathershield',
        description: 'Sơn ngoại thất chống thời tiết cao cấp',
        brand: 'Dulux',
        category: {
          id: '1',
          name: 'Sơn ngoại thất',
          slug: 'ngoai-that'
        },
        supplier: {
          id: '1',
          companyName: 'Công ty TNHH Dulux Việt Nam',
          rating: 4.8
        },
        sku: 'DULUX-WS-001',
        color: 'Trắng',
        finish: 'Mờ',
        coverage: 12,
        volume: 18,
        price: 450000,
        discountPrice: 400000,
        currentPrice: 400000,
        discountPercentage: 11,
        images: ['/images/dulux-weathershield.jpg'],
        rating: 4.8,
        totalReviews: 156,
        isFeatured: true,
        isActive: true,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Sơn Jotun Majestic',
        description: 'Sơn nội thất cao cấp với khả năng kháng khuẩn',
        brand: 'Jotun',
        category: {
          id: '2',
          name: 'Sơn nội thất',
          slug: 'noi-that'
        },
        supplier: {
          id: '2',
          companyName: 'Công ty Jotun Việt Nam',
          rating: 4.7
        },
        sku: 'JOTUN-MJ-002',
        color: 'Xanh dương',
        finish: 'Bóng',
        coverage: 15,
        volume: 20,
        price: 380000,
        discountPrice: 350000,
        currentPrice: 350000,
        discountPercentage: 8,
        images: ['/images/jotun-majestic.jpg'],
        rating: 4.7,
        totalReviews: 89,
        isFeatured: true,
        isActive: true,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      },
      {
        id: '3',
        name: 'Sơn Kova Anti-Bacterial',
        description: 'Sơn chuyên dụng kháng khuẩn cho bệnh viện',
        brand: 'Kova',
        category: {
          id: '3',
          name: 'Sơn chuyên dụng',
          slug: 'chuyen-dung'
        },
        supplier: {
          id: '3',
          companyName: 'Tập đoàn Kova',
          rating: 4.6
        },
        sku: 'KOVA-AB-003',
        color: 'Trắng',
        finish: 'Mờ',
        coverage: 10,
        volume: 15,
        price: 520000,
        discountPrice: 480000,
        currentPrice: 480000,
        discountPercentage: 8,
        images: ['/images/kova-antibacterial.jpg'],
        rating: 4.6,
        totalReviews: 45,
        isFeatured: true,
        isActive: true,
        createdAt: '2024-01-25T00:00:00Z',
        updatedAt: '2024-01-25T00:00:00Z'
      },
      {
        id: '4',
        name: 'Sơn Nippon Spotless',
        description: 'Sơn nội thất chống bám bẩn, dễ lau chùi',
        brand: 'Nippon',
        category: {
          id: '2',
          name: 'Sơn nội thất',
          slug: 'noi-that'
        },
        supplier: {
          id: '4',
          companyName: 'Công ty Nippon Paint Việt Nam',
          rating: 4.5
        },
        sku: 'NIPPON-SP-004',
        color: 'Xanh lá',
        finish: 'Mờ',
        coverage: 14,
        volume: 18,
        price: 420000,
        discountPrice: 390000,
        currentPrice: 390000,
        discountPercentage: 7,
        images: ['/images/nippon-spotless.jpg'],
        rating: 4.5,
        totalReviews: 67,
        isFeatured: true,
        isActive: true,
        createdAt: '2024-01-30T00:00:00Z',
        updatedAt: '2024-01-30T00:00:00Z'
      },
      {
        id: '5',
        name: 'Sơn Maxilite Industrial',
        description: 'Sơn công nghiệp chống ăn mòn cao cấp',
        brand: 'Maxilite',
        category: {
          id: '4',
          name: 'Sơn công nghiệp',
          slug: 'cong-nghiep'
        },
        supplier: {
          id: '5',
          companyName: 'Công ty Maxilite Việt Nam',
          rating: 4.4
        },
        sku: 'MAXILITE-IN-005',
        color: 'Xám',
        finish: 'Mờ',
        coverage: 8,
        volume: 20,
        price: 680000,
        discountPrice: 620000,
        currentPrice: 620000,
        discountPercentage: 9,
        images: ['/images/maxilite-industrial.jpg'],
        rating: 4.4,
        totalReviews: 23,
        isFeatured: true,
        isActive: true,
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z'
      }
    ]

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


