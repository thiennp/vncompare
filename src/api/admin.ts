import { db } from '../features/shared/services/database.server';

export async function getAdminDashboardData() {
  try {
    const stats = await db.getDashboardStats();

    // Get recent orders (last 10)
    const { orders: recentOrders } = await db.getOrders(undefined, {}, 1, 10);

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

export async function getAdminProductsData(page = 1, limit = 20) {
  try {
    const { products, total } = await db.getProducts({}, page, limit);
    return { products, total, page };
  } catch (error) {
    console.error('Error loading admin products data:', error);
    return { products: [], total: 0, page };
  }
}

export async function getAdminOrdersData(page = 1, limit = 20) {
  try {
    const { orders, total } = await db.getOrders(undefined, {}, page, limit);
    return { orders, total, page };
  } catch (error) {
    console.error('Error loading admin orders data:', error);
    return { orders: [], total: 0, page };
  }
}

export async function getAdminUsersData(page = 1, limit = 20) {
  try {
    const { users, total } = await db.getUsers({}, page, limit);
    return { users, total, page };
  } catch (error) {
    console.error('Error loading admin users data:', error);
    return { users: [], total: 0, page };
  }
}

export async function getAdminSuppliersData(page = 1, limit = 20) {
  try {
    const { suppliers, total } = await db.getSuppliers({}, page, limit);
    return { suppliers, total, page };
  } catch (error) {
    console.error('Error loading admin suppliers data:', error);
    return { suppliers: [], total: 0, page };
  }
}

export async function getAdminReviewsData(page = 1, limit = 20) {
  try {
    const { reviews, total } = await db.getReviews(undefined, {}, page, limit);
    return { reviews, total, page };
  } catch (error) {
    console.error('Error loading admin reviews data:', error);
    return { reviews: [], total: 0, page };
  }
}
