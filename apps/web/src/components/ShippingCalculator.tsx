'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, Loader2, MapPin, Package, Clock } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  brand: string;
  basePrice: number;
  unit: string;
}

interface ShippingResult {
  isServiceable: boolean;
  message?: string;
  address?: {
    province: string;
    district: string;
    ward: string;
  };
  orderDetails?: {
    totalWeight: number;
    totalVolume: number;
    totalValue: number;
  };
  deliveryFee?: number;
  estimatedDeliveryTime?: string;
  breakdown?: {
    baseFee: number;
    weightFee: number;
    distanceFee: number;
    totalFee: number;
  };
}

export default function ShippingCalculator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Array<{productId: number, quantity: number}>>([]);
  const [address, setAddress] = useState({
    province: '',
    district: '',
    ward: ''
  });
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<ShippingResult | null>(null);
  const [error, setError] = useState('');

  const provinces = [
    'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
    'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
    'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
    'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
    'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
    'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
    'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/products/featured');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: 0, quantity: 1 }]);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: 'productId' | 'quantity', value: number) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;
    setSelectedProducts(updated);
  };

  const handleCalculate = async () => {
    if (!address.province || !address.district || !address.ward) {
      setError('Please fill in all address fields');
      return;
    }

    if (selectedProducts.length === 0) {
      setError('Please add at least one product');
      return;
    }

    const hasInvalidProduct = selectedProducts.some(p => p.productId === 0 || p.quantity <= 0);
    if (hasInvalidProduct) {
      setError('Please select valid products with quantities greater than 0');
      return;
    }

    setCalculating(true);
    setError('');

    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          province: address.province,
          district: address.district,
          ward: address.ward,
          products: selectedProducts
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Calculation failed');
      }
    } catch (error) {
      setError('An error occurred during calculation');
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setAddress({ province: '', district: '', ward: '' });
    setSelectedProducts([]);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Calculator</h1>
        <p className="text-gray-600">Calculate delivery fees and estimated delivery time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery Information
            </CardTitle>
            <CardDescription>
              Enter delivery address and products to calculate shipping
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Address Fields */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery Address
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="province">Province/City</Label>
                <Select value={address.province} onValueChange={(value) => setAddress({...address, province: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  placeholder="Enter district"
                  value={address.district}
                  onChange={(e) => setAddress({...address, district: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <Input
                  id="ward"
                  placeholder="Enter ward"
                  value={address.ward}
                  onChange={(e) => setAddress({...address, ward: e.target.value})}
                />
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Products
                </h3>
                <Button variant="outline" size="sm" onClick={addProduct}>
                  Add Product
                </Button>
              </div>

              {selectedProducts.map((product, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Product</Label>
                    <Select 
                      value={product.productId.toString()} 
                      onValueChange={(value) => updateProduct(index, 'productId', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.brand} - {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeProduct(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleCalculate} 
                disabled={calculating || !address.province || !address.district || !address.ward || selectedProducts.length === 0}
                className="flex-1"
              >
                {calculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Truck className="mr-2 h-4 w-4" />
                    Calculate Shipping
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Shipping Results
            </CardTitle>
            <CardDescription>
              Delivery fee and estimated delivery time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {result.isServiceable ? (
                  <>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">Delivery Available</h3>
                      <p className="text-green-800">
                        {result.address?.province}, {result.address?.district}, {result.address?.ward}
                      </p>
                    </div>

                    {result.orderDetails && (
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Total Weight</p>
                          <p className="font-semibold">{result.orderDetails.totalWeight} kg</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Total Volume</p>
                          <p className="font-semibold">{result.orderDetails.totalVolume} L</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Total Value</p>
                          <p className="font-semibold">₫{result.orderDetails.totalValue.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Delivery Fee</h3>
                      <p className="text-blue-800 text-xl font-bold">
                        ₫{result.deliveryFee?.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-2">Estimated Delivery Time</h3>
                      <p className="text-yellow-800 text-lg font-bold">
                        {result.estimatedDeliveryTime}
                      </p>
                    </div>

                    {result.breakdown && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-semibold mb-2">Fee Breakdown</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Base Fee:</span>
                            <span>₫{result.breakdown.baseFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Weight Fee:</span>
                            <span>₫{result.breakdown.weightFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Distance Fee:</span>
                            <span>₫{result.breakdown.distanceFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Total:</span>
                            <span>₫{result.breakdown.totalFee.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Delivery Not Available</h3>
                    <p className="text-red-800">{result.message}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter delivery information and click Calculate to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
