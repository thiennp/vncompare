import { db } from '../../../../shared/services/database.server';

// Admin dashboard loader
export async function adminDashboardLoader() {
  try {
    // Get all data for admin dashboard
    const { products } = await db.getProducts({}, 1, 1000);
    const { orders } = await db.getOrders(undefined, {}, 1, 1000);
    const { users } = await db.getUsers({}, 1, 1000);
    const { suppliers } = await db.getSuppliers({}, 1, 1000);
    const { reviews } = await db.getReviews(undefined, {}, 1, 1000);

    const stats = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalSuppliers: suppliers.length,
      totalRevenue: orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      ),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      pendingReviews: reviews.filter(review => review.status === 'pending')
        .length,
    };

    // Get recent orders (last 10)
    const recentOrders = orders
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    return {
      stats,
      recentOrders,
    };
  } catch (error) {
    console.error('Error loading admin dashboard data:', error);
    return {
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalSuppliers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        pendingReviews: 0,
      },
      recentOrders: [],
    };
  }
}
