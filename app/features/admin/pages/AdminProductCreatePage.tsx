import { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router-dom';
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

export default function AdminProductCreatePage() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<Omit<Product, '_id' | 'createdAt'>>({
    name: '',
    brand: '',
    category: 'Sơn ngoại thất',
    description: '',
    price: 0,
    unit: 'lít',
    coverage: 0,
    isActive: true,
    images: [],
    specifications: {},
  });

  const handleSubmit = async () => {
    if (!form.name || !form.brand || !form.price || !form.coverage) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setIsLoading(true);
    try {
      await db.createProduct();
      revalidator.revalidate();
      navigate('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Có lỗi xảy ra khi tạo sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thêm sản phẩm</h1>
        <p className="text-gray-600">Tạo một sản phẩm mới trong hệ thống</p>
      </div>

      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Điền thông tin cơ bản về sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input 
                id="name" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                placeholder="Nhập tên sản phẩm" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Thương hiệu *</Label>
              <Input 
                id="brand" 
                value={form.brand} 
                onChange={e => setForm({ ...form, brand: e.target.value })} 
                placeholder="Nhập thương hiệu" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục *</Label>
              <Select 
                value={form.category} 
                onValueChange={value => setForm({ ...form, category: value as typeof PRODUCT_CATEGORIES[number] })}
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
            <div className="space-y-2">
              <Label htmlFor="unit">Đơn vị *</Label>
              <Select 
                value={form.unit} 
                onValueChange={value => setForm({ ...form, unit: value })}
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
        </CardContent>
      </Card>

      {/* Pricing & Coverage Card */}
      <Card>
        <CardHeader>
          <CardTitle>Giá cả và độ phủ</CardTitle>
          <CardDescription>Thông tin về giá và khả năng phủ của sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input 
                id="price" 
                type="number" 
                value={form.price} 
                onChange={e => setForm({ ...form, price: Number(e.target.value) })} 
                placeholder="Nhập giá sản phẩm" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverage">Độ phủ (m²) *</Label>
              <Input 
                id="coverage" 
                type="number" 
                value={form.coverage} 
                onChange={e => setForm({ ...form, coverage: Number(e.target.value) })} 
                placeholder="Nhập độ phủ" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description Card */}
      <Card>
        <CardHeader>
          <CardTitle>Mô tả sản phẩm</CardTitle>
          <CardDescription>Thêm mô tả chi tiết về sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input 
              id="description" 
              value={form.description || ''} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              placeholder="Nhập mô tả sản phẩm" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/products')}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
            >
              {isLoading ? 'Đang tạo...' : 'Tạo sản phẩm'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

