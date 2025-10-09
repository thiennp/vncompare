import { db } from '../../../../features/shared/services/database.client';

// Admin dashboard page loader
export async function adminDashboardLoader() {
  try {
    // Get dashboard statistics
    const stats = await db.getDashboardStats();

    return {
      stats,
    };
  } catch (error) {
    console.error('Error loading admin dashboard data:', error);

    return {
      stats: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalSuppliers: 0,
        totalRevenue: 0,
      },
    };
  }
}