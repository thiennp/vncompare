'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingCart, GitCompare, TrendingUp, Star, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiService, Product } from '@/lib/api'

export default function FeaturedProducts() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('price')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to get featured products first, fallback to regular products
      const response = await apiService.getFeaturedProducts(10)
      
      if (response.success && response.data) {
        setProducts(response.data.products)
      } else {
        // Fallback to regular products if featured products fail
        const fallbackResponse = await apiService.getProducts({ limit: 10 })
        if (fallbackResponse.success && fallbackResponse.data) {
          setProducts(fallbackResponse.data.products)
        } else {
          console.error('Failed to load products:', response.error || fallbackResponse.error)
          setError('Không thể tải danh sách sản phẩm')
          setProducts([])
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err)
      setError('Không thể tải danh sách sản phẩm')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }


  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.currentPrice - b.currentPrice
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.totalReviews - a.totalReviews
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadProducts}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            So sánh giá sơn nổi bật
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            So sánh trực tiếp giá từ nhiều nhà cung cấp và chọn mức giá tốt nhất
          </p>
        </div>

        {/* Comparison Controls */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price">Giá thấp nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="reviews">Nhiều đánh giá nhất</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {selectedProducts.length} sản phẩm được chọn
              </span>
              {selectedProducts.length > 0 && (
                <button className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                  <GitCompare className="w-4 h-4 mr-1" />
                  So sánh ({selectedProducts.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Comparison Table */}
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá tốt nhất
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhà cung cấp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Theo dõi giá
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    So sánh
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    {/* Product Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                          <span className="text-sm">🎨</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.brand} • {product.coverage}m²/lít</div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {product.category.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Best Price */}
                    <td className="px-4 py-3">
                      <div className="text-base font-semibold text-gray-900">
                        {product.currentPrice.toLocaleString('vi-VN')} ₫
                      </div>
                      {product.price > product.currentPrice && (
                        <>
                          <div className="text-xs text-gray-400 line-through">
                            {product.price.toLocaleString('vi-VN')} ₫
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            -{product.discountPercentage || Math.round(((product.price - product.currentPrice) / product.price) * 100)}%
                          </div>
                        </>
                      )}
                    </td>

                    {/* Suppliers */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {product.supplier?.companyName || 'Nhà cung cấp không xác định'}
                          </div>
                          <div className="text-xs text-gray-500">{product.currentPrice.toLocaleString('vi-VN')} ₫</div>
                          <div className="text-xs text-green-600">Miễn phí vận chuyển</div>
                        </div>
                        <div className="text-xs text-blue-600 cursor-pointer">
                          +2 nhà cung cấp khác
                        </div>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-3 h-3",
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({product.totalReviews})</span>
                      </div>
                    </td>

                    {/* Price Tracking */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <div className="text-xs">
                          <div className="text-gray-900">Giảm {product.discountPercentage || 0}%</div>
                          <div className="text-gray-500">Trong 30 ngày</div>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors">
                          Mua ngay
                        </button>
                        <button className="border border-gray-200 text-gray-600 px-2 py-1 rounded-md text-xs hover:bg-gray-50 transition-colors">
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Hiển thị {sortedProducts.length} trong số 500+ sản phẩm
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả sản phẩm →
              </button>
            </div>
          </div>
        </div>

        {/* Price Tracking Summary */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-100">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Theo dõi giá tự động
            </h3>
            <p className="text-sm text-gray-500">
              Nhận thông báo khi giá sơn thay đổi và tiết kiệm tối đa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center mx-auto mb-3">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Theo dõi giá</h4>
              <p className="text-xs text-gray-500">Nhận thông báo khi giá giảm</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 rounded-md flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Lịch sử giá</h4>
              <p className="text-xs text-gray-500">Xem biến động giá theo thời gian</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-50 rounded-md flex items-center justify-center mx-auto mb-3">
                <GitCompare className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">So sánh thông minh</h4>
              <p className="text-xs text-gray-500">So sánh nhiều sản phẩm cùng lúc</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
