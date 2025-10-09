import { db } from '../../../../features/shared/services/database.client';

// Admin dashboard page loader
export async function adminDashboardLoader() {
  try {
    // Get dashboard statistics
    const stats = await db.getDashboardStats();

    return {
      stats: {
        ...stats,
        pendingOrders: 0, // TODO: Calculate from orders with pending status
        pendingReviews: 0, // TODO: Calculate from reviews with pending status
      },
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
        pendingOrders: 0,
        pendingReviews: 0,
      },
    };
  }
}