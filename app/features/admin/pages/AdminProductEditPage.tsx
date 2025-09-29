import { useState } from 'react';
import { useLocation, useNavigate, useParams, useRevalidator } from 'react-router-dom';
import { Product } from '../../shared/types';
import { db } from '../../shared/services/database.client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/components/ui/select';

const PRODUCT_CATEGORIES = [
  'Sơn ngoại thất',
  'Sơn nội thất',
  'Sơn lót',
  'Sơn bóng',
  'Sơn màu',
  'Sơn chống thấm',
] as const;

const PRODUCT_UNITS = ['lít', 'galông', 'lon', 'xô', 'tuýp'] as const;

export default function AdminProductEditPage() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const params = useParams();
  const location = useLocation() as { state?: { product?: Product } };
  const productFromState = location.state?.product;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({
    name: productFromState?.name || '',
    brand: productFromState?.brand || '',
    category: productFromState?.category || 'Sơn ngoại thất',
    description: productFromState?.description || '',
    price: productFromState?.price || 0,
    unit: productFromState?.unit || 'lít',
    coverage: productFromState?.coverage || 0,
    isActive: productFromState?.isActive ?? true,
  });

  const handleSubmit = async () => {
    if (!params.id) return;
    if (!form.name || !form.brand || !form.price || !form.coverage) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setIsLoading(true);
    try {
      await db.updateProduct();
      revalidator.revalidate();
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chỉnh sửa sản phẩm</h1>
        <p className="text-gray-600">Cập nhật thông tin sản phẩm</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
          <CardDescription>Chỉnh sửa thông tin chi tiết</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input id="name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nhập tên sản phẩm" />
            </div>
            <div>
              <Label htmlFor="brand">Thương hiệu *</Label>
              <Input id="brand" value={form.brand || ''} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Nhập thương hiệu" />
            </div>
            <div>
              <Label htmlFor="category">Danh mục *</Label>
              <Select value={form.category || 'Sơn ngoại thất'} onValueChange={value => setForm({ ...form, category: value as typeof PRODUCT_CATEGORIES[number] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unit">Đơn vị *</Label>
              <Select value={form.unit || 'lít'} onValueChange={value => setForm({ ...form, unit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input id="price" type="number" value={form.price || 0} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="Nhập giá sản phẩm" />
            </div>
            <div>
              <Label htmlFor="coverage">Độ phủ (m²) *</Label>
              <Input id="coverage" type="number" value={form.coverage || 0} onChange={e => setForm({ ...form, coverage: Number(e.target.value) })} placeholder="Nhập độ phủ" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input id="description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Nhập mô tả sản phẩm" />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => navigate('/admin/products')}>Hủy</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Đang cập nhật...' : 'Cập nhật'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

