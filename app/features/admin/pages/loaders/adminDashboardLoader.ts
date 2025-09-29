import { db } from '../../../shared/services/database.server';
import { getUserByToken } from '../../../auth/services/getUserByToken.server';
import { redirect } from 'react-router';

// Admin dashboard loader
export async function adminDashboardLoader({ request }: { request: Request }) {
  try {
    // Get authenticated user by token
    const user = await getUserByToken(request);
    if (!user) {
      console.log(
        '❌ Admin dashboard loader - User not authenticated, redirecting to login'
      );
      throw redirect('/login');
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      console.log(
        '❌ Admin dashboard loader - User is not admin, redirecting to login'
      );
      throw redirect('/login');
    }

    console.log('✅ Admin dashboard loader - User authenticated:', user.email);

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
      user,
      stats,
      recentOrders,
    };
  } catch (error) {
    // If it's a redirect, re-throw it
    if (error instanceof Response) {
      throw error;
    }

    console.error('Error loading admin dashboard data:', error);
    // If there's an error, redirect to login as well
    throw redirect('/login');
  }
}
