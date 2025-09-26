import { useLoaderData } from 'react-router-dom';
import { Supplier } from '../../lib/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Building2, Edit, Trash2, Check } from 'lucide-react';

interface AdminSuppliersPageData {
  suppliers: Supplier[];
  total: number;
  page: number;
  verified: string;
}

export default function AdminSuppliersPage() {
  const {
    suppliers,
    total,
    page: _page,
    verified: _verified,
  } = useLoaderData() as AdminSuppliersPageData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Quản lý nhà cung cấp
        </h1>
        <p className="text-lg text-gray-600">
          Quản lý {total} nhà cung cấp trong hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả nhà cung cấp</CardTitle>
          <CardDescription>
            Danh sách tất cả nhà cung cấp đã đăng ký
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suppliers.length > 0 ? (
            <div className="space-y-4">
              {suppliers.map(supplier => (
                <div
                  key={supplier._id?.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{supplier.name}</h3>
                      <p className="text-sm text-gray-600">{supplier.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={
                            supplier.isVerified ? 'default' : 'secondary'
                          }
                        >
                          {supplier.isVerified ? 'Đã xác minh' : 'Chờ xác minh'}
                        </Badge>
                        {supplier.phone && (
                          <Badge variant="outline">{supplier.phone}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Đăng ký:{' '}
                      {new Date(supplier.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    {supplier.address && (
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {supplier.address}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!supplier.isVerified && (
                      <Button variant="outline" size="sm">
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
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
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có nhà cung cấp
              </h3>
              <p className="text-gray-600">
                Chưa có nhà cung cấp nào trong hệ thống
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
