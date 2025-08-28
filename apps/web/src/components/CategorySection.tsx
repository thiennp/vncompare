'use client'

import { Paintbrush, Home, Building, Palette, Shield, Leaf, TrendingUp, Users } from 'lucide-react'

const categories = [
  {
    icon: Home,
    title: 'Sơn nội thất',
    description: 'Sơn tường, trần nhà, cửa gỗ',
    color: 'bg-blue-100 text-blue-600',
    count: '200+ sản phẩm',
    priceRange: '450.000 - 2.500.000 ₫',
    avgSavings: '18%',
    topBrands: ['Dulux', 'Jotun', 'Nippon'],
    comparisonCount: '1.2K+ so sánh tháng này'
  },
  {
    icon: Building,
    title: 'Sơn ngoại thất',
    description: 'Sơn tường ngoài, chống thấm',
    color: 'bg-green-100 text-green-600',
    count: '150+ sản phẩm',
    priceRange: '650.000 - 3.200.000 ₫',
    avgSavings: '22%',
    topBrands: ['Jotun', 'TOA', 'Dulux'],
    comparisonCount: '890+ so sánh tháng này'
  },
  {
    icon: Shield,
    title: 'Sơn chuyên dụng',
    description: 'Chống cháy, chống nấm mốc',
    color: 'bg-purple-100 text-purple-600',
    count: '80+ sản phẩm',
    priceRange: '800.000 - 4.500.000 ₫',
    avgSavings: '25%',
    topBrands: ['Nippon', 'Jotun', 'TOA'],
    comparisonCount: '456+ so sánh tháng này'
  },
  {
    icon: Building,
    title: 'Sơn công nghiệp',
    description: 'Sơn kim loại, bê tông',
    color: 'bg-orange-100 text-orange-600',
    count: '120+ sản phẩm',
    priceRange: '950.000 - 5.800.000 ₫',
    avgSavings: '20%',
    topBrands: ['TOA', 'Jotun', 'Nippon'],
    comparisonCount: '678+ so sánh tháng này'
  },
  {
    icon: Palette,
    title: 'Sơn trang trí',
    description: 'Sơn kết cấu, hiệu ứng',
    color: 'bg-pink-100 text-pink-600',
    count: '90+ sản phẩm',
    priceRange: '1.200.000 - 8.500.000 ₫',
    avgSavings: '15%',
    topBrands: ['Dulux', 'Jotun', 'TOA'],
    comparisonCount: '234+ so sánh tháng này'
  },
  {
    icon: Leaf,
    title: 'Sơn thân thiện môi trường',
    description: 'Sơn không độc hại, organic',
    color: 'bg-emerald-100 text-emerald-600',
    count: '60+ sản phẩm',
    priceRange: '1.500.000 - 12.000.000 ₫',
    avgSavings: '12%',
    topBrands: ['Dulux', 'Jotun', 'Nippon'],
    comparisonCount: '189+ so sánh tháng này'
  }
]

export default function CategorySection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            So sánh giá theo danh mục
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chọn danh mục sơn để xem so sánh giá chi tiết từ các nhà cung cấp hàng đầu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Tiết kiệm {category.avgSavings}
                  </div>
                </div>
              </div>

              {/* Title and Description */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {category.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {category.description}
              </p>

              {/* Price Range */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-sm text-gray-500 mb-1">Khoảng giá:</div>
                <div className="text-lg font-semibold text-gray-900">{category.priceRange}</div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{category.count}</div>
                  <div className="text-xs text-gray-500">Sản phẩm</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{category.comparisonCount}</div>
                  <div className="text-xs text-gray-500">So sánh</div>
                </div>
              </div>

              {/* Top Brands */}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">Thương hiệu nổi bật:</div>
                <div className="flex flex-wrap gap-1">
                  {category.topBrands.map((brand, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Users className="w-4 h-4 mr-1" />
                  So sánh ngay
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Summary */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Tổng quan so sánh giá sơn
            </h3>
            <p className="text-gray-600">
              Dữ liệu được cập nhật hàng ngày từ 50+ nhà cung cấp uy tín
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">700+</div>
              <div className="text-gray-600">Sản phẩm sơn</div>
              <div className="text-sm text-gray-500">Được so sánh</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">3.4K+</div>
              <div className="text-gray-600">So sánh tháng này</div>
              <div className="text-sm text-gray-500">Từ người dùng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">18.5%</div>
              <div className="text-gray-600">Tiết kiệm trung bình</div>
              <div className="text-sm text-gray-500">So với giá gốc</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Cập nhật giá</div>
              <div className="text-sm text-gray-500">Tự động</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
            Xem tất cả danh mục so sánh
          </button>
        </div>
      </div>
    </section>
  )
}
