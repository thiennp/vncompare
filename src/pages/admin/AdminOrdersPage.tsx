import { useLoaderData } from 'react-router-dom';
import { Order } from '../../lib/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminOrdersPageData {
  orders: Order[];
  total: number;
  page: number;
  status: string;
}

export default function AdminOrdersPage() {
  const {
    orders,
    total,
    page: _page,
    status: _status,
  } = useLoaderData() as AdminOrdersPageData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Quản lý đơn hàng
        </h1>
        <p className="text-lg text-gray-600">
          Quản lý {total} đơn hàng trong hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả đơn hàng</CardTitle>
          <CardDescription>
            Danh sách tất cả đơn hàng của khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order._id?.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Đơn hàng #{order._id?.toString().slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={
                            order.status === 'delivered'
                              ? 'default'
                              : order.status === 'shipped'
                                ? 'default'
                                : order.status === 'confirmed'
                                  ? 'secondary'
                                  : 'outline'
                          }
                        >
                          {order.status === 'pending'
                            ? 'Chờ xử lý'
                            : order.status === 'confirmed'
                              ? 'Đã xác nhận'
                              : order.status === 'shipped'
                                ? 'Đang giao'
                                : order.status === 'delivered'
                                  ? 'Đã giao'
                                  : 'Đã hủy'}
                        </Badge>
                        <Badge
                          variant={
                            order.paymentStatus === 'paid'
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {order.paymentStatus === 'pending'
                            ? 'Chờ thanh toán'
                            : order.paymentStatus === 'paid'
                              ? 'Đã thanh toán'
                              : order.paymentStatus === 'failed'
                                ? 'Thanh toán thất bại'
                                : 'Đã hoàn tiền'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.orderItems.length} sản phẩm
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link to={`/admin/orders/${order._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đơn hàng
              </h3>
              <p className="text-gray-600">
                Chưa có đơn hàng nào trong hệ thống
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
