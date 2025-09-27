// Admin dashboard loader
export async function adminDashboardLoader() {
  return {
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
    },
    recentOrders: [],
  };
}
