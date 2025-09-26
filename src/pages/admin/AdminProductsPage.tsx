import { useLoaderData } from 'react-router-dom';
import { Product } from '../../lib/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';

interface AdminProductsPageData {
  products: Product[];
  total: number;
  page: number;
  search: string;
}

export default function AdminProductsPage() {
  const { products, total } = useLoaderData() as AdminProductsPageData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quản lý sản phẩm
            </h1>
            <p className="text-lg text-gray-600">
              Quản lý {total} sản phẩm trong hệ thống
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả sản phẩm</CardTitle>
          <CardDescription>
            Danh sách tất cả sản phẩm trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map(product => (
                <div
                  key={product._id?.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={product.isActive ? 'default' : 'secondary'}
                        >
                          {product.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                        {product.category && (
                          <Badge variant="outline">{product.category}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {product.basePrice?.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-sm text-gray-600">
                      {product.coverageRate} m²/liter
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có sản phẩm
              </h3>
              <p className="text-gray-600 mb-4">
                Thêm sản phẩm đầu tiên vào hệ thống
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
