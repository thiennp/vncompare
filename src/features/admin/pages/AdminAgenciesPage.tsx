import { useState, useTransition, useMemo } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { Agency, Supplier } from '../../shared/services/models';
import { CreateAgency } from '../../shared/services/types';
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
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Checkbox } from '../../shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../shared/components/ui/dialog';
import {
  Building2,
  Edit,
  Trash2,
  Check,
  Plus,
  ChevronRight,
  Network,
} from 'lucide-react';

interface AdminAgenciesPageData {
  agencies: Agency[];
  suppliers: Supplier[];
  total: number;
  page: number;
}

interface TreeNode {
  type: 'supplier' | 'agency';
  data: Supplier | Agency;
  children: TreeNode[];
}

export default function AdminAgenciesPage() {
  const { agencies, suppliers, total } =
    useLoaderData() as AdminAgenciesPageData;
  const revalidator = useRevalidator();
  const [,] = useTransition();

  // State for modals and forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<
    Omit<Agency, '_id' | 'createdAt' | 'updatedAt'>
  >({
    name: '',
    email: '',
    phone: '',
    address: '',
    level: 1,
    parentId: '',
    parentType: 'supplier',
    verified: false,
    isActive: true,
  });

  const [editForm, setEditForm] = useState<Partial<Agency>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Build hierarchical tree structure
  const tree = useMemo(() => {
    const buildTree = (): TreeNode[] => {
      const treeNodes: TreeNode[] = [];

      // Create supplier nodes
      suppliers.forEach(supplier => {
        const supplierNode: TreeNode = {
          type: 'supplier',
          data: supplier,
          children: [],
        };

        // Find level 1 agencies for this supplier
        const level1Agencies = agencies.filter(
          a =>
            a.level === 1 &&
            a.parentId === supplier._id &&
            a.parentType === 'supplier'
        );

        level1Agencies.forEach(l1Agency => {
          const l1Node: TreeNode = {
            type: 'agency',
            data: l1Agency,
            children: [],
          };

          // Find level 2 agencies for this level 1 agency
          const level2Agencies = agencies.filter(
            a =>
              a.level === 2 &&
              a.parentId === l1Agency._id &&
              a.parentType === 'agency'
          );

          level2Agencies.forEach(l2Agency => {
            const l2Node: TreeNode = {
              type: 'agency',
              data: l2Agency,
              children: [],
            };

            // Find level 3 agencies for this level 2 agency
            const level3Agencies = agencies.filter(
              a =>
                a.level === 3 &&
                a.parentId === l2Agency._id &&
                a.parentType === 'agency'
            );

            level3Agencies.forEach(l3Agency => {
              l2Node.children.push({
                type: 'agency',
                data: l3Agency,
                children: [],
              });
            });

            l1Node.children.push(l2Node);
          });

          supplierNode.children.push(l1Node);
        });

        treeNodes.push(supplierNode);
      });

      return treeNodes;
    };

    return buildTree();
  }, [agencies, suppliers]);

  // Get available parents based on selected level
  const getAvailableParents = (level: number) => {
    if (level === 1) {
      return suppliers.map(s => ({
        id: s._id,
        name: s.name,
        type: 'supplier' as const,
      }));
    } else if (level === 2) {
      return agencies
        .filter(a => a.level === 1)
        .map(a => ({ id: a._id, name: a.name, type: 'agency' as const }));
    } else if (level === 3) {
      return agencies
        .filter(a => a.level === 2)
        .map(a => ({ id: a._id, name: a.name, type: 'agency' as const }));
    }
    return [];
  };

  const handleCreateAgency = async () => {
    if (
      !createForm.name ||
      !createForm.email ||
      !createForm.address ||
      !createForm.parentId
    ) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsLoading(true);
    try {
      await db.createAgency(createForm);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        level: 1,
        parentId: '',
        parentType: 'supplier',
        verified: false,
        isActive: true,
      });
      revalidator.revalidate();
      alert('Tạo đại lý thành công!');
    } catch (error) {
      console.error('Error creating agency:', error);
      alert('Có lỗi xảy ra khi tạo đại lý: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAgency = async () => {
    if (!selectedAgency?._id) return;

    setIsLoading(true);
    try {
      await db.updateAgency(selectedAgency._id.toString(), editForm);
      setShowEditModal(false);
      setSelectedAgency(null);
      setEditForm({});
      revalidator.revalidate();
      alert('Cập nhật đại lý thành công!');
    } catch (error) {
      console.error('Error updating agency:', error);
      alert('Có lỗi xảy ra khi cập nhật đại lý: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAgency = async () => {
    if (!selectedAgency?._id) return;

    setIsLoading(true);
    try {
      await db.deleteAgency(selectedAgency._id.toString());
      setShowDeleteModal(false);
      setSelectedAgency(null);
      revalidator.revalidate();
      alert('Xóa đại lý thành công!');
    } catch (error) {
      console.error('Error deleting agency:', error);
      alert('Có lỗi xảy ra khi xóa đại lý: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (agency: Agency) => {
    setSelectedAgency(agency);
    setEditForm({
      name: agency.name,
      email: agency.email,
      phone: agency.phone,
      address: agency.address,
      verified: agency.verified,
      isActive: agency.isActive,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowDeleteModal(true);
  };

  // Render tree node recursively
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const paddingLeft = depth * 40;
    const isSupplier = node.type === 'supplier';
    const data = node.data;

    if (isSupplier) {
      const supplier = data as Supplier;
      return (
        <div key={`supplier-${supplier._id}`}>
          <div
            className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 mb-2"
            style={{ marginLeft: `${paddingLeft}px` }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{supplier.name}</h3>
                  <Badge variant="outline">Nhà cung cấp</Badge>
                </div>
                <p className="text-sm text-gray-600">{supplier.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {supplier.phone && (
                    <Badge variant="outline">{supplier.phone}</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              {supplier.address && (
                <p className="text-sm text-gray-600 max-w-xs truncate">
                  {supplier.address}
                </p>
              )}
            </div>
          </div>
          {node.children.map(child => renderTreeNode(child, depth + 1))}
        </div>
      );
    } else {
      const agency = data as Agency;
      const levelColors = {
        1: 'bg-green-50 border-green-200',
        2: 'bg-yellow-50 border-yellow-200',
        3: 'bg-purple-50 border-purple-200',
      };
      const levelBadgeColors = {
        1: 'bg-green-100 text-green-800',
        2: 'bg-yellow-100 text-yellow-800',
        3: 'bg-purple-100 text-purple-800',
      };

      return (
        <div key={`agency-${agency._id}`}>
          <div
            className={`flex items-center justify-between p-4 border rounded-lg mb-2 ${
              levelColors[agency.level as keyof typeof levelColors]
            }`}
            style={{ marginLeft: `${paddingLeft}px` }}
          >
            <div className="flex items-center space-x-4">
              {depth > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 -ml-2" />
              )}
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border">
                <Network className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{agency.name}</h3>
                  <Badge
                    className={
                      levelBadgeColors[
                        agency.level as keyof typeof levelBadgeColors
                      ]
                    }
                  >
                    Cấp {agency.level}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{agency.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={agency.verified ? 'default' : 'secondary'}>
                    {agency.verified ? 'Đã xác minh' : 'Chờ xác minh'}
                  </Badge>
                  {agency.phone && (
                    <Badge variant="outline">{agency.phone}</Badge>
                  )}
                  {agency.isActive === false && (
                    <Badge variant="destructive">Tạm dừng</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {agency.address && (
                  <p className="text-sm text-gray-600 max-w-xs truncate">
                    {agency.address}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(agency)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteModal(agency)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {node.children.map(child => renderTreeNode(child, depth + 1))}
        </div>
      );
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quản lý đại lý
            </h1>
            <p className="text-lg text-gray-600">
              Quản lý {total} đại lý trong hệ thống (Cấp 1, 2, 3)
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm đại lý
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cấu trúc phân cấp đại lý</CardTitle>
          <CardDescription>
            Hiển thị cấu trúc phân cấp: Nhà cung cấp → Đại lý cấp 1 → Đại lý cấp
            2 → Đại lý cấp 3
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tree.length > 0 ? (
            <div className="space-y-2">
              {tree.map(node => renderTreeNode(node))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đại lý
              </h3>
              <p className="text-gray-600 mb-4">
                Thêm đại lý đầu tiên vào hệ thống
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm đại lý
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Agency Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm đại lý mới</DialogTitle>
            <DialogDescription>Điền thông tin đại lý mới</DialogDescription>
            <DialogClose onClick={() => setShowCreateModal(false)} />
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="create-level">Cấp đại lý *</Label>
              <select
                id="create-level"
                className="w-full p-2 border rounded"
                value={createForm.level}
                onChange={e => {
                  const level = parseInt(e.target.value) as 1 | 2 | 3;
                  setCreateForm({
                    ...createForm,
                    level,
                    parentId: '',
                    parentType: level === 1 ? 'supplier' : 'agency',
                  });
                }}
              >
                <option value={1}>Cấp 1 (thuộc Nhà cung cấp)</option>
                <option value={2}>Cấp 2 (thuộc Đại lý cấp 1)</option>
                <option value={3}>Cấp 3 (thuộc Đại lý cấp 2)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="create-parent">
                {createForm.level === 1 && 'Nhà cung cấp *'}
                {createForm.level === 2 && 'Đại lý cấp 1 *'}
                {createForm.level === 3 && 'Đại lý cấp 2 *'}
              </Label>
              <select
                id="create-parent"
                className="w-full p-2 border rounded"
                value={createForm.parentId}
                onChange={e =>
                  setCreateForm({ ...createForm, parentId: e.target.value })
                }
              >
                <option value="">-- Chọn --</option>
                {getAvailableParents(createForm.level).map(parent => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="create-name">Tên đại lý *</Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={e =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                placeholder="Nhập tên đại lý"
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
              <Label htmlFor="create-address">Địa chỉ *</Label>
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
                checked={createForm.verified}
                onCheckedChange={checked =>
                  setCreateForm({ ...createForm, verified: checked === true })
                }
              />
              <Label htmlFor="create-verified">Đã xác minh</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="create-active"
                checked={createForm.isActive}
                onCheckedChange={checked =>
                  setCreateForm({ ...createForm, isActive: checked === true })
                }
              />
              <Label htmlFor="create-active">Hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateAgency} disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Tạo đại lý'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Agency Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đại lý</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin đại lý (không thể thay đổi cấp và parent)
            </DialogDescription>
            <DialogClose onClick={() => setShowEditModal(false)} />
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="edit-name">Tên đại lý *</Label>
              <Input
                id="edit-name"
                value={editForm.name || ''}
                onChange={e =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Nhập tên đại lý"
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
                checked={editForm.verified || false}
                onCheckedChange={checked =>
                  setEditForm({ ...editForm, verified: checked === true })
                }
              />
              <Label htmlFor="edit-verified">Đã xác minh</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-active"
                checked={editForm.isActive !== false}
                onCheckedChange={checked =>
                  setEditForm({ ...editForm, isActive: checked === true })
                }
              />
              <Label htmlFor="edit-active">Hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditAgency} disabled={isLoading}>
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Agency Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa đại lý</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa đại lý "{selectedAgency?.name}"? Hành
              động này không thể hoàn tác.
            </DialogDescription>
            <DialogClose onClick={() => setShowDeleteModal(false)} />
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAgency}
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
