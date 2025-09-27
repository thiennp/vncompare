import { db } from '../features/shared/services/database.server';

export async function getDashboardData() {
  try {
    // Get dashboard stats
    const stats = await db.getDashboardStats();

    // Get recent orders (last 5)
    const { orders: recentOrders } = await db.getOrders(undefined, {}, 1, 5);

    // Get user addresses (this would need user ID from auth)
    // For now, return empty array
    const addresses: any[] = [];

    return {
      stats,
      recentOrders,
      addresses,
    };
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return {
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        activeProducts: 0,
        verifiedSuppliers: 0,
      },
      recentOrders: [],
      addresses: [],
    };
  }
}
