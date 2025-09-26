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
import { Link } from 'react-router-dom';
import { Package, Star, Truck, Calculator, Paintbrush } from 'lucide-react';
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              So sánh sơn và vật liệu xây dựng
              <span className="text-primary block">tại Việt Nam</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Tìm kiếm, so sánh giá và mua sơn chất lượng cao từ các nhà cung
              cấp uy tín. Tính toán độ phủ và phí vận chuyển chính xác.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  <Package className="mr-2 h-5 w-5" />
                  Xem sản phẩm
                </Button>
              </Link>
              <Link to="/coverage-calculator">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Máy tính độ phủ
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating paint elements */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-paint-red rounded-full animate-float opacity-40 pointer-events-none"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-paint-blue rounded-full animate-float opacity-40 pointer-events-none"></div>
        <div className="absolute top-60 left-1/4 w-4 h-4 bg-paint-green rounded-full animate-float opacity-40 pointer-events-none"></div>
        <div className="absolute top-80 right-1/3 w-2 h-2 bg-paint-yellow rounded-full animate-float opacity-40 pointer-events-none"></div>
        <div className="absolute top-32 right-1/2 w-3 h-3 bg-paint-purple rounded-full animate-float opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-paint-pink rounded-full animate-float opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-40 right-10 w-3 h-3 bg-paint-orange rounded-full animate-float opacity-40 pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn VNCompare?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp công cụ mạnh mẽ để giúp bạn đưa ra quyết định
              tốt nhất khi mua sơn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>So sánh sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  So sánh giá cả, chất lượng và đặc tính của hàng nghìn sản phẩm
                  sơn từ các thương hiệu uy tín
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Tính toán chính xác</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tính toán độ phủ sơn và phí vận chuyển chính xác dựa trên diện
                  tích và địa điểm của bạn
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Giao hàng nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Kết nối với các nhà cung cấp đáng tin cậy để giao hàng nhanh
                  chóng và an toàn
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
