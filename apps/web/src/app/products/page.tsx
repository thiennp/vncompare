'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import Pagination, { usePagination } from '@/components/Pagination';
import { useLogger } from '@/lib/logger';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  basePrice: number;
  originalPrice: number;
  coverageRate: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const { addItem } = useCart();
  const logger = useLogger('ProductsPage');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [priceSort, setPriceSort] = useState('');
  
  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    totalItems
  } = usePagination(filteredProducts, 12);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, brandFilter, priceSort]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    const startTime = Date.now();
    
    try {
      logger.info('Loading products');
      const response = await fetch('/api/v1/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        logger.info(`Loaded ${data.data.length} products`);
      } else {
        const errorMsg = 'Failed to load products';
        setError(errorMsg);
        logger.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'Error loading products';
      setError(errorMsg);
      logger.error(errorMsg, error as Error);
    } finally {
      const duration = Date.now() - startTime;
      logger.logPerformance('Load products', duration);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Brand filter
    if (brandFilter) {
      filtered = filtered.filter(product => product.brand === brandFilter);
    }

    // Price sort
    if (priceSort === 'low-high') {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (priceSort === 'high-low') {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    }

    setFilteredProducts(filtered);
  };

  const getUniqueCategories = () => {
    return Array.from(new Set(products.map(product => product.category))).filter(Boolean);
  };

  const getUniqueBrands = () => {
    return Array.from(new Set(products.map(product => product.brand))).filter(Boolean);
  };

  const addToCart = (product: Product) => {
    addItem(product, 1);
    logger.logUserAction('Add to cart', undefined, { productId: product.id, productName: product.name });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Products</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadProducts} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paint Products</h1>
          <p className="text-gray-600">Find the perfect paint for your project</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Brands</SelectItem>
                  {getUniqueBrands().map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceSort} onValueChange={setPriceSort}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Default</SelectItem>
                  <SelectItem value="low-high">Price: Low to High</SelectItem>
                  <SelectItem value="high-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setBrandFilter('');
                  setPriceSort('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                Showing {startIndex}-{endIndex} of {totalItems} products
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </p>
            </div>

            {/* Products Grid */}
            {paginatedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedItems.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</CardTitle>
                      <CardDescription className="mt-1">{product.brand}</CardDescription>
                    </div>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        ₫{product.basePrice?.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.basePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₫{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>Coverage: {product.coverageRate} m²/L</p>
                      <p>Unit: {product.unit}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/products/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('');
                      setBrandFilter('');
                      setPriceSort('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  className="justify-center"
                />
              </div>
            )}
          </div>
        </div>
      );
    }
