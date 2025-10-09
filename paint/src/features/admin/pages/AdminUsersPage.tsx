import { useState, useTransition } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { User } from '../../../features/shared/services/models';
import { CreateUser } from '../../../features/shared/services/types';
import { db } from '../../../features/shared/services/database.client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../features/shared/components/ui/card';
import { Badge } from '../../../features/shared/components/ui/badge';
import { Button } from '../../../features/shared/components/ui/button';
import { Input } from '../../../features/shared/components/ui/input';
import { Label } from '../../../features/shared/components/ui/label';
import { Checkbox } from '../../../features/shared/components/ui/checkbox';
import { Select } from '../../../features/shared/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../../features/shared/components/ui/dialog';
import {
  Users,
  Edit,
  Trash2,
  Plus,
  Eye,
  Shield,
  UserCheck,
} from 'lucide-react';

interface AdminUsersPageData {
  users: User[];
  total: number;
  page: number;
  role: string;
}

const USER_ROLES = [
  { value: 'customer', label: 'Khách hàng' },
  { value: 'supplier', label: 'Nhà cung cấp' },
  { value: 'admin', label: 'Quản trị viên' },
] as const;

export default function AdminUsersPage() {
  const { users, total } = useLoaderData() as AdminUsersPageData;
  const revalidator = useRevalidator();
  const [,] = useTransition();

  // State for modals and forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateUser>({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'customer',
    isActive: true,
  });

  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!createForm.email || !createForm.password) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsLoading(true);
    try {
      await db.createUser();
      setShowCreateModal(false);
      setCreateForm({
        email: '',
        password: '',
        name: '',
        phone: '',
        role: 'customer',
        isActive: true,
      });
      revalidator.revalidate();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Có lỗi xảy ra khi tạo người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser?._id) return;

    setIsLoading(true);
    try {
      await db.updateUser();
      setShowEditModal(false);
      setSelectedUser(null);
      setEditForm({});
      revalidator.revalidate();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Có lỗi xảy ra khi cập nhật người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?._id) return;

    setIsLoading(true);
    try {
      await db.deleteUser();
      setShowDeleteModal(false);
      setSelectedUser(null);
      revalidator.revalidate();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Có lỗi xảy ra khi xóa người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    if (!user._id) return;

    setIsLoading(true);
    try {
      await db.updateUser();
      revalidator.revalidate();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Có lỗi xảy ra khi thay đổi trạng thái người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'supplier':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'customer':
        return 'Khách hàng';
      case 'admin':
        return 'Quản trị viên';
      case 'supplier':
        return 'Nhà cung cấp';
      default:
        return role;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quản lý người dùng
            </h1>
            <p className="text-lg text-gray-600">
              Quản lý {total} người dùng trong hệ thống
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả người dùng</CardTitle>
          <CardDescription>
            Danh sách tất cả người dùng đã đăng ký
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map(user => (
                <div
                  key={user._id?.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name || user.email}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                        {user.phone && (
                          <Badge variant="outline">{user.phone}</Badge>
                        )}
                        {user.isActive === false && (
                          <Badge variant="destructive">Tạm dừng</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Tham gia:{' '}
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    {user.lastLoginAt && (
                      <p className="text-sm text-gray-600">
                        Đăng nhập cuối:{' '}
                        {new Date(user.lastLoginAt).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewModal(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(user)}
                      disabled={isLoading}
                    >
                      {user.isActive ? (
                        <UserCheck className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteModal(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có người dùng
              </h3>
              <p className="text-gray-600 mb-4">
                Thêm người dùng đầu tiên vào hệ thống
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm người dùng
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
            <DialogDescription>Điền thông tin người dùng mới</DialogDescription>
            <DialogClose onClick={() => setShowCreateModal(false)} />
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={e =>
                  setCreateForm({ ...createForm, email: e.target.value })
                }
                placeholder="Nhập email"
              />
            </div>
            <div>
              <Label htmlFor="create-password">Mật khẩu *</Label>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={e =>
                  setCreateForm({ ...createForm, password: e.target.value })
                }
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div>
              <Label htmlFor="create-name">Tên</Label>
              <Input
                id="create-name"
                value={createForm.name || ''}
                onChange={e =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                placeholder="Nhập tên"
              />
            </div>
            <div>
              <Label htmlFor="create-phone">Số điện thoại</Label>
              <Input
                id="create-phone"
                value={createForm.phone || ''}
                onChange={e =>
                  setCreateForm({ ...createForm, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <Label htmlFor="create-role">Vai trò</Label>
              <Select
                id="create-role"
                value={createForm.role || 'customer'}
                onChange={e =>
                  setCreateForm({
                    ...createForm,
                    role: e.target
                      .value as (typeof USER_ROLES)[number]['value'],
                  })
                }
              >
                <option value="">Chọn vai trò</option>
                {USER_ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="create-active"
                checked={createForm.isActive}
                onChange={e =>
                  setCreateForm({ ...createForm, isActive: e.target.checked })
                }
              />
              <Label htmlFor="create-active">Hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateUser} disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Tạo người dùng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>Cập nhật thông tin người dùng</DialogDescription>
            <DialogClose onClick={() => setShowEditModal(false)} />
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email || ''}
                onChange={e =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="Nhập email"
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Tên</Label>
              <Input
                id="edit-name"
                value={editForm.name || ''}
                onChange={e =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Nhập tên"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                value={editForm.phone || ''}
                onChange={e =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Vai trò</Label>
              <Select
                id="edit-role"
                value={editForm.role || 'customer'}
                onChange={e =>
                  setEditForm({
                    ...editForm,
                    role: e.target
                      .value as (typeof USER_ROLES)[number]['value'],
                  })
                }
              >
                <option value="">Chọn vai trò</option>
                {USER_ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-active"
                checked={editForm.isActive !== false}
                onChange={e =>
                  setEditForm({ ...editForm, isActive: e.target.checked })
                }
              />
              <Label htmlFor="edit-active">Hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditUser} disabled={isLoading}>
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về người dùng
            </DialogDescription>
            <DialogClose onClick={() => setShowViewModal(false)} />
          </DialogHeader>
          <div className="p-6">
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
                {selectedUser.name && (
                  <div>
                    <Label className="font-semibold">Tên</Label>
                    <p className="text-sm text-gray-600">{selectedUser.name}</p>
                  </div>
                )}
                {selectedUser.phone && (
                  <div>
                    <Label className="font-semibold">Số điện thoại</Label>
                    <p className="text-sm text-gray-600">
                      {selectedUser.phone}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="font-semibold">Vai trò</Label>
                  <div className="mt-1">
                    <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                      {getRoleLabel(selectedUser.role)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Trạng thái</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedUser.isActive ? 'default' : 'destructive'
                      }
                    >
                      {selectedUser.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Ngày tạo</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedUser.createdAt).toLocaleDateString(
                      'vi-VN'
                    )}
                  </p>
                </div>
                {selectedUser.lastLoginAt && (
                  <div>
                    <Label className="font-semibold">Đăng nhập cuối</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedUser.lastLoginAt).toLocaleDateString(
                        'vi-VN'
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "
              {selectedUser?.name || selectedUser?.email}"? Hành động này không
              thể hoàn tác.
            </DialogDescription>
            <DialogClose onClick={() => setShowDeleteModal(false)} />
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
