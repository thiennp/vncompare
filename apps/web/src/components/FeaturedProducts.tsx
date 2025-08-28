'use client'

import { useState } from 'react'
import { Heart, ShoppingCart, GitCompare, TrendingUp, Star, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FeaturedProducts() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('price')

  const products = [
    {
      id: 1,
      name: 'Dulux Nội Thất',
      brand: 'Dulux',
      category: 'Nội thất',
      price: 850000,
      originalPrice: 950000,
      rating: 4.5,
      reviews: 124,
      coverage: '12m²/lít',
      suppliers: [
        { name: 'HomeCenter', price: 850000, shipping: 'Miễn phí' },
        { name: 'Tiki', price: 870000, shipping: '30.000 ₫' },
        { name: 'Lazada', price: 890000, shipping: 'Miễn phí' }
      ],
      features: ['Chống nấm mốc', 'Dễ lau chùi', 'Không độc hại'],
      colors: ['#FFFFFF', '#F5F5DC', '#F0F8FF', '#FFF8DC'],
      priceHistory: [950000, 920000, 880000, 850000],
      selected: false
    },
    {
      id: 2,
      name: 'Jotun Ngoại Thất',
      brand: 'Jotun',
      category: 'Ngoại thất',
      price: 1200000,
      originalPrice: 1400000,
      rating: 4.3,
      reviews: 89,
      coverage: '10m²/lít',
      suppliers: [
        { name: 'HomeCenter', price: 1200000, shipping: 'Miễn phí' },
        { name: 'Tiki', price: 1250000, shipping: 'Miễn phí' },
        { name: 'Lazada', price: 1280000, shipping: '50.000 ₫' }
      ],
      features: ['Chống thấm', 'Bền màu', 'Thân thiện môi trường'],
      colors: ['#F5F5F5', '#D3D3D3', '#A9A9A9', '#696969'],
      priceHistory: [1400000, 1350000, 1280000, 1200000],
      selected: false
    },
    {
      id: 3,
      name: 'Nippon Chống Thấm',
      brand: 'Nippon',
      category: 'Chuyên dụng',
      price: 650000,
      originalPrice: 750000,
      rating: 4.2,
      reviews: 156,
      coverage: '8m²/lít',
      suppliers: [
        { name: 'HomeCenter', price: 650000, shipping: 'Miễn phí' },
        { name: 'Tiki', price: 670000, shipping: '25.000 ₫' },
        { name: 'Lazada', price: 680000, shipping: 'Miễn phí' }
      ],
      features: ['Kháng khuẩn', 'Dễ sử dụng', 'Giá tốt'],
      colors: ['#FFFFFF', '#F0F0F0', '#E6E6FA', '#F8F8FF'],
      priceHistory: [750000, 720000, 680000, 650000],
      selected: false
    },
    {
      id: 4,
      name: 'TOA Công Nghiệp',
      brand: 'TOA',
      category: 'Công nghiệp',
      price: 950000,
      originalPrice: 1100000,
      rating: 4.4,
      reviews: 67,
      coverage: '15m²/lít',
      suppliers: [
        { name: 'HomeCenter', price: 950000, shipping: 'Miễn phí' },
        { name: 'Tiki', price: 980000, shipping: '40.000 ₫' },
        { name: 'Lazada', price: 990000, shipping: 'Miễn phí' }
      ],
      features: ['Chống ăn mòn', 'Bền bỉ', 'Phủ tốt'],
      colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#C0C0C0'],
      priceHistory: [1100000, 1050000, 1000000, 950000],
      selected: false
    }
  ]

  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            So sánh giá sơn nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            So sánh trực tiếp giá từ nhiều nhà cung cấp và chọn mức giá tốt nhất
          </p>
        </div>

        {/* Comparison Controls */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="price">Giá thấp nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="reviews">Nhiều đánh giá nhất</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {selectedProducts.length} sản phẩm được chọn
              </span>
              {selectedProducts.length > 0 && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                  <GitCompare className="w-4 h-4 mr-2" />
                  So sánh ({selectedProducts.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá tốt nhất
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhà cung cấp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Theo dõi giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    So sánh
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    {/* Product Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg">🎨</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand} • {product.coverage}</div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Best Price */}
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

                    {/* Suppliers */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {product.suppliers.slice(0, 2).map((supplier, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium text-gray-900">{supplier.name}</div>
                            <div className="text-gray-500">{supplier.price.toLocaleString('vi-VN')} ₫</div>
                            <div className="text-xs text-green-600">{supplier.shipping}</div>
                          </div>
                        ))}
                        {product.suppliers.length > 2 && (
                          <div className="text-xs text-blue-600 cursor-pointer">
                            +{product.suppliers.length - 2} nhà cung cấp khác
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                    </td>

                    {/* Price Tracking */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div className="text-sm">
                          <div className="text-gray-900">Giảm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</div>
                          <div className="text-gray-500">Trong 30 ngày</div>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Mua ngay
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                          Chi tiết
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
                Hiển thị {sortedProducts.length} trong số 500+ sản phẩm
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Xem tất cả sản phẩm →
              </button>
            </div>
          </div>
        </div>

        {/* Price Tracking Summary */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Theo dõi giá tự động
            </h3>
            <p className="text-gray-600">
              Nhận thông báo khi giá sơn thay đổi và tiết kiệm tối đa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Theo dõi giá</h4>
              <p className="text-sm text-gray-600">Nhận thông báo khi giá giảm</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Lịch sử giá</h4>
              <p className="text-sm text-gray-600">Xem biến động giá theo thời gian</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <GitCompare className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">So sánh thông minh</h4>
              <p className="text-sm text-gray-600">So sánh nhiều sản phẩm cùng lúc</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
