import { useLoaderData } from 'react-router-dom';
import { Order } from '../lib/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ShoppingCart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrdersPageData {
  orders: Order[];
  total: number;
  page: number;
  status: string;
}

export default function OrdersPage() {
  const { orders } = useLoaderData() as OrdersPageData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Đơn hàng của tôi
        </h1>
        <p className="text-lg text-gray-600">
          Quản lý và theo dõi các đơn hàng của bạn
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order._id?.toString()}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Đơn hàng #{order._id?.toString().slice(-8)}
                    </CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </CardDescription>
                  </div>
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-semibold">
                      {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Địa chỉ giao hàng:</span>
                    <span>{order.shippingAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Trạng thái thanh toán:
                    </span>
                    <Badge
                      variant={
                        order.paymentStatus === 'paid' ? 'default' : 'outline'
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
                <div className="mt-4">
                  <Link to={`/orders/${order._id}`}>
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có đơn hàng
            </h3>
            <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào</p>
            <Link to="/products">
              <Button>
                <Package className="mr-2 h-4 w-4" />
                Mua sắm ngay
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
