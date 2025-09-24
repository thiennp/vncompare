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

  /**
   * Handles search form submission
   * @param e - Form event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}&category=${selectedCategory}`
    }
  }

  const [categories, setCategories] = useState<Array<{
    id: string
    name: string
    productCount: number
    avgPrice: number
    avgSavings: number
    comparisonCount: number
    topBrands: string[]
    icon: string
    color: string
  }>>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch('/api/v1/categories')
        const data = await response.json()
        
        if (data.success && data.data) {
          setCategories(data.data)
        } else {
          console.error('Failed to fetch categories:', data.error)
          // Fallback to empty categories with 0 counts
          setCategories([
            { id: 'interior', name: 'Sơn nội thất', productCount: 0, avgPrice: 0, avgSavings: 0, comparisonCount: 0, topBrands: [], icon: 'home', color: 'blue' },
            { id: 'exterior', name: 'Sơn ngoại thất', productCount: 0, avgPrice: 0, avgSavings: 0, comparisonCount: 0, topBrands: [], icon: 'building', color: 'green' },
            { id: 'specialty', name: 'Sơn chuyên dụng', productCount: 0, avgPrice: 0, avgSavings: 0, comparisonCount: 0, topBrands: [], icon: 'shield', color: 'purple' },
            { id: 'industrial', name: 'Sơn công nghiệp', productCount: 0, avgPrice: 0, avgSavings: 0, comparisonCount: 0, topBrands: [], icon: 'building', color: 'orange' }
          ])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to empty categories with 0 counts
        setCategories([
          { id: 'interior', name: 'Sơn nội thất', productCount: 0, avgPrice: 0, avgSavings: 0, comparisonCount: 0, topBrands: [], icon: 'home', color: 'blue' },
          { id: 'exterior', name: 'Sơn ngoại thất', productCount: 0, avgPrice: 0, avgSavings: 0, comparisonCount: 0, topBrands: [], icon: 'building', color: 'green' },
          { id: 'specialty', name: 'Sơn chuyên dụng', productCount: 0, avgPrice: 0, avgSavings: 0, comparisonCount: 0, topBrands: [], icon: 'shield', color: 'purple' },
          { id: 'industrial', name: 'Sơn công nghiệp', productCount: 0, avgPrice: 0, avgSavings: 0, comparisonCount: 0, topBrands: [], icon: 'building', color: 'orange' }
        ])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])


  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Floating Paint Drops */}
      <div className="absolute top-20 left-10 w-6 h-6 bg-paint-red rounded-full animate-float opacity-60"></div>
      <div className="absolute top-40 right-20 w-4 h-4 bg-paint-blue rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-60 left-1/4 w-5 h-5 bg-paint-green rounded-full animate-float opacity-60" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-80 right-1/3 w-3 h-3 bg-paint-yellow rounded-full animate-float opacity-60" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute top-32 right-1/2 w-4 h-4 bg-paint-purple rounded-full animate-float opacity-60" style={{animationDelay: '1.5s'}}></div>
      
      {/* Paint Splash Effects */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-paint-splash"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-paint-splash" style={{animationDelay: '1s'}}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-8">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            So sánh giá{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-color-shift">
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
                <Search className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sơn, thương hiệu hoặc loại sơn..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-purple-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg bg-gradient-to-r from-white to-purple-50 transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                So sánh ngay
              </button>
            </div>
          </form>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Đang tải danh mục...</span>
              </div>
            ) : (
              categories.map((category, index) => {
                const colors = [
                  'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300 hover:from-blue-200 hover:to-blue-300',
                  'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300 hover:from-green-200 hover:to-green-300',
                  'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-300 hover:from-purple-200 hover:to-purple-300',
                  'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 border-pink-300 hover:from-pink-200 hover:to-pink-300',
                  'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300 hover:from-orange-200 hover:to-orange-300',
                  'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 border-teal-300 hover:from-teal-200 hover:to-teal-300'
                ];
                const selectedColors = [
                  'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg',
                  'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg',
                  'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg',
                  'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg',
                  'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg',
                  'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                ];
                const colorClass = selectedCategory === category.id ? selectedColors[index % selectedColors.length] : colors[index % colors.length];
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 ${colorClass} rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg`}
                  >
                    {category.name} ({category.productCount}+)
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Check24-style Comparison Cards */}
        <div className="bg-white rounded-xl shadow-xl border border-purple-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-4">
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
