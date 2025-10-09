// Simple database service for client-side routes
// This is a placeholder that returns mock data
// In a real application, these would be replaced with actual API calls

export const db = {
  async getProducts() {
    return { products: [], total: 0 };
  },

  async getProductById() {
    return null;
  },

  async getSuppliers() {
    return { suppliers: [], total: 0 };
  },

  async getReviews() {
    return { reviews: [], total: 0 };
  },

  async getOrders() {
    return { orders: [], total: 0 };
  },

  async getOrderById() {
    return null;
  },

  async getAddresses() {
    return [];
  },

  async getDashboardStats() {
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
    };
  },

  async getProvinces() {
    return [];
  },

  async getDistricts() {
    return [];
  },

  async getWards() {
    return [];
  },

  // Admin methods
  async createUser() {
    return null;
  },

  async updateUser() {
    return null;
  },

  async deleteUser() {
    return null;
  },

  async createProduct() {
    return null;
  },

  async updateProduct() {
    return null;
  },

  async deleteProduct() {
    return null;
  },

  async createSupplier() {
    return null;
  },

  async updateSupplier() {
    return null;
  },

  async deleteSupplier() {
    return null;
  },
};
