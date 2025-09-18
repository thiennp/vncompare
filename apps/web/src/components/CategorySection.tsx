'use client'

import { useState, useEffect } from 'react'
import { Paintbrush, Home, Building, Palette, Shield, Leaf, TrendingUp, Users } from 'lucide-react'
import { apiService, Category } from '@/lib/api'

// Icon mapping for categories
const iconMap: { [key: string]: any } = {
  'noi-that': Home,
  'ngoai-that': Building,
  'chuyen-dung': Shield,
  'cong-nghiep': Building,
  'trang-tri': Palette,
  'thien-nhien': Leaf,
  'default': Paintbrush
}

// Color mapping for categories
const colorMap: { [key: string]: string } = {
  'noi-that': 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 border border-blue-300',
  'ngoai-that': 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 border border-green-300',
  'chuyen-dung': 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 border border-purple-300',
  'cong-nghiep': 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 border border-orange-300',
  'trang-tri': 'bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700 border border-pink-300',
  'thien-nhien': 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-300',
  'default': 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-300'
}

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getCategories()
      
      if (response.success && response.data) {
        setCategories(response.data.categories)
      } else {
        console.error('Failed to load categories:', response.error)
        setError('Không thể tải danh mục sản phẩm')
        setCategories([])
      }
    } catch (err) {
      console.error('Error loading categories:', err)
      setError('Không thể tải danh mục sản phẩm')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (slug: string) => {
    return iconMap[slug] || iconMap['default']
  }

  const getCategoryColor = (slug: string) => {
    return colorMap[slug] || colorMap['default']
  }

  const formatPriceRange = (minPrice?: number, maxPrice?: number) => {
    if (!minPrice || !maxPrice) return 'Liên hệ'
    return `${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} ₫`
  }

  const formatProductCount = (count?: number) => {
    if (!count) return '0 sản phẩm'
    return `${count}+ sản phẩm`
  }

  const formatComparisonCount = (count?: number) => {
    if (!count) return '0 so sánh tháng này'
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K+ so sánh tháng này`
    return `${count}+ so sánh tháng này`
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            So sánh giá theo danh mục
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Chọn danh mục sơn để xem so sánh giá chi tiết từ các nhà cung cấp hàng đầu
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải danh mục...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={loadCategories}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent = getCategoryIcon(category.slug)
              const colorClass = getCategoryColor(category.slug)
              
              return (
                <div
                  key={category.id}
                  className="bg-gradient-to-br from-white via-blue-50 to-purple-50 border border-purple-200 rounded-xl p-6 hover:border-purple-400 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:scale-105"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${colorClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Tiết kiệm {category.avgSavings || 0}%
                      </div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {category.description || 'Danh mục sơn chất lượng cao'}
                  </p>

                  {/* Price Range */}
                  <div className="bg-gray-50 rounded-md p-3 mb-4">
                    <div className="text-xs text-gray-400 mb-1">Khoảng giá:</div>
                    <div className="text-base font-medium text-gray-900">
                      {formatPriceRange(category.minPrice, category.maxPrice)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-base font-semibold text-blue-600">
                        {formatProductCount(category.productCount)}
                      </div>
                      <div className="text-xs text-gray-400">Sản phẩm</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-semibold text-purple-600">
                        {formatComparisonCount(category.comparisonCount)}
                      </div>
                      <div className="text-xs text-gray-400">So sánh</div>
                    </div>
                  </div>

                  {/* Top Brands */}
                  {category.topBrands && category.topBrands.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">Thương hiệu nổi bật:</div>
                      <div className="flex flex-wrap gap-1">
                        {category.topBrands.map((brand, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-3 rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center">
                      <Users className="w-4 h-4 mr-1" />
                      So sánh ngay
                    </button>
                    <button className="px-3 py-2 border border-purple-200 rounded-full text-sm hover:bg-purple-50 transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-white to-purple-50">
                      Chi tiết
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Chưa có danh mục nào</div>
          </div>
        )}

        {/* Comparison Summary */}
        {!loading && (
          <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tổng quan so sánh giá sơn
              </h3>
              <p className="text-sm text-gray-500">
                Dữ liệu được cập nhật hàng ngày từ 50+ nhà cung cấp uy tín
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {categories.reduce((total, cat) => total + (cat.productCount || 0), 0)}+
                </div>
                <div className="text-sm text-gray-600">Sản phẩm sơn</div>
                <div className="text-xs text-gray-400">Được so sánh</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {categories.reduce((total, cat) => total + (cat.comparisonCount || 0), 0)}+
                </div>
                <div className="text-sm text-gray-600">So sánh tháng này</div>
                <div className="text-xs text-gray-400">Từ người dùng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {categories.length > 0 
                    ? (categories.reduce((total, cat) => total + (cat.avgSavings || 0), 0) / categories.length).toFixed(1)
                    : 0}%
                </div>
                <div className="text-sm text-gray-600">Tiết kiệm trung bình</div>
                <div className="text-xs text-gray-400">So với giá gốc</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Cập nhật giá</div>
                <div className="text-xs text-gray-400">Tự động</div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Xem tất cả danh mục so sánh
          </button>
        </div>
      </div>
    </section>
  )
}
