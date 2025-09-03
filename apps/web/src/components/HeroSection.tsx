'use client'

import { useState } from 'react'
import { Search, BarChart3, TrendingUp, Shield, GitCompare, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('interior')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  const categories = [
    { id: 'interior', name: 'Sơn nội thất', count: '200+' },
    { id: 'exterior', name: 'Sơn ngoại thất', count: '150+' },
    { id: 'specialty', name: 'Sơn chuyên dụng', count: '80+' },
    { id: 'industrial', name: 'Sơn công nghiệp', count: '120+' }
  ]

  const comparisonData = [
    {
      id: 1,
      name: 'Dulux Nội Thất',
      brand: 'Dulux',
      price: 850000,
      originalPrice: 950000,
      rating: 4.5,
      reviews: 124,
      coverage: '12m²/lít',
      features: ['Chống nấm mốc', 'Dễ lau chùi', 'Không độc hại'],
      selected: false
    },
    {
      id: 2,
      name: 'Jotun Nội Thất',
      brand: 'Jotun',
      price: 920000,
      originalPrice: 1100000,
      rating: 4.3,
      reviews: 89,
      coverage: '10m²/lít',
      features: ['Chống thấm', 'Bền màu', 'Thân thiện môi trường'],
      selected: false
    },
    {
      id: 3,
      name: 'Nippon Nội Thất',
      brand: 'Nippon',
      price: 780000,
      originalPrice: 880000,
      rating: 4.2,
      reviews: 156,
      coverage: '11m²/lít',
      features: ['Kháng khuẩn', 'Dễ sử dụng', 'Giá tốt'],
      selected: false
    }
  ]

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-8">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            So sánh giá{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              sơn
            </span>{' '}
            hàng đầu Việt Nam
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            So sánh trực tiếp giá sơn từ 50+ nhà cung cấp. Tìm mức giá tốt nhất và tiết kiệm tới 30% chi phí.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sơn, thương hiệu hoặc loại sơn..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                So sánh ngay
              </button>
            </div>
          </form>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                )}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table Preview */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                 <GitCompare className="w-5 h-5 mr-2 text-blue-600" />
                So sánh giá sơn nội thất
              </h3>
              <div className="flex items-center space-x-2">
                <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                  <Filter className="w-4 h-4 mr-1" />
                  Lọc
                </button>
                <span className="text-sm text-gray-500">3 sản phẩm</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá tốt nhất
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tính năng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    So sánh
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisonData.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg">🎨</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand} • {product.coverage}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-gray-900">
                        {product.price.toLocaleString('vi-VN')} ₫
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {product.originalPrice.toLocaleString('vi-VN')} ₫
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              )}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.features.map((feature, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Mua ngay
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                          So sánh
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị 3 trong số 200+ sản phẩm
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Xem tất cả kết quả →
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600">Sản phẩm sơn</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">50+</div>
            <div className="text-gray-600">Nhà cung cấp</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">30%</div>
            <div className="text-gray-600">Tiết kiệm trung bình</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">10K+</div>
            <div className="text-gray-600">So sánh mỗi tháng</div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      {/* Removed decorative circles to fix overlapping issues */}
    </section>
  )
}
