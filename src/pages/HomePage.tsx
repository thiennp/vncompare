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
  Shield,
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
      {/* Hero Section - Paint Company Style */}
      <section className="relative overflow-hidden py-20">
        {/* Dynamic Paint Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-green-400 to-yellow-400 opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-orange-400 via-pink-400 to-purple-400 opacity-40"></div>
        
        {/* Floating Paint Drops */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-400 rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-60 left-1/4 w-12 h-12 bg-green-400 rounded-full opacity-80 animate-bounce delay-1000"></div>
        <div className="absolute top-80 right-1/3 w-14 h-14 bg-yellow-400 rounded-full opacity-70 animate-pulse delay-500"></div>
        <div className="absolute bottom-20 left-20 w-18 h-18 bg-purple-400 rounded-full opacity-60 animate-bounce delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-10 h-10 bg-pink-400 rounded-full opacity-80 animate-pulse delay-1500"></div>
        
        {/* Paint Brush Strokes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-4 bg-gradient-to-r from-red-300 to-transparent transform rotate-12 opacity-50"></div>
          <div className="absolute top-40 right-20 w-24 h-3 bg-gradient-to-r from-blue-300 to-transparent transform -rotate-12 opacity-60"></div>
          <div className="absolute top-80 left-1/3 w-28 h-3 bg-gradient-to-r from-green-300 to-transparent transform rotate-6 opacity-40"></div>
          <div className="absolute bottom-32 right-1/4 w-20 h-4 bg-gradient-to-r from-yellow-300 to-transparent transform -rotate-6 opacity-50"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-6xl mx-auto">
            {/* Main Headline */}
            <div className="mb-8 relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Sơn chất lượng cao
                </span>
                <br />
                <span className="text-white">tại VNCompare</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6 drop-shadow-md">
                🎨 Biến không gian của bạn thành tác phẩm nghệ thuật
              </p>
            </div>

            {/* Savings Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg animate-pulse">
              <TrendingUp className="w-5 h-5 mr-2" />
              Tiết kiệm đến <span className="font-black text-xl mx-1">50%</span>
            </div>

            {/* Product Search Interface - Paint Style */}
            <Card className="max-w-4xl mx-auto mb-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  🎨 Tìm sơn phù hợp với không gian của bạn
                </CardTitle>
                <CardDescription className="text-center text-gray-600 text-lg">
                  Nhập kích thước phòng hoặc thông số sơn bạn cần
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Input */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="room-size" className="text-gray-700 font-semibold">Diện tích phòng (m²)</Label>
                    <Input
                      id="room-size"
                      placeholder="Ví dụ: 25 m²"
                      className="mt-1 border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="paint-type" className="text-gray-700 font-semibold">Loại sơn</Label>
                    <Input
                      id="paint-type"
                      placeholder="Ví dụ: Sơn nội thất"
                      className="mt-1 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
                      <Search className="mr-2 h-5 w-5" />
                      Tìm sơn
                    </Button>
                  </div>
                </div>

                {/* Advanced Search Options */}
                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Tùy chọn tìm kiếm nâng cao
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-sm text-white/80 mb-4 drop-shadow-md">
                ✨ Đăng ký ngay để hưởng tất cả ưu đãi từ VNCompare!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
                    <Users className="mr-2 h-5 w-5" />
                    Đăng ký ngay
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Xem tất cả sản phẩm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process - Paint Style */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🎨 Trong 3 bước để có sơn mới
            </h2>
            <p className="text-lg text-gray-600">
              Quy trình đơn giản để biến không gian của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-red-400 to-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tìm sơn phù hợp nhanh chóng
              </h3>
              <p className="text-gray-600 text-lg">
                Nhập kích thước phòng của bạn để xem chỉ những kết quả phù hợp.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-red-400 to-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Thanh toán an toàn & Dịch vụ từ VNCompare
              </h3>
              <p className="text-gray-600 text-lg">
                Thanh toán trước an toàn và giao hàng đúng hẹn được đảm bảo bởi
                các đối tác cao cấp của chúng tôi.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Truck className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-red-400 to-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Đặt thi công với giá tốt nhất
              </h3>
              <p className="text-gray-600 text-lg">
                Đặt thi công sơn vào thời điểm linh hoạt tại một xưởng gần bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Highlights - Paint Style */}
      <section className="py-20 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              🎨 Thương hiệu phổ biến
            </h2>
            <p className="text-lg text-gray-600">
              Thương hiệu cao cấp cho chất lượng và độ bền cao nhất
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
            {suppliers.slice(0, 6).map(supplier => (
              <Card
                key={supplier._id}
                className="text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Paintbrush className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{supplier.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">Hersteller</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
              hiển thị tất cả thương hiệu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Reviews - Paint Style */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
              ⭐ Đánh giá khách hàng VNCompare Sơn
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="ml-2 text-2xl font-bold">4.8/5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Review 1 */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
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
                <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Ralf W.</p>
              </CardContent>
            </Card>

            {/* Review 2 */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
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
                <p className="text-sm font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Silvia G.</p>
              </CardContent>
            </Card>

            {/* Review 3 */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
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
                <p className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Tilo M.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Paint Style */}
      <section className="py-20 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              ✨ Lợi ích khi mua tại VNCompare
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Lựa chọn lớn nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  Tìm sơn & bộ hoàn chỉnh từ hơn 10 triệu tùy chọn.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Giá cả hợp lý</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  So sánh sơn & bộ hoàn chỉnh và tiết kiệm.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Dịch vụ trọn gói</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
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
