'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, Loader2, Paintbrush } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  brand: string;
  basePrice: number;
  unit: string;
}

interface CalculationResult {
  product: Product;
  surfaceType: string;
  area: number;
  coverageRate: number;
  coatsRequired: number;
  paintNeeded: number;
  totalCost: number;
  notes?: string;
}

export default function CoverageCalculator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [surfaceType, setSurfaceType] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState('');

  const surfaceTypes = [
    { value: 'concrete', label: 'Concrete' },
    { value: 'brick', label: 'Brick' },
    { value: 'wood', label: 'Wood' },
    { value: 'metal', label: 'Metal' },
    { value: 'plaster', label: 'Plaster' },
    { value: 'drywall', label: 'Drywall' }
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

  const handleCalculate = async () => {
    if (!selectedProduct || !surfaceType || !area) {
      setError('Please fill in all fields');
      return;
    }

    if (parseFloat(area) <= 0) {
      setError('Area must be greater than 0');
      return;
    }

    setCalculating(true);
    setError('');

    try {
      const response = await fetch('/api/v1/coverage/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct,
          surfaceType,
          area: parseFloat(area)
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
    setSelectedProduct('');
    setSurfaceType('');
    setArea('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paint Coverage Calculator</h1>
        <p className="text-gray-600">Calculate how much paint you need for your project</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Project Details
            </CardTitle>
            <CardDescription>
              Enter your project information to calculate paint requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="product">Select Paint Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a paint product" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading products...
                    </SelectItem>
                  ) : (
                    products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.brand} - {product.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="surface">Surface Type</Label>
              <Select value={surfaceType} onValueChange={setSurfaceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select surface type" />
                </SelectTrigger>
                <SelectContent>
                  {surfaceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area to Paint (m²)</Label>
              <Input
                id="area"
                type="number"
                placeholder="Enter area in square meters"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleCalculate} 
                disabled={calculating || !selectedProduct || !surfaceType || !area}
                className="flex-1"
              >
                {calculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
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
              <Paintbrush className="h-5 w-5" />
              Calculation Results
            </CardTitle>
            <CardDescription>
              Your paint requirements and cost estimate
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected Product</h3>
                  <p className="text-blue-800">{result.product.brand} - {result.product.name}</p>
                  <p className="text-sm text-blue-600">₫{result.product.basePrice?.toLocaleString()} per {result.product.unit}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Surface Type</p>
                    <p className="font-semibold capitalize">{result.surfaceType}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Area</p>
                    <p className="font-semibold">{result.area} m²</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Coverage Rate</p>
                    <p className="font-semibold">{result.coverageRate} m²/L</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Coats Required</p>
                    <p className="font-semibold">{result.coatsRequired}</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Paint Requirements</h3>
                  <p className="text-green-800 text-lg font-bold">
                    {result.paintNeeded} {result.product.unit}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Estimated Cost</h3>
                  <p className="text-yellow-800 text-xl font-bold">
                    ₫{result.totalCost.toLocaleString()}
                  </p>
                </div>

                {result.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-sm">{result.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your project details and click Calculate to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
