/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router-dom';
import {
  Package,
  Star,
  Truck,
  Paintbrush,
  TrendingUp,
  Users,
  ArrowRight,
} from 'lucide-react';
import { homeLoader } from '../loaders/homeLoader';
import { HomePageData } from '../../shared/types';

export default function HomePage({ loaderData }: { loaderData: HomePageData }) {
  return (
    <>
      {/* Category Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container py-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 text-gray-600 hover:text-paint-orange hover:bg-paint-orange/5"
              to="/products?category=interior"
            >
              <Package className="h-4 w-4" />
              <span>Sơn nội thất</span>
            </Link>

            <Link
              className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 text-gray-600 hover:text-paint-orange hover:bg-paint-orange/5"
              to="/products?category=exterior"
            >
              <Package className="h-4 w-4" />
              <span>Sơn ngoại thất</span>
            </Link>

            <Link
              className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 text-gray-600 hover:text-paint-orange hover:bg-paint-orange/5"
              to="/products?category=specialty"
            >
              <Package className="h-4 w-4" />
              <span>Sơn chuyên dụng</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="min-h-screen">
          <section
            className="relative py-24 bg-gradient-to-br from-blue-100 to-indigo-200"
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

                <div
                  className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-semibold mb-8 shadow-lg"
                  role="banner"
                  aria-label="Tiết kiệm đến 50%"
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
                    className="lucide lucide-trending-up w-4 h-4 mr-2"
                    aria-hidden="true"
                  >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                  Tiết kiệm đến{' '}
                  <span className="font-bold text-lg mx-1">50%</span>
                </div>

                <div className="rounded-2xl backdrop-blur-sm text-gray-900 hover:shadow-xl transition-all duration-300 max-w-4xl mx-auto mb-8 bg-white shadow-lg border-2 border-blue-200">
                  <div className="flex flex-col space-y-2 p-6">
                    <h3
                      className="tracking-tight text-center text-2xl font-bold text-gray-900"
                      id="search-title"
                    >
                      Tìm sơn phù hợp
                    </h3>
                  </div>

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
                          <input
                            className="flex h-11 w-full bg-white px-4 py-3 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-paint-orange/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 focus-visible:border-paint-orange hover:border-paint-orange/60 disabled:cursor-not-allowed disabled:opacity-50 mt-1 border-2 border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-lg text-gray-900"
                            id="room-size"
                            placeholder="Ví dụ: 25 m²"
                            aria-describedby="room-size-help"
                          />
                        </div>

                        <div className="flex-1">
                          <label
                            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800 font-semibold text-base"
                            htmlFor="paint-type"
                          >
                            Loại sơn
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              className="flex h-11 w-full items-center justify-between bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-paint-orange/60 focus:outline-none focus:ring-offset-2 hover:border-paint-orange/60 disabled:cursor-not-allowed disabled:opacity-50 mt-1 border-2 border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 rounded-lg text-gray-900"
                              id="paint-type"
                              aria-describedby="paint-type-help"
                            >
                              <span className="block truncate">
                                Chọn loại sơn...
                              </span>
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
                                className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                              >
                                <path d="m6 9 6 6 6-6"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-1">
                          <label
                            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800 font-semibold text-base"
                            htmlFor="address"
                          >
                            Địa chỉ
                          </label>
                          <input
                            className="flex h-11 w-full bg-white px-4 py-3 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-paint-orange/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 focus-visible:border-paint-orange hover:border-paint-orange/60 disabled:cursor-not-allowed disabled:opacity-50 mt-1 border-2 border-green-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 rounded-lg text-gray-900"
                            id="address"
                            placeholder="Ví dụ: Quận 1, TP.HCM"
                            aria-describedby="address-help"
                          />
                        </div>
                        <div className="flex items-center pt-6">
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
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-white shadow-sm hover:border-paint-orange hover:scale-105 h-12 px-8 text-base rounded-2xl w-full sm:w-auto border-2 border-paint-orange text-paint-orange hover:bg-paint-orange/5 font-semibold transition-all duration-200"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Đăng ký
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Brands Section */}
          <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Thương hiệu phổ biến
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
                {loaderData.suppliers.slice(0, 6).map((supplier, index) => (
                  <div
                    key={supplier._id}
                    className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg duration-300 text-center hover:shadow-lg transition-shadow cursor-pointer focus-within:ring-4 focus-within:ring-blue-200"
                  >
                    <div className="p-6">
                      <div
                        className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md bg-gradient-to-br ${
                          index % 4 === 0
                            ? 'from-blue-400 to-blue-500'
                            : index % 4 === 1
                              ? 'from-purple-400 to-purple-500'
                              : index % 4 === 2
                                ? 'from-green-400 to-green-500'
                                : 'from-orange-400 to-orange-500'
                        }`}
                      >
                        <Paintbrush className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900">
                        {supplier.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">Nhà cung cấp</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-white shadow-sm hover:border-paint-orange hover:scale-105 rounded-xl h-10 px-6 py-2 border-2 border-purple-400 text-purple-700 hover:bg-purple-50 focus:ring-4 focus:ring-purple-200">
                  hiển thị tất cả thương hiệu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Tại sao chọn VNCompare?
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg duration-300 text-center hover:shadow-lg transition-shadow">
                  <div className="flex flex-col space-y-2 p-6">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="tracking-tight text-lg font-semibold text-gray-900">
                      Lựa chọn lớn nhất
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-sm leading-relaxed text-gray-600">
                      Tìm sơn & bộ hoàn chỉnh từ hơn 10 triệu tùy chọn.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg duration-300 text-center hover:shadow-lg transition-shadow">
                  <div className="flex flex-col space-y-2 p-6">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="tracking-tight text-lg font-semibold text-gray-900">
                      Giá cả hợp lý
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-sm leading-relaxed text-gray-600">
                      So sánh sơn & bộ hoàn chỉnh và tiết kiệm.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg duration-300 text-center hover:shadow-lg transition-shadow">
                  <div className="flex flex-col space-y-2 p-6">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="tracking-tight text-lg font-semibold text-gray-900">
                      Dịch vụ trọn gói
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-sm leading-relaxed text-gray-600">
                      Đặt dịch vụ thi công với giá cố định dễ dàng online.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Products Section */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Sản phẩm nổi bật
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loaderData.featuredProducts.map(product => (
                  <div
                    key={product._id}
                    className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg duration-300 group hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col space-y-2 p-6">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <Paintbrush className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="font-semibold tracking-tight text-gray-900 text-lg group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:ring-offset-2 border-transparent bg-gradient-to-r from-paint-teal to-paint-cyan text-white shadow-sm hover:shadow-md w-fit">
                        {product.brand}
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-primary">
                          {product.price.toLocaleString('vi-VN')} VNĐ
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 pb-1">
                          {product.description}
                        </p>
                        <Link
                          to={`/products/${product._id}`}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-to-r from-paint-orange to-paint-pink text-white shadow-lg hover:shadow-xl hover:scale-105 h-8 px-4 text-xs rounded-lg w-full"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link to="/products" className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-paint-orange/30 bg-white text-paint-orange shadow-sm hover:bg-paint-orange/5 hover:border-paint-orange hover:scale-105 h-12 px-8 text-base rounded-2xl">
                  Xem tất cả sản phẩm
                </Link>
              </div>
            </div>
          </section>

          {/* Featured Suppliers Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nhà cung cấp tin cậy
                </h2>
                <p className="text-lg text-gray-600">
                  Đối tác với các nhà cung cấp uy tín trên toàn quốc
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loaderData.suppliers.map(supplier => (
                  <div
                    key={supplier._id}
                    className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col space-y-2 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold leading-tight tracking-tight text-gray-900">
                          {supplier.name}
                        </h3>
                        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:ring-offset-2 border-transparent bg-gradient-to-r from-paint-orange to-paint-pink text-white shadow-sm hover:shadow-md bg-green-500">
                          <Star className="h-3 w-3 mr-1" />
                          Đã xác minh
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          {supplier.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {supplier.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          {supplier.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          {loaderData.reviews.length > 0 && (
            <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Đánh giá từ khách hàng
                  </h2>
                  <p className="text-lg text-gray-600">
                    Những phản hồi tích cực từ khách hàng của chúng tôi
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loaderData.reviews.map(review => (
                    <div
                      key={review._id}
                      className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          "{review.comment}"
                        </p>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-paint-orange to-paint-pink rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            U
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900">
                              {review.title}
                            </p>
                            <p className="text-xs text-gray-500">Khách hàng</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

export const loader = homeLoader;
