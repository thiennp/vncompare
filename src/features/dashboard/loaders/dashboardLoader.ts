// Dashboard page loader
export async function dashboardLoader() {
  try {
    const response = await fetch('/api/dashboard');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
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
