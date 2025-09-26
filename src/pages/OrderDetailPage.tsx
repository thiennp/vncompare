import { useLoaderData } from 'react-router-dom';
import { Order, User } from '../lib/models';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderDetailPageData {
  order: Order;
  user: User;
}

export default function OrderDetailPage() {
  const { order } = useLoaderData() as OrderDetailPageData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center text-primary hover:underline mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách đơn hàng
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Đơn hàng #{order._id?.toString().slice(-8)}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-mono">
                #{order._id?.toString().slice(-8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày đặt:</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
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
            <div className="flex justify-between">
              <span className="text-gray-600">Thanh toán:</span>
              <Badge
                variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}
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
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-semibold text-lg">
                {order.totalAmount.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Địa chỉ giao hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{order.shippingAddress}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sản phẩm trong đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {order.orderItems.length > 0 ? (
            <div className="space-y-4">
              {order.orderItems.map(item => (
                <div
                  key={item._id?.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Sản phẩm #{item.productId.toString().slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.price.toLocaleString('vi-VN')} VNĐ/đơn vị
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Không có sản phẩm nào trong đơn hàng này
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
