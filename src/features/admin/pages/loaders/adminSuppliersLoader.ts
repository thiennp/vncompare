import type { LoaderFunctionArgs } from 'react-router-dom';
import { db } from '../../../shared/services/database.client';

// Admin suppliers page loader
export async function adminSuppliersLoader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    // Get all suppliers from database (admin can see all)
    const { suppliers, total } = await db.getSuppliers({}, page, 20);

    return {
      suppliers,
      total,
      page,
    };
  } catch (error) {
    console.error('Error loading admin suppliers data:', error);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      suppliers: [],
      total: 0,
      page,
    };
  }
}