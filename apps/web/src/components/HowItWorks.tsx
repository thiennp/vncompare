'use client'

import { Search, BarChart3, ShoppingCart, Smile } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Tìm kiếm sản phẩm',
    description: 'Tìm kiếm sơn theo loại, thương hiệu hoặc đặc tính kỹ thuật',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: BarChart3,
    title: 'So sánh giá cả',
    description: 'So sánh giá từ nhiều nhà cung cấp để tìm mức giá tốt nhất',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: ShoppingCart,
    title: 'Mua hàng dễ dàng',
    description: 'Mua sơn trực tiếp từ nhà cung cấp uy tín với giao hàng tận nơi',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Smile,
    title: 'Tiết kiệm chi phí',
    description: 'Tiết kiệm thời gian và tiền bạc với các ưu đãi hấp dẫn',
    color: 'bg-orange-100 text-orange-600'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
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
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg">
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
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
            Bắt đầu ngay
          </button>
        </div>
      </div>
    </section>
  )
}
