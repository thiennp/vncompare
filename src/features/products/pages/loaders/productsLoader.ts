import type { LoaderFunctionArgs } from 'react-router-dom';
import { db } from '../../../shared/services/database.server';
import type { Product } from '../../../shared/types';

// Type guard for valid categories
function isValidCategory(category: string): category is Product['category'] {
  return [
    'Sơn ngoại thất',
    'Sơn nội thất',
    'Sơn lót',
    'Sơn bóng',
    'Sơn màu',
    'Sơn chống thấm',
  ].includes(category);
}

// Products page loader
export async function productsLoader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    // Build filters for database query
    const filters: Record<string, unknown> = { isActive: true };
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && isValidCategory(category)) {
      filters.category = category;
    }

    // Get products from database
    const { products: dbProducts, total } = await db.getProducts(
      filters,
      page,
      20
    );

    // Transform database products to frontend format
    const products: Product[] = dbProducts.map(product => ({
      _id: product._id,
      name: product.name,
      brand: product.brand || 'Unknown',
      category:
        product.category && isValidCategory(product.category)
          ? product.category
          : 'Sơn nội thất',
      description: product.description,
      price: product.basePrice || 0,
      unit: product.unit || 'liter',
      coverage: product.coverageRate || 10,
      isActive: product.isActive,
      createdAt: product.createdAt,
      images: [],
      specifications: {},
    }));

    return {
      products,
      total,
      search,
      category,
      page,
    };
  } catch (error) {
    console.error('Error loading products data:', error);
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      products: [],
      total: 0,
      search,
      category,
      page,
    };
  }
}
