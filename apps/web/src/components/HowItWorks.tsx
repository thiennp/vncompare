'use client'

import { Search, BarChart3, ShoppingCart, Smile } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Tìm kiếm sản phẩm',
    description: 'Tìm kiếm sơn theo loại, thương hiệu hoặc đặc tính kỹ thuật',
    color: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 border border-blue-300'
  },
  {
    icon: BarChart3,
    title: 'So sánh giá cả',
    description: 'So sánh giá từ nhiều nhà cung cấp để tìm mức giá tốt nhất',
    color: 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 border border-green-300'
  },
  {
    icon: ShoppingCart,
    title: 'Mua hàng dễ dàng',
    description: 'Mua sơn trực tiếp từ nhà cung cấp uy tín với giao hàng tận nơi',
    color: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 border border-purple-300'
  },
  {
    icon: Smile,
    title: 'Tiết kiệm chi phí',
    description: 'Tiết kiệm thời gian và tiền bạc với các ưu đãi hấp dẫn',
    color: 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 border border-orange-300'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cách thức hoạt động
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chỉ với 4 bước đơn giản, bạn có thể tìm thấy sản phẩm sơn phù hợp nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step Number */}
              <div className="relative mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${step.color}`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-pulse">
                  {index + 1}
                </div>
              </div>

              {/* Step Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-y-1/2 z-0" />
              )}
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-20 bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Sản phẩm sơn</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Nhà cung cấp</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">15%</div>
              <div className="text-gray-600">Tiết kiệm trung bình</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Bắt đầu ngay
          </button>
        </div>
      </div>
    </section>
  )
}
