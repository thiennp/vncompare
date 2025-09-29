import { useState } from 'react';
import { useLocation, useNavigate, useParams, useRevalidator } from 'react-router-dom';
import { User, CreateUser } from '../../shared/types';
import { db } from '../../shared/services/database.client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/components/ui/select';

const USER_ROLES = [
  { value: 'customer', label: 'Khách hàng' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'supplier', label: 'Nhà cung cấp' },
] as const;

export default function AdminUserEditPage() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const params = useParams();
  const location = useLocation() as { state?: { user?: User } };
  const userFromState = location.state?.user;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<Partial<CreateUser>>({
    email: userFromState?.email || '',
    name: userFromState?.name || '',
    phone: userFromState?.phone || '',
    role: userFromState?.role || 'customer',
    isActive: userFromState?.isActive ?? true,
  });

  const handleSubmit = async () => {
    if (!params.id) return;
    if (!form.email) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setIsLoading(true);
    try {
      await db.updateUser();
      revalidator.revalidate();
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Có lỗi xảy ra khi cập nhật người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chỉnh sửa người dùng</h1>
        <p className="text-gray-600">Cập nhật thông tin người dùng</p>
      </div>

      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Chỉnh sửa thông tin người dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email"
                value={form.email || ''} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                placeholder="Nhập email" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên người dùng</Label>
              <Input 
                id="name" 
                value={form.name || ''} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                placeholder="Nhập tên người dùng" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input 
                id="phone" 
                value={form.phone || ''} 
                onChange={e => setForm({ ...form, phone: e.target.value })} 
                placeholder="Nhập số điện thoại" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Vai trò *</Label>
              <Select 
                value={form.role || 'customer'} 
                onValueChange={value => setForm({ ...form, role: value as 'customer' | 'admin' | 'supplier' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">Trạng thái</Label>
              <Select 
                value={form.isActive ? 'active' : 'inactive'} 
                onValueChange={value => setForm({ ...form, isActive: value === 'active' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/users')}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
