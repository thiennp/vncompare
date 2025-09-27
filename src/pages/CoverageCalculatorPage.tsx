import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { Product } from '../lib/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Calculator } from 'lucide-react';
import { useState } from 'react';

interface CoverageCalculatorPageData {
  products: Product[];
}

export default function CoverageCalculatorPage() {
  const { products } = useLoaderData() as CoverageCalculatorPageData;
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    coats: '2',
    selectedProduct: '',
  });
  const [result, setResult] = useState<{
    area: number;
    volume: number;
    product: Product | null;
    requiredAmount: number;
    totalCost: number;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const calculate = () => {
    const length = parseFloat(formData.length);
    const width = parseFloat(formData.width);
    const height = parseFloat(formData.height);
    const coats = parseInt(formData.coats);

    if (!length || !width || !height || !formData.selectedProduct) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const area = length * height * 2 + width * height * 2; // Assuming 4 walls
    const volume = area * coats;
    const product = products.find(
      p => p._id?.toString() === formData.selectedProduct
    );

    if (!product || !product.coverageRate) {
      alert('Sản phẩm không có thông tin độ phủ');
      return;
    }

    const requiredAmount = volume / product.coverageRate;
    const totalCost =
      requiredAmount * (product.basePrice || product.originalPrice || 0);

    setResult({
      area,
      volume,
      product,
      requiredAmount,
      totalCost,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Máy tính độ phủ sơn
        </h1>
        <p className="text-lg text-gray-600">
          Tính toán lượng sơn cần thiết dựa trên diện tích cần sơn và loại sơn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Thông tin diện tích
            </CardTitle>
            <CardDescription>
              Nhập diện tích cần sơn để tính toán độ phủ sơn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length">Chiều dài (m)</Label>
                <Input
                  id="length"
                  name="length"
                  type="number"
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="width">Chiều rộng (m)</Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="height">Chiều cao (m)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="coats">Số lớp sơn</Label>
              <Input
                id="coats"
                name="coats"
                type="number"
                value={formData.coats}
                onChange={handleChange}
                min="1"
                max="5"
              />
            </div>
            <div>
              <Label htmlFor="selectedProduct">Chọn sản phẩm sơn</Label>
              <select
                id="selectedProduct"
                name="selectedProduct"
                value={formData.selectedProduct}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Chọn sản phẩm</option>
                {products.map(product => (
                  <option
                    key={product._id?.toString()}
                    value={product._id?.toString()}
                  >
                    {product.name} - {product.brand} ({product.coverageRate}{' '}
                    m²/lít)
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={calculate} className="w-full">
              Tính toán
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Kết quả tính toán</CardTitle>
              <CardDescription>
                Thông tin chi tiết về lượng sơn cần thiết
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Diện tích tường
                  </label>
                  <p className="text-lg font-semibold">
                    {result.area.toFixed(2)} m²
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tổng diện tích
                  </label>
                  <p className="text-lg font-semibold">
                    {result.volume.toFixed(2)} m²
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Sản phẩm đã chọn
                </label>
                <p className="text-lg font-semibold">{result.product?.name}</p>
                <p className="text-sm text-gray-600">{result.product?.brand}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Lượng sơn cần thiết
                </label>
                <p className="text-lg font-semibold">
                  {result.requiredAmount.toFixed(2)} liter
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Tổng chi phí
                </label>
                <p className="text-2xl font-bold text-primary">
                  {result.totalCost.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
