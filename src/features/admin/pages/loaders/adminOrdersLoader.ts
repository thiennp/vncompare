import type { LoaderFunctionArgs } from 'react-router-dom';
import { db } from '../../../shared/services/database.server';

// Admin orders page loader
export async function adminOrdersLoader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    // Get all orders from database (admin can see all)
    const { orders, total } = await db.getOrders(undefined, {}, page, 20);

    return {
      orders,
      total,
      page,
    };
  } catch (error) {
    console.error('Error loading admin orders data:', error);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      orders: [],
      total: 0,
      page,
    };
  }
}
