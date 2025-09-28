import { db } from '../../shared/services/database.server';

// Dashboard page loader
export async function dashboardLoader() {
  try {
    // Get dashboard statistics
    const { products } = await db.getProducts({}, 1, 1000);
    const { orders } = await db.getOrders(undefined, {}, 1, 1000);
    const { users } = await db.getUsers({}, 1, 1000);
    const { suppliers } = await db.getSuppliers({}, 1, 1000);

    const stats = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      ),
      activeProducts: products.filter(p => p.isActive).length,
      verifiedSuppliers: suppliers.filter(s => s.isVerified).length,
    };

    // Get recent orders (last 5)
    const recentOrders = orders
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    // Get user addresses (mock data for now)
    const addresses = [
      {
        _id: '1',
        name: 'Nhà riêng',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '0123456789',
        isDefault: true,
      },
    ];

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
