import type { LoaderFunctionArgs } from 'react-router-dom';
import { db } from '../../../../shared/services/database.server';

// Admin products page loader
export async function adminProductsLoader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    // Get all products from database (admin can see all)
    const { products, total } = await db.getProducts({}, page, 20);

    return {
      products,
      total,
      page,
    };
  } catch (error) {
    console.error('Error loading admin products data:', error);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      products: [],
      total: 0,
      page,
    };
  }
}
