import { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router-dom';
import { Supplier } from '../../shared/types';
import { db } from '../../shared/services/database.client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';

export default function AdminSupplierCreatePage() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<Omit<Supplier, '_id' | 'createdAt'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    isVerified: false,
    isActive: true,
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setIsLoading(true);
    try {
      await db.createSupplier();
      revalidator.revalidate();
      navigate('/admin/suppliers');
    } catch (error) {
      console.error('Error creating supplier:', error);
      alert('Có lỗi xảy ra khi tạo nhà cung cấp');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thêm nhà cung cấp</h1>
        <p className="text-gray-600">Tạo một nhà cung cấp mới trong hệ thống</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhà cung cấp</CardTitle>
          <CardDescription>Điền thông tin chi tiết bên dưới</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tên nhà cung cấp *</Label>
              <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nhập tên nhà cung cấp" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Nhập email" />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Nhập số điện thoại" />
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Nhập địa chỉ" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isVerified ?? false} onChange={e => setForm({ ...form, isVerified: e.target.checked })} className="rounded" />
                Đã xác minh
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive !== false} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                Hoạt động
              </label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => navigate('/admin/suppliers')}>Hủy</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Đang tạo...' : 'Tạo nhà cung cấp'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

