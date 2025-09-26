import { useLoaderData } from 'react-router-dom';
import { Supplier, Province } from '../lib/models';
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
import { Truck } from 'lucide-react';
import { useState } from 'react';

interface ShippingCalculatorPageData {
  suppliers: Supplier[];
  provinces: Province[];
}

export default function ShippingCalculatorPage() {
  const { suppliers, provinces } =
    useLoaderData() as ShippingCalculatorPageData;
  const [formData, setFormData] = useState({
    supplier: '',
    province: '',
    weight: '',
    distance: '',
  });
  const [result, setResult] = useState<{
    supplier: Supplier | null;
    province: Province | null;
    baseRate: number;
    weightCost: number;
    distanceCost: number;
    totalCost: number;
    deliveryDays: number;
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
    const weight = parseFloat(formData.weight);
    const distance = parseFloat(formData.distance);

    if (!weight || !distance || !formData.supplier || !formData.province) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const supplier = suppliers.find(
      s => s._id?.toString() === formData.supplier
    );
    const province = provinces.find(
      p => p._id?.toString() === formData.province
    );

    if (!supplier) {
      alert('Không tìm thấy nhà cung cấp');
      return;
    }

    // Simplified calculation - in real app, you'd use shipping zones and service areas
    const baseRate = 50000; // Base shipping rate
    const weightCost = weight * 5000; // 5000 VND per kg
    const distanceCost = distance * 1000; // 1000 VND per km
    const totalCost = baseRate + weightCost + distanceCost;
    const deliveryDays = Math.ceil(distance / 100) + 1; // 1 day per 100km + 1 day processing

    setResult({
      supplier,
      province: province || null,
      baseRate,
      weightCost,
      distanceCost,
      totalCost,
      deliveryDays,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Tính phí vận chuyển
        </h1>
        <p className="text-lg text-gray-600">
          Tính toán chi phí vận chuyển dựa trên nhà cung cấp và địa điểm giao
          hàng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Thông tin vận chuyển
            </CardTitle>
            <CardDescription>
              Nhập thông tin để tính phí vận chuyển
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="supplier">Nhà cung cấp</Label>
              <select
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Chọn nhà cung cấp</option>
                {suppliers.map(supplier => (
                  <option
                    key={supplier._id?.toString()}
                    value={supplier._id?.toString()}
                  >
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="province">Tỉnh/Thành phố</Label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map(province => (
                  <option
                    key={province._id?.toString()}
                    value={province._id?.toString()}
                  >
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="weight">Trọng lượng (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="distance">Khoảng cách (km)</Label>
              <Input
                id="distance"
                name="distance"
                type="number"
                value={formData.distance}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
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
              <CardDescription>Chi phí vận chuyển chi tiết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Nhà cung cấp
                </label>
                <p className="text-lg font-semibold">{result.supplier?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Địa điểm giao hàng
                </label>
                <p className="text-lg font-semibold">{result.province?.name}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí cơ bản:</span>
                  <span>{result.baseRate.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí theo trọng lượng:</span>
                  <span>{result.weightCost.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí theo khoảng cách:</span>
                  <span>{result.distanceCost.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-lg font-medium">
                    Tổng phí vận chuyển:
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {result.totalCost.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Thời gian giao hàng dự kiến
                </label>
                <p className="text-lg font-semibold">
                  {result.deliveryDays} ngày
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
