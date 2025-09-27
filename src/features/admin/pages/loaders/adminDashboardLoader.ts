// Admin dashboard loader
export async function adminDashboardLoader() {
  try {
    const response = await fetch('/api/admin/dashboard');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
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
