import type { LoaderFunctionArgs } from 'react-router-dom';
import { db } from '../../../shared/services/database.client';

// Admin agencies page loader
export async function adminAgenciesLoader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const level = url.searchParams.get('level');

    const filters: Record<string, string> = {};
    if (level) {
      filters.level = level;
    }

    // Get all agencies from database (admin can see all)
    const { agencies, total } = await db.getAgencies(filters, page, 100);

    // Also fetch suppliers for parent selection
    const { suppliers } = await db.getSuppliers({}, 1, 100);

    return {
      agencies,
      suppliers,
      total,
      page,
    };
  } catch (error) {
    console.error('Error loading admin agencies data:', error);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      agencies: [],
      suppliers: [],
      total: 0,
      page,
    };
  }
}
