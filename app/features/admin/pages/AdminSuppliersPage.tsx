import { useState, useTransition } from 'react';
import { Link, useLoaderData, useRevalidator } from 'react-router-dom';
import { Supplier } from '../../shared/types';
import { db } from '../../shared/services/database.client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../shared/components/ui/card';
import { Badge } from '../../shared/components/ui/badge';
import { Button } from '../../shared/components/ui/button';
import { Building2, Edit, Check, Plus } from 'lucide-react';

interface AdminSuppliersPageData {
  suppliers: Supplier[];
  total: number;
  page: number;
  verified: string;
}

export default function AdminSuppliersPage() {
  const { suppliers, total } = useLoaderData() as AdminSuppliersPageData;
  const revalidator = useRevalidator();
  const [,] = useTransition();

  const [isLoading, setIsLoading] = useState(false);

  // Verify inline remains here; create/edit/delete moved to dedicated pages

  const handleVerifySupplier = async (supplier: Supplier) => {
    if (!supplier._id) return;

    setIsLoading(true);
    try {
      await db.updateSupplier();
      revalidator.revalidate();
    } catch (error) {
      console.error('Error verifying supplier:', error);
      alert('Có lỗi xảy ra khi xác minh nhà cung cấp');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation to dedicated pages is handled via Link components below

  return (
    <div className="space-y-6 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quản lý nhà cung cấp
            </h1>
            <p className="text-lg text-gray-600">
              Quản lý {total} nhà cung cấp trong hệ thống
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/suppliers/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhà cung cấp
            </Link>
          </Button>
        </div>
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
                        {supplier.isActive === false && (
                          <Badge variant="destructive">Tạm dừng</Badge>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifySupplier(supplier)}
                        disabled={isLoading}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        to={`/admin/suppliers/${supplier._id?.toString()}/edit`}
                        state={{ supplier }}
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
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
              <p className="text-gray-600 mb-4">
                Thêm nhà cung cấp đầu tiên vào hệ thống
              </p>
              <Button asChild>
                <Link to="/admin/suppliers/new">
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhà cung cấp
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CRUD handled on dedicated pages; no modals here */}
    </div>
  );
}
