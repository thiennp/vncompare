import { useState, useTransition } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { Supplier } from '../../../features/shared/services/models';
import { CreateSupplier } from '../../../features/shared/services/types';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../../features/shared/components/ui/dialog';
import { Building2, Edit, Trash2, Check, Plus } from 'lucide-react';

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

  // State for modals and forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  // Form states
  const [createForm, setCreateForm] = useState<
    Omit<Supplier, '_id' | 'createdAt' | 'updatedAt'>
  >({
    name: '',
    email: '',
    phone: '',
    address: '',
    isVerified: false,
    isActive: true,
  });

  const [editForm, setEditForm] = useState<Partial<Supplier>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSupplier = async () => {
    if (!createForm.name || !createForm.email) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsLoading(true);
    try {
      await db.createSupplier(createForm);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        isVerified: false,
        isActive: true,
      });
      revalidator.revalidate();
      alert('Tạo nhà cung cấp thành công!');
    } catch (error) {
      console.error('Error creating supplier:', error);
      alert('Có lỗi xảy ra khi tạo nhà cung cấp: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSupplier = async () => {
    if (!selectedSupplier?._id) return;

    setIsLoading(true);
    try {
      await db.updateSupplier(selectedSupplier._id.toString(), editForm);
      setShowEditModal(false);
      setSelectedSupplier(null);
      setEditForm({});
      revalidator.revalidate();
      alert('Cập nhật nhà cung cấp thành công!');
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert('Có lỗi xảy ra khi cập nhật nhà cung cấp: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplier?._id) return;

    setIsLoading(true);
    try {
      await db.deleteSupplier(selectedSupplier._id.toString());
      setShowDeleteModal(false);
      setSelectedSupplier(null);
      revalidator.revalidate();
      alert('Xóa nhà cung cấp thành công!');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      alert('Có lỗi xảy ra khi xóa nhà cung cấp: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

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

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEditForm({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      isVerified: supplier.isVerified,
      isActive: supplier.isActive,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteModal(true);
  };

  return (
    <div>
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
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhà cung cấp
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(supplier)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteModal(supplier)}
                    >
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
              <p className="text-gray-600 mb-4">
                Thêm nhà cung cấp đầu tiên vào hệ thống
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhà cung cấp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Supplier Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
            <DialogDescription>
              Điền thông tin nhà cung cấp mới
            </DialogDescription>
            <DialogClose onClick={() => setShowCreateModal(false)} />
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="create-name">Tên nhà cung cấp *</Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={e =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                placeholder="Nhập tên nhà cung cấp"
              />
            </div>
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
              <Label htmlFor="create-phone">Số điện thoại</Label>
              <Input
                id="create-phone"
                value={createForm.phone}
                onChange={e =>
                  setCreateForm({ ...createForm, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <Label htmlFor="create-address">Địa chỉ</Label>
              <Input
                id="create-address"
                value={createForm.address}
                onChange={e =>
                  setCreateForm({ ...createForm, address: e.target.value })
                }
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="create-verified"
                checked={createForm.isVerified}
                onChange={e =>
                  setCreateForm({ ...createForm, isVerified: e.target.checked })
                }
              />
              <Label htmlFor="create-verified">Đã xác minh</Label>
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
            <Button onClick={handleCreateSupplier} disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Tạo nhà cung cấp'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nhà cung cấp</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin nhà cung cấp
            </DialogDescription>
            <DialogClose onClick={() => setShowEditModal(false)} />
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="edit-name">Tên nhà cung cấp *</Label>
              <Input
                id="edit-name"
                value={editForm.name || ''}
                onChange={e =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Nhập tên nhà cung cấp"
              />
            </div>
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
              <Label htmlFor="edit-address">Địa chỉ</Label>
              <Input
                id="edit-address"
                value={editForm.address || ''}
                onChange={e =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-verified"
                checked={editForm.isVerified || false}
                onChange={e =>
                  setEditForm({ ...editForm, isVerified: e.target.checked })
                }
              />
              <Label htmlFor="edit-verified">Đã xác minh</Label>
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
            <Button onClick={handleEditSupplier} disabled={isLoading}>
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Supplier Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa nhà cung cấp</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa nhà cung cấp "{selectedSupplier?.name}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
            <DialogClose onClick={() => setShowDeleteModal(false)} />
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSupplier}
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
