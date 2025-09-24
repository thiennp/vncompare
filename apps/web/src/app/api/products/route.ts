import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')

    // Mock products data - updated to match frontend expectations
    const allProducts = [
      {
        id: 1,
        name: 'Sơn Dulux Weathershield',
        description: 'Sơn ngoại thất chống thời tiết cao cấp',
        brand: 'Dulux',
        category: 'Sơn ngoại thất',
        basePrice: 400000,
        originalPrice: 450000,
        coverageRate: 12,
        unit: 'L',
        isActive: true,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: 2,
        name: 'Sơn Jotun Majestic',
        description: 'Sơn nội thất cao cấp với khả năng kháng khuẩn',
        brand: 'Jotun',
        category: 'Sơn nội thất',
        basePrice: 350000,
        originalPrice: 380000,
        coverageRate: 15,
        unit: 'L',
        isActive: true,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      },
      {
        id: 3,
        name: 'Sơn Kova Anti-Bacterial',
        description: 'Sơn chuyên dụng kháng khuẩn cho bệnh viện',
        brand: 'Kova',
        category: 'Sơn chuyên dụng',
        basePrice: 480000,
        originalPrice: 520000,
        coverageRate: 10,
        unit: 'L',
        isActive: true,
        createdAt: '2024-01-25T00:00:00Z',
        updatedAt: '2024-01-25T00:00:00Z'
      },
      {
        id: 4,
        name: 'Sơn Nippon Paint',
        description: 'Sơn nội thất chất lượng cao với độ bền lâu dài',
        brand: 'Nippon',
        category: 'Sơn nội thất',
        basePrice: 320000,
        originalPrice: 350000,
        coverageRate: 14,
        unit: 'L',
        isActive: true,
        createdAt: '2024-01-30T00:00:00Z',
        updatedAt: '2024-01-30T00:00:00Z'
      },
      {
        id: 5,
        name: 'Sơn Maxilite Premium',
        description: 'Sơn ngoại thất chống nắng và chống ẩm',
        brand: 'Maxilite',
        category: 'Sơn ngoại thất',
        basePrice: 280000,
        originalPrice: 320000,
        coverageRate: 13,
        unit: 'L',
        isActive: true,
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z'
      },
      {
        id: 6,
        name: 'Sơn Jotun Industrial',
        description: 'Sơn công nghiệp chống ăn mòn và chống cháy',
        brand: 'Jotun',
        category: 'Sơn công nghiệp',
        basePrice: 650000,
        originalPrice: 720000,
        coverageRate: 8,
        unit: 'L',
        isActive: true,
        createdAt: '2024-02-05T00:00:00Z',
        updatedAt: '2024-02-05T00:00:00Z'
      }
    ]

    // Filter products based on query parameters
    let filteredProducts = allProducts

    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase().includes(category.toLowerCase())
      )
    }

    if (brand) {
      filteredProducts = filteredProducts.filter(p => 
        p.brand.toLowerCase().includes(brand.toLowerCase())
      )
    }

    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      message: 'Products retrieved successfully',
      data: paginatedProducts, // Return products directly, not wrapped in an object
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