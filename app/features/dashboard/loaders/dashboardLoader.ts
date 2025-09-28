import { db } from '../../shared/services/database.server';
import { redirect } from 'react-router';

// Dashboard page loader
export async function dashboardLoader() {
  try {
    // Get dashboard statistics
    const { products } = await db.getProducts({}, 1, 1000);
    const { orders } = await db.getOrders(undefined, {}, 1, 1000);
    const { users } = await db.getUsers({}, 1, 1000);
    const { suppliers } = await db.getSuppliers({}, 1, 1000);

    // Get recent orders (last 5)
    const recentOrders = orders
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    return {
      users,
      products,
      recentOrders,
      suppliers,
    };
  } catch (error) {
    // If it's a redirect, re-throw it
    if (error instanceof Response) {
      throw error;
    }

    console.error('Error loading dashboard data:', error);
    // If there's an error, redirect to login as well
    throw redirect('/login');
  }
}
