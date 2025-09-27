import { useState, useTransition } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { Product } from '../../types';
import { db } from '../../lib/database-browser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../components/ui/dialog';
import { Package, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface AdminProductsPageData {
  products: Product[];
  total: number;
  page: number;
  search: string;
}

const PRODUCT_CATEGORIES = [
  'Exterior Paint',
  'Interior Paint',
  'Primer',
  'Varnish',
  'Stain',
  'Sealer',
] as const;

const PRODUCT_UNITS = ['lít', 'galông', 'lon', 'xô', 'tuýp'] as const;

export default function AdminProductsPage() {
  const { products, total } = useLoaderData() as AdminProductsPageData;
  const revalidator = useRevalidator();
  const [,] = useTransition();

  // State for modals and forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<
    Omit<Product, '_id' | 'createdAt'>
  >({
    name: '',
    brand: '',
    category: 'Exterior Paint',
    description: '',
    price: 0,
    unit: 'liter',
    coverage: 0,
    isActive: true,
    images: [],
    specifications: {},
  });

  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProduct = async () => {
    if (
      !createForm.name ||
      !createForm.brand ||
      !createForm.price ||
      !createForm.coverage
    ) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsLoading(true);
    try {
      await db.createProduct(createForm);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        brand: '',
        category: 'Exterior Paint',
        description: '',
        price: 0,
        unit: 'liter',
        coverage: 0,
        isActive: true,
        images: [],
        specifications: {},
      });
      revalidator.revalidate();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Có lỗi xảy ra khi tạo sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct?._id) return;

    setIsLoading(true);
    try {
      await db.updateProduct(selectedProduct._id, editForm);
      setShowEditModal(false);
      setSelectedProduct(null);
      setEditForm({});
      revalidator.revalidate();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct?._id) return;

    setIsLoading(true);
    try {
      await db.deleteProduct(selectedProduct._id);
      setShowDeleteModal(false);
      setSelectedProduct(null);
      revalidator.revalidate();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      unit: product.unit,
      coverage: product.coverage,
      isActive: product.isActive,
      images: product.images,
      specifications: product.specifications,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const openViewModal = (product: Product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quản lý sản phẩm
            </h1>
            <p className="text-lg text-gray-600">
              Quản lý {total} sản phẩm trong hệ thống
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả sản phẩm</CardTitle>
          <CardDescription>
            Danh sách tất cả sản phẩm trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map(product => (
                <div
                  key={product._id?.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={product.isActive ? 'default' : 'secondary'}
                        >
                          {product.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                        {product.category && (
                          <Badge variant="outline">{product.category}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {product.price?.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-sm text-gray-600">
                      {product.coverage} m²/{product.unit}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewModal(product)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteModal(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có sản phẩm
              </h3>
              <p className="text-gray-600 mb-4">
                Thêm sản phẩm đầu tiên vào hệ thống
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Product Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            <DialogDescription>Điền thông tin sản phẩm mới</DialogDescription>
            <DialogClose onClick={() => setShowCreateModal(false)} />
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-name">Tên sản phẩm *</Label>
                <Input
                  id="create-name"
                  value={createForm.name}
                  onChange={e =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div>
                <Label htmlFor="create-brand">Thương hiệu *</Label>
                <Input
                  id="create-brand"
                  value={createForm.brand}
                  onChange={e =>
                    setCreateForm({ ...createForm, brand: e.target.value })
                  }
                  placeholder="Nhập thương hiệu"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-category">Danh mục *</Label>
                <Select
                  value={createForm.category}
                  onValueChange={value =>
                    setCreateForm({ ...createForm, category: value as any })
                  }
                >
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
                <Label htmlFor="create-unit">Đơn vị *</Label>
                <Select
                  value={createForm.unit}
                  onValueChange={value =>
                    setCreateForm({ ...createForm, unit: value })
                  }
                >
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
            </div>

            <div>
              <Label htmlFor="create-description">Mô tả</Label>
              <Input
                id="create-description"
                value={createForm.description || ''}
                onChange={e =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-price">Giá (VNĐ) *</Label>
                <Input
                  id="create-price"
                  type="number"
                  value={createForm.price}
                  onChange={e =>
                    setCreateForm({
                      ...createForm,
                      price: Number(e.target.value),
                    })
                  }
                  placeholder="Nhập giá sản phẩm"
                />
              </div>
              <div>
                <Label htmlFor="create-coverage">Độ phủ (m²) *</Label>
                <Input
                  id="create-coverage"
                  type="number"
                  value={createForm.coverage}
                  onChange={e =>
                    setCreateForm({
                      ...createForm,
                      coverage: Number(e.target.value),
                    })
                  }
                  placeholder="Nhập độ phủ"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="create-active"
                checked={createForm.isActive}
                onChange={e =>
                  setCreateForm({ ...createForm, isActive: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="create-active">Hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateProduct} disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Tạo sản phẩm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
            <DialogClose onClick={() => setShowEditModal(false)} />
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Tên sản phẩm *</Label>
                <Input
                  id="edit-name"
                  value={editForm.name || ''}
                  onChange={e =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div>
                <Label htmlFor="edit-brand">Thương hiệu *</Label>
                <Input
                  id="edit-brand"
                  value={editForm.brand || ''}
                  onChange={e =>
                    setEditForm({ ...editForm, brand: e.target.value })
                  }
                  placeholder="Nhập thương hiệu"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Danh mục *</Label>
                <Select
                  value={editForm.category || 'Exterior Paint'}
                  onValueChange={value =>
                    setEditForm({ ...editForm, category: value as any })
                  }
                >
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
                <Label htmlFor="edit-unit">Đơn vị *</Label>
                <Select
                  value={editForm.unit || 'liter'}
                  onValueChange={value =>
                    setEditForm({ ...editForm, unit: value })
                  }
                >
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
            </div>

            <div>
              <Label htmlFor="edit-description">Mô tả</Label>
              <Input
                id="edit-description"
                value={editForm.description || ''}
                onChange={e =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Giá (VNĐ) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editForm.price || 0}
                  onChange={e =>
                    setEditForm({ ...editForm, price: Number(e.target.value) })
                  }
                  placeholder="Nhập giá sản phẩm"
                />
              </div>
              <div>
                <Label htmlFor="edit-coverage">Độ phủ (m²) *</Label>
                <Input
                  id="edit-coverage"
                  type="number"
                  value={editForm.coverage || 0}
                  onChange={e =>
                    setEditForm({
                      ...editForm,
                      coverage: Number(e.target.value),
                    })
                  }
                  placeholder="Nhập độ phủ"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={editForm.isActive !== false}
                onChange={e =>
                  setEditForm({ ...editForm, isActive: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="edit-active">Hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditProduct} disabled={isLoading}>
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về sản phẩm
            </DialogDescription>
            <DialogClose onClick={() => setShowViewModal(false)} />
          </DialogHeader>
          <div className="p-6">
            {selectedProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Tên sản phẩm</Label>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.name}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Thương hiệu</Label>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.brand}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Danh mục</Label>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.category}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Đơn vị</Label>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.unit}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Giá</Label>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.price?.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Độ phủ</Label>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.coverage} m²/{selectedProduct.unit}
                    </p>
                  </div>
                </div>
                {selectedProduct.description && (
                  <div>
                    <Label className="font-semibold">Mô tả</Label>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="font-semibold">Trạng thái</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedProduct.isActive ? 'default' : 'secondary'
                      }
                    >
                      {selectedProduct.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Ngày tạo</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedProduct.createdAt).toLocaleDateString(
                      'vi-VN'
                    )}
                  </p>
                </div>
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

      {/* Delete Product Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct?.name}"? Hành
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
              onClick={handleDeleteProduct}
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
