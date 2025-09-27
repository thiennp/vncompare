import { useLoaderData } from 'react-router-dom';
import { Product, Review } from '../../shared/services/models';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../shared/components/ui/card';
import { Badge } from '../../shared/components/ui/badge';
import { Button } from '../../shared/components/ui/button';
import { Paintbrush, Star, Package } from 'lucide-react';

interface ProductDetailPageData {
  product: Product;
  reviews: Review[];
  totalReviews: number;
}

export default function ProductDetailPage() {
  const { product, reviews, totalReviews } =
    useLoaderData() as ProductDetailPageData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <Paintbrush className="h-24 w-24 text-gray-400" />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            {product.brand && (
              <Badge variant="secondary" className="mb-4">
                {product.brand}
              </Badge>
            )}
            {product.description && (
              <p className="text-lg text-gray-600">{product.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {product.basePrice && (
              <div className="text-3xl font-bold text-primary">
                {product.basePrice.toLocaleString('vi-VN')} VNĐ
              </div>
            )}

            {product.originalPrice &&
              product.originalPrice !== product.basePrice && (
                <div className="text-lg text-gray-500 line-through">
                  {product.originalPrice.toLocaleString('vi-VN')} VNĐ
                </div>
              )}

            <div className="flex items-center space-x-4">
              <Button size="lg" className="flex-1">
                <Package className="mr-2 h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
              <Button variant="outline" size="lg">
                Mua ngay
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {product.category && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Danh mục:</span>
                  <span>{product.category}</span>
                </div>
              )}
              {product.unit && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Đơn vị:</span>
                  <span>{product.unit}</span>
                </div>
              )}
              {product.coverageRate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Độ phủ:</span>
                  <span>{product.coverageRate} m²/lít</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Đánh giá ({totalReviews})
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review._id?.toString()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đánh giá
              </h3>
              <p className="text-gray-600">
                Hãy là người đầu tiên đánh giá sản phẩm này
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
