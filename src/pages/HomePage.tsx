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
      {/* Hero Section - CHECK24 Style */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-6xl mx-auto">
            {/* Main Headline */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Sơn chất lượng cao tại VNCompare
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                Giờ đây với dịch vụ giao hàng và thi công chuyên nghiệp
              </p>
            </div>

            {/* Savings Badge */}
            <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <TrendingUp className="w-4 h-4 mr-2" />
              Tiết kiệm đến <span className="font-bold text-lg mx-1">50%</span>
            </div>

            {/* Product Search Interface - CHECK24 Style */}
            <Card className="max-w-4xl mx-auto mb-8">
              <CardHeader>
                <CardTitle className="text-center">
                  Tìm sơn phù hợp với không gian của bạn
                </CardTitle>
                <CardDescription className="text-center">
                  Nhập kích thước phòng hoặc thông số sơn bạn cần
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Input */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="room-size">Diện tích phòng (m²)</Label>
                    <Input
                      id="room-size"
                      placeholder="Ví dụ: 25 m²"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="paint-type">Loại sơn</Label>
                    <Input
                      id="paint-type"
                      placeholder="Ví dụ: Sơn nội thất"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button size="lg" className="w-full md:w-auto">
                      <Search className="mr-2 h-4 w-4" />
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
              <p className="text-sm text-gray-600 mb-4">
                Đăng ký ngay để hưởng tất cả ưu đãi từ VNCompare!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Users className="mr-2 h-5 w-5" />
                    Đăng ký ngay
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
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

      {/* 3-Step Process - CHECK24 Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trong 3 bước để có sơn mới
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Tìm sơn phù hợp nhanh chóng
              </h3>
              <p className="text-gray-600">
                Nhập kích thước phòng của bạn để xem chỉ những kết quả phù hợp.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Thanh toán an toàn & Dịch vụ từ VNCompare
              </h3>
              <p className="text-gray-600">
                Thanh toán trước an toàn và giao hàng đúng hẹn được đảm bảo bởi các đối tác cao cấp của chúng tôi.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Đặt thi công với giá tốt nhất
              </h3>
              <p className="text-gray-600">
                Đặt thi công sơn vào thời điểm linh hoạt tại một xưởng gần bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Highlights - CHECK24 Style */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thương hiệu phổ biến
            </h2>
            <p className="text-lg text-gray-600">
              Thương hiệu cao cấp cho chất lượng và độ bền cao nhất
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
            {suppliers.slice(0, 6).map(supplier => (
              <Card
                key={supplier._id}
                className="text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Paintbrush className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-sm">{supplier.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Hersteller</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline">
              hiển thị tất cả thương hiệu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Reviews - CHECK24 Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Đánh giá khách hàng VNCompare Sơn
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">26.09.2025</span>
                </div>
                <p className="text-gray-700 mb-4">
                  Chất lượng tuyệt vời. Đặc tính lăn êm. Độ bám dính tốt
                </p>
                <p className="text-sm font-semibold">Ralf W.</p>
              </CardContent>
            </Card>

            {/* Review 2 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">26.09.2025</span>
                </div>
                <p className="text-gray-700 mb-4">
                  Sơn tuyệt vời, êm khi sử dụng, độ bám dính tốt!!
                </p>
                <p className="text-sm font-semibold">Silvia G.</p>
              </CardContent>
            </Card>

            {/* Review 3 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">26.09.2025</span>
                </div>
                <p className="text-gray-700 mb-4">
                  Cho đến nay mọi thứ đều tốt, đơn hàng diễn ra suôn sẻ
                </p>
                <p className="text-sm font-semibold">Tilo M.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lợi ích khi mua tại VNCompare
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lựa chọn lớn nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tìm sơn & bộ hoàn chỉnh từ hơn 10 triệu tùy chọn.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Giá cả hợp lý</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  So sánh sơn & bộ hoàn chỉnh và tiết kiệm.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Dịch vụ trọn gói</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
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
