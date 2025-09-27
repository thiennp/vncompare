import { db } from '../features/shared/services/database.server';

export async function getOrdersData(status = '', page = 1, limit = 20) {
  try {
    // Build filters
    const filters: Record<string, unknown> = {};
    if (status) {
      filters.status = status;
    }

    // Fetch orders from database
    const { orders, total } = await db.getOrders(
      undefined,
      filters,
      page,
      limit
    );

    return {
      orders,
      total,
      status,
      page,
    };
  } catch (error) {
    console.error('Error loading orders data:', error);
    return {
      orders: [],
      total: 0,
      status,
      page,
    };
  }
}

export async function getOrderDetailData(orderId: string) {
  try {
    const order = await db.getOrderById(orderId);
    return { order };
  } catch (error) {
    console.error('Error loading order detail:', error);
    return { order: null };
  }
}
