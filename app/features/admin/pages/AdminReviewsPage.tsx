import { useLoaderData } from 'react-router-dom';
import { Review } from '../../shared/services/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../shared/components/ui/card';
import { Badge } from '../../shared/components/ui/badge';
import { Button } from '../../shared/components/ui/button';
import { Star, Check, X, Edit } from 'lucide-react';

interface AdminReviewsPageData {
  reviews: Review[];
  total: number;
  page: number;
  status: string;
}

export default function AdminReviewsPage() {
  const { reviews, total } = useLoaderData() as AdminReviewsPageData;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Quản lý đánh giá
        </h1>
        <p className="text-lg text-gray-600">
          Quản lý {total} đánh giá trong hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả đánh giá</CardTitle>
          <CardDescription>Danh sách tất cả đánh giá sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <div
                  key={review._id?.toString()}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{review.title}</h3>
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
                    <Badge
                      variant={
                        review.status === 'approved'
                          ? 'default'
                          : review.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {review.status === 'pending'
                        ? 'Chờ duyệt'
                        : review.status === 'approved'
                          ? 'Đã duyệt'
                          : 'Đã từ chối'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Sản phẩm: #{review.productId.toString().slice(-8)} | Người
                      dùng: #{review.userId.toString().slice(-8)} |
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center space-x-2">
                      {review.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đánh giá
              </h3>
              <p className="text-gray-600">
                Chưa có đánh giá nào trong hệ thống
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
