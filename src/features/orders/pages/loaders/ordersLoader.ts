import type { LoaderFunctionArgs } from 'react-router-dom';
import { db } from '../../../shared/services/database.server';

// Orders page loader
export async function ordersLoader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    // Build filters for database query
    const filters: Record<string, unknown> = {};
    if (status) {
      filters.status = status;
    }

    // Get orders from database
    const { orders, total } = await db.getOrders(undefined, filters, page, 20);

    return {
      orders,
      total,
      status,
      page,
    };
  } catch (error) {
    console.error('Error loading orders data:', error);
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      orders: [],
      total: 0,
      status,
      page,
    };
  }
}
