import { useLoaderData } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link } from 'react-router-dom';
import {
  Package,
  Star,
  Truck,
  Paintbrush,
  Search,
  ArrowRight,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Product, Supplier } from '../types';
import { isHomePageData } from '../types/isHomePageData.guardz';

export default function HomePage() {
  const rawData = useLoaderData();

  // Handle case where suppliers might be undefined
  const data = {
    featuredProducts: rawData?.featuredProducts || [],
    suppliers: rawData?.suppliers || [],
  };

  // Validate data with generated Guardz type guards
  if (
    !isHomePageData(data, {
      identifier: 'HomePageData',
      callbackOnError: console.error,
      errorMode: 'json',
    })
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Data Loading Error
          </h1>
          <p className="text-gray-600">
            Unable to load homepage data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const { featuredProducts, suppliers } = data;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Accessible & Colorful */}
      <section
        className="relative py-20 bg-gradient-to-br from-blue-100 to-indigo-200"
        role="banner"
        aria-labelledby="hero-heading"
      >
        {/* Accessible Background Pattern */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 pointer-events-none"
          aria-hidden="true"
        ></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-6xl mx-auto">
            {/* Main Headline */}
            <div className="mb-12">
              <h1
                id="hero-heading"
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              >
                Sơn chất lượng cao tại VNCompare
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Tìm sơn phù hợp với không gian của bạn và nhận dịch vụ thi công
                chuyên nghiệp
              </p>
            </div>

            {/* Accessible Colorful Savings Badge */}
            <div
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-semibold mb-8 shadow-lg"
              role="banner"
              aria-label="Tiết kiệm đến 50%"
            >
              <TrendingUp className="w-4 h-4 mr-2" aria-hidden="true" />
              Tiết kiệm đến <span className="font-bold text-lg mx-1">50%</span>
            </div>

            {/* Accessible Colorful Search Interface */}
            <Card
              className="max-w-4xl mx-auto mb-8 bg-white shadow-lg border-2 border-blue-200"
              role="search"
              aria-labelledby="search-title"
            >
              <CardHeader>
                <CardTitle
                  id="search-title"
                  className="text-center text-2xl font-bold text-gray-900"
                >
                  Tìm sơn phù hợp với không gian của bạn
                </CardTitle>
                <CardDescription className="text-center text-gray-700">
                  Nhập kích thước phòng hoặc thông số sơn bạn cần
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Input */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label
                      htmlFor="room-size"
                      className="text-gray-800 font-semibold text-base"
                    >
                      Diện tích phòng (m²)
                    </Label>
                    <Input
                      id="room-size"
                      placeholder="Ví dụ: 25 m²"
                      className="mt-1 border-2 border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-lg text-gray-900"
                      aria-describedby="room-size-help"
                    />
                    <p
                      id="room-size-help"
                      className="text-sm text-gray-600 mt-1"
                    >
                      Nhập diện tích phòng để tìm sơn phù hợp
                    </p>
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="paint-type"
                      className="text-gray-800 font-semibold text-base"
                    >
                      Loại sơn
                    </Label>
                    <Input
                      id="paint-type"
                      placeholder="Ví dụ: Sơn nội thất"
                      className="mt-1 border-2 border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 rounded-lg text-gray-900"
                      aria-describedby="paint-type-help"
                    />
                    <p
                      id="paint-type-help"
                      className="text-sm text-gray-600 mt-1"
                    >
                      Chọn loại sơn phù hợp với nhu cầu
                    </p>
                  </div>
                  <div className="flex items-end">
                    <Button
                      size="lg"
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 focus:ring-4 focus:ring-blue-200"
                      aria-label="Tìm kiếm sơn phù hợp"
                    >
                      <Search className="mr-2 h-5 w-5" aria-hidden="true" />
                      Tìm sơn
                    </Button>
                  </div>
                </div>

                {/* Advanced Search Options */}
                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Tùy chọn tìm kiếm nâng cao
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-6">
                Đăng ký ngay để hưởng tất cả ưu đãi từ VNCompare!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold shadow-lg transition-all duration-200 focus:ring-4 focus:ring-green-200"
                    aria-label="Đăng ký tài khoản mới"
                  >
                    <Users className="mr-2 h-5 w-5" aria-hidden="true" />
                    Đăng ký ngay
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-2 border-orange-400 text-orange-700 hover:bg-orange-50 font-semibold transition-all duration-200 focus:ring-4 focus:ring-orange-200"
                    aria-label="Xem tất cả sản phẩm sơn"
                  >
                    <Package className="mr-2 h-5 w-5" aria-hidden="true" />
                    Xem tất cả sản phẩm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Highlights - Accessible & Colorful */}
      <section
        className="py-16 bg-gradient-to-r from-blue-50 to-purple-50"
        role="region"
        aria-labelledby="brands-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              id="brands-heading"
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Thương hiệu phổ biến
            </h2>
            <p className="text-lg text-gray-700">
              Thương hiệu cao cấp cho chất lượng và độ bền cao nhất
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
            {suppliers.slice(0, 6).map((supplier, index) => (
              <Card
                key={supplier._id}
                className="text-center hover:shadow-lg transition-shadow cursor-pointer focus-within:ring-4 focus-within:ring-blue-200"
                role="button"
                tabIndex={0}
                aria-label={`Xem sản phẩm từ ${supplier.name}`}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md ${
                      index % 3 === 0
                        ? 'bg-gradient-to-br from-blue-400 to-blue-500'
                        : index % 3 === 1
                          ? 'bg-gradient-to-br from-purple-400 to-purple-500'
                          : 'bg-gradient-to-br from-pink-400 to-pink-500'
                    }`}
                  >
                    <Paintbrush className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {supplier.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">Hersteller</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="border-2 border-purple-400 text-purple-700 hover:bg-purple-50 focus:ring-4 focus:ring-purple-200"
              aria-label="Xem tất cả thương hiệu sơn"
            >
              hiển thị tất cả thương hiệu
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Reviews - Clean & Focused */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Đánh giá khách hàng VNCompare Sơn
            </h2>
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-700">
                4.8/5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Review 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">26.09.2025</span>
                </div>
                <p className="text-gray-700 mb-4 text-lg">
                  Chất lượng tuyệt vời. Đặc tính lăn êm. Độ bám dính tốt
                </p>
                <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Ralf W.
                </p>
              </CardContent>
            </Card>

            {/* Review 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">26.09.2025</span>
                </div>
                <p className="text-gray-700 mb-4 text-lg">
                  Sơn tuyệt vời, êm khi sử dụng, độ bám dính tốt!!
                </p>
                <p className="text-sm font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Silvia G.
                </p>
              </CardContent>
            </Card>

            {/* Review 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">26.09.2025</span>
                </div>
                <p className="text-gray-700 mb-4 text-lg">
                  Cho đến nay mọi thứ đều tốt, đơn hàng diễn ra suôn sẻ
                </p>
                <p className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Tilo M.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Clean & Focused */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lợi ích khi mua tại VNCompare
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Lựa chọn lớn nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Tìm sơn & bộ hoàn chỉnh từ hơn 10 triệu tùy chọn.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Giá cả hợp lý
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  So sánh sơn & bộ hoàn chỉnh và tiết kiệm.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Dịch vụ trọn gói
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Đặt dịch vụ thi công với giá cố định dễ dàng online.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-lg text-gray-600">
              Khám phá những sản phẩm sơn chất lượng cao được yêu thích nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: Product) => (
              <Card
                key={product._id?.toString()}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <Paintbrush className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                  {product.brand && (
                    <Badge variant="secondary" className="w-fit">
                      {product.brand}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {product.price && (
                      <p className="text-lg font-semibold text-primary">
                        {product.price.toLocaleString('vi-VN')} VNĐ
                      </p>
                    )}
                    {product.description && (
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    )}
                    <Link to={`/products/${product._id}`}>
                      <Button className="w-full" size="sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/products">
              <Button variant="outline" size="lg">
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted Suppliers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nhà cung cấp tin cậy
            </h2>
            <p className="text-lg text-gray-600">
              Đối tác với các nhà cung cấp uy tín trên toàn quốc
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier: Supplier) => (
              <Card key={supplier._id?.toString()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{supplier.name}</CardTitle>
                    {supplier.isVerified && (
                      <Badge variant="default" className="bg-green-500">
                        <Star className="h-3 w-3 mr-1" />
                        Đã xác minh
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {supplier.email && (
                      <p className="text-sm text-gray-600">{supplier.email}</p>
                    )}
                    {supplier.phone && (
                      <p className="text-sm text-gray-600">{supplier.phone}</p>
                    )}
                    {supplier.address && (
                      <p className="text-sm text-gray-600">
                        {supplier.address}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
