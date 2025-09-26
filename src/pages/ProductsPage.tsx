import { useLoaderData, Link } from 'react-router-dom';
import { Product } from '../lib/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Paintbrush } from 'lucide-react';

interface ProductsPageData {
  products: Product[];
  total: number;
  page: number;
  category: string;
  search: string;
}

export default function ProductsPage() {
  const {
    products,
    total,
    page: _page,
    category: _category,
    search: _search,
  } = useLoaderData() as ProductsPageData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm sơn</h1>
        <p className="text-lg text-gray-600">
          Tìm kiếm và so sánh {total} sản phẩm sơn chất lượng cao
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
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
                {product.basePrice && (
                  <p className="text-lg font-semibold text-primary">
                    {product.basePrice.toLocaleString('vi-VN')} VNĐ
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

      {products.length === 0 && (
        <div className="text-center py-12">
          <Paintbrush className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h3>
          <p className="text-gray-600">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}
    </div>
  );
}
