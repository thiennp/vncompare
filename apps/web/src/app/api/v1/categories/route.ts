import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock categories data for now
    const categories = [
      {
        id: '1',
        name: 'Sơn nội thất',
        slug: 'noi-that',
        description: 'Sơn chất lượng cao cho nội thất nhà ở',
        productCount: 150,
        avgPrice: 450000,
        minPrice: 200000,
        maxPrice: 800000,
        avgSavings: 15,
        comparisonCount: 1250,
        topBrands: ['Dulux', 'Jotun', 'Kova', 'Nippon'],
        icon: 'home',
        color: 'blue'
      },
      {
        id: '2',
        name: 'Sơn ngoại thất',
        slug: 'ngoai-that',
        description: 'Sơn chống thời tiết cho ngoại thất',
        productCount: 120,
        avgPrice: 380000,
        minPrice: 180000,
        maxPrice: 650000,
        avgSavings: 12,
        comparisonCount: 980,
        topBrands: ['Dulux', 'Jotun', 'Kova', 'Maxilite'],
        icon: 'building',
        color: 'green'
      },
      {
        id: '3',
        name: 'Sơn chuyên dụng',
        slug: 'chuyen-dung',
        description: 'Sơn cho các mục đích đặc biệt',
        productCount: 80,
        avgPrice: 520000,
        minPrice: 250000,
        maxPrice: 1200000,
        avgSavings: 18,
        comparisonCount: 450,
        topBrands: ['Jotun', 'Kova', 'Nippon', 'Maxilite'],
        icon: 'shield',
        color: 'purple'
      },
      {
        id: '4',
        name: 'Sơn công nghiệp',
        slug: 'cong-nghiep',
        description: 'Sơn cho các công trình công nghiệp',
        productCount: 90,
        avgPrice: 680000,
        minPrice: 300000,
        maxPrice: 1500000,
        avgSavings: 20,
        comparisonCount: 320,
        topBrands: ['Jotun', 'Kova', 'Dulux', 'Nippon'],
        icon: 'building',
        color: 'orange'
      },
      {
        id: '5',
        name: 'Sơn trang trí',
        slug: 'trang-tri',
        description: 'Sơn trang trí và nghệ thuật',
        productCount: 60,
        avgPrice: 350000,
        minPrice: 150000,
        maxPrice: 600000,
        avgSavings: 10,
        comparisonCount: 280,
        topBrands: ['Dulux', 'Kova', 'Nippon', 'Maxilite'],
        icon: 'palette',
        color: 'pink'
      },
      {
        id: '6',
        name: 'Sơn thiên nhiên',
        slug: 'thien-nhien',
        description: 'Sơn thân thiện với môi trường',
        productCount: 40,
        avgPrice: 420000,
        minPrice: 200000,
        maxPrice: 750000,
        avgSavings: 8,
        comparisonCount: 180,
        topBrands: ['Kova', 'Nippon', 'Dulux', 'Jotun'],
        icon: 'leaf',
        color: 'emerald'
      }
    ]

    return NextResponse.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: {
        categories
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
