// Database service for client-side routes
// Calls the API server for all operations

const API_BASE_URL = 'http://localhost:3001/api';

export const db = {
  async getProducts(filters = {}, page = 1, limit = 20) {
    try {
      const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: [], total: 0 };
    }
  },

  async getProductById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
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

  async createProduct(productData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, productData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
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
