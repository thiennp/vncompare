'use client'

import { useState, useEffect } from 'react'
import { Search, BarChart3, TrendingUp, Shield, GitCompare, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiService, Product } from '@/lib/api'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('interior')
  const [comparisonData, setComparisonData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await apiService.getProducts({ limit: 3, page: 1 })
        if (response.success && response.data) {
          setComparisonData(response.data.products || [])
        } else {
          console.error('Failed to fetch products:', response.error)
          setComparisonData([])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setComparisonData([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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


  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-8">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            So sánh giá{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
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

        {/* Check24-style Comparison Cards */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <GitCompare className="w-6 h-6 mr-3" />
                So sánh giá sơn nội thất
              </h3>
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-white hover:text-blue-200 transition-colors">
                  <Filter className="w-5 h-5 mr-2" />
                  <span className="font-medium">Lọc</span>
                </button>
                <div className="bg-white/20 rounded-full px-3 py-1">
                  <span className="text-sm font-medium text-white">3 sản phẩm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 font-medium">Đang tải sản phẩm...</span>
              </div>
            ) : comparisonData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg font-medium">Không có sản phẩm nào</div>
                <div className="text-sm">Vui lòng thử lại sau</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparisonData.map((product, index) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Product Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-xl">🎨</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {product.currentPrice.toLocaleString('vi-VN')} ₫
                        </div>
                        {product.discountPrice && product.discountPrice < product.price && (
                          <div className="text-xs text-green-600 font-medium">
                            -{product.discountPercentage || Math.round(((product.price - product.currentPrice) / product.price) * 100)}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Độ phủ:</span>
                        <span className="font-medium">{product.coverage}m²/lít</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Thể tích:</span>
                        <span className="font-medium">{product.volume}L</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Đánh giá:</span>
                        <div className="flex items-center">
                          <div className="flex items-center mr-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={cn(
                                  "w-3 h-3",
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
                          <span className="text-xs text-gray-500">({product.totalReviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.finish}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.color}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Mua ngay
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        Thêm vào so sánh
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Hiển thị 3 trong số 200+ sản phẩm
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Xem tất cả kết quả →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats - Check24 Style */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600 font-medium">Sản phẩm sơn</div>
          </div>
          <div className="text-center bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600 font-medium">Nhà cung cấp</div>
          </div>
          <div className="text-center bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
            <div className="text-gray-600 font-medium">Tiết kiệm trung bình</div>
          </div>
          <div className="text-center bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600 font-medium">So sánh mỗi tháng</div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      {/* Removed decorative circles to fix overlapping issues */}
    </section>
  )
}
