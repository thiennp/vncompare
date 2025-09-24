'use client'

import { useState } from 'react'
import { Mail, ArrowRight } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubscribed(true)
        setEmail('')
      } else {
        const error = await response.json()
        console.error('Subscription failed:', error.message)
        alert('Đăng ký thất bại. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nhận thông tin mới nhất
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Đăng ký nhận thông báo về giá sơn, khuyến mãi và các ưu đãi đặc biệt
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    className="w-full pl-10 pr-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
                >
                  <span>Đăng ký</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg inline-block">
              Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông tin sớm nhất.
            </div>
          )}

          <p className="text-sm text-blue-200 mt-4">
            Chúng tôi cam kết không spam. Bạn có thể hủy đăng ký bất cứ lúc nào.
          </p>
        </div>
      </div>
    </section>
  )
}
