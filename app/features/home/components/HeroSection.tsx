/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router-dom';
import { Input } from '../../shared/components/ui/input';
import { Select } from '../../shared/components/ui/select';
import usePaintTypeDropdown from '../hooks/usePaintTypeDropdown';
import { Package, Users } from 'lucide-react';

export default function HeroSection() {
  const { selectedOption, containerRef, selectOption } = usePaintTypeDropdown();

  return (
    <section
      className="relative py-20 bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/assets/bg.jpg)',
        backgroundSize: '100% 100%',
      }}
      role="banner"
      aria-labelledby="hero-heading"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 pointer-events-none"
        aria-hidden="true"
      ></div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-6xl mx-auto">
          <div className="mb-12">
            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Sơn chất lượng cao
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Tìm sơn phù hợp với không gian của bạn
            </p>
          </div>

          <div className="rounded-2xl backdrop-blur-sm text-gray-900 hover:shadow-xl transition-all duration-300 max-w-4xl mx-auto mb-8 bg-cover bg-center bg-no-repeat bg-white/80 bg-blend-overlay shadow-lg pt-8">
            <div className="p-6 pt-0 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label
                      className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800 font-semibold text-base"
                      htmlFor="room-size"
                    >
                      Diện tích cần sơn (m²)
                    </label>
                    <Input
                      className="mt-1 text-pink-900"
                      id="room-size"
                      placeholder="Ví dụ: 25 m²"
                      aria-describedby="room-size-help"
                      type="number"
                    />
                    <p
                      id="room-size-help"
                      className="mt-1 text-xs text-gray-600 leading-relaxed"
                    >
                      Tổng diện tích bề mặt cần sơn <br />
                      (trừ cửa sổ, cửa ra vào nếu cần).
                    </p>
                  </div>

                  <div className="flex-1" ref={containerRef}>
                    <label
                      className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800 font-semibold text-base"
                      htmlFor="paint-type"
                    >
                      Loại sơn
                    </label>
                    <div className="relative">
                      <Select
                        id="paint-type"
                        className="mt-1 text-pink-900"
                        value={selectedOption}
                        onChange={e =>
                          selectOption(
                            e.target.value as
                              | 'interior'
                              | 'exterior'
                              | 'specialty'
                          )
                        }
                        aria-describedby="paint-type-help"
                      >
                        <option value="">Chọn loại sơn...</option>
                        <option value="interior">Sơn nội thất</option>
                        <option value="exterior">Sơn ngoại thất</option>
                        <option value="specialty">Sơn chuyên dụng</option>
                      </Select>
                      <p
                        id="paint-type-help"
                        className="mt-1 text-xs text-gray-600 leading-relaxed"
                      >
                        Chọn loại sơn phù hợp với không gian <br />
                        nội thất/ngoại thất hoặc nhu cầu đặc biệt.
                      </p>
                    </div>
                  </div>

                  <div className="flex pt-6">
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:shadow-xl hover:scale-105 h-12 px-8 text-base rounded-2xl w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 focus:ring-4 focus:ring-blue-200"
                      aria-label="Tìm kiếm sơn phù hợp"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-search mr-2 h-5 w-5"
                        aria-hidden="true"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                      Tìm sơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:shadow-xl hover:scale-105 h-12 px-8 text-base rounded-2xl w-full sm:w-auto bg-gradient-to-r from-paint-orange to-paint-pink hover:from-paint-orange/90 hover:to-paint-pink/90 text-white font-semibold shadow-lg transition-all duration-200"
            >
              <Package className="mr-2 h-5 w-5" />
              Xem sản phẩm
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-white shadow-sm hover:border-paint-orange hover:scale-105 h-12 px-8 text-base rounded-2xl w-full sm:w-auto border-2 border-paint-orange text-paint-orange font-semibold transition-all duration-200"
            >
              <Users className="mr-2 h-5 w-5" />
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
