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
  'noi-that': 'bg-blue-100 text-blue-600',
  'ngoai-that': 'bg-green-100 text-green-600',
  'chuyen-dung': 'bg-purple-100 text-purple-600',
  'cong-nghiep': 'bg-orange-100 text-orange-600',
  'trang-tri': 'bg-pink-100 text-pink-600',
  'thien-nhien': 'bg-emerald-100 text-emerald-600',
  'default': 'bg-gray-100 text-gray-600'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const IconComponent = getCategoryIcon(category.slug)
              const colorClass = getCategoryColor(category.slug)
              
              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Tiết kiệm {category.avgSavings || 0}%
                      </div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description || 'Danh mục sơn chất lượng cao'}
                  </p>

                  {/* Price Range */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-sm text-gray-500 mb-1">Khoảng giá:</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatPriceRange(category.minPrice, category.maxPrice)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {formatProductCount(category.productCount)}
                      </div>
                      <div className="text-xs text-gray-500">Sản phẩm</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {formatComparisonCount(category.comparisonCount)}
                      </div>
                      <div className="text-xs text-gray-500">So sánh</div>
                    </div>
                  </div>

                  {/* Top Brands */}
                  {category.topBrands && category.topBrands.length > 0 && (
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
                  )}

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
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {categories.reduce((total, cat) => total + (cat.productCount || 0), 0)}+
                </div>
                <div className="text-gray-600">Sản phẩm sơn</div>
                <div className="text-sm text-gray-500">Được so sánh</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {categories.reduce((total, cat) => total + (cat.comparisonCount || 0), 0)}+
                </div>
                <div className="text-gray-600">So sánh tháng này</div>
                <div className="text-sm text-gray-500">Từ người dùng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {categories.length > 0 
                    ? (categories.reduce((total, cat) => total + (cat.avgSavings || 0), 0) / categories.length).toFixed(1)
                    : 0}%
                </div>
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
        )}

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
            Xem tất cả danh mục so sánh
          </button>
        </div>
      </div>
    </section>
  )
}
