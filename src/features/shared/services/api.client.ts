// Client-side API service for making HTTP requests to the API server
const API_BASE_URL = 'http://localhost:3002/api';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Products
  async getProducts(filters: Record<string, unknown> = {}, page = 1, limit = 20) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/products?${params.toString()}`);
  }

  async getProductById(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: Record<string, unknown>) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Record<string, unknown>) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Suppliers
  async getSuppliers(filters: Record<string, unknown> = {}, page = 1, limit = 20) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/suppliers?${params.toString()}`);
  }

  async createSupplier(supplierData: Record<string, unknown>) {
    return this.request('/admin/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  }

  async updateSupplier(id: string, supplierData: Record<string, unknown>) {
    return this.request(`/admin/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData),
    });
  }

  async deleteSupplier(id: string) {
    return this.request(`/admin/suppliers/${id}`, {
      method: 'DELETE',
    });
  }

  // Reviews
  async getReviews(filters: Record<string, unknown> = {}, additionalFilters: Record<string, unknown> = {}, page = 1, limit = 20) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const allFilters = { ...filters, ...additionalFilters };
    Object.entries(allFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/reviews?${params.toString()}`);
  }

  // Users
  async getUsers(filters: Record<string, unknown> = {}, page = 1, limit = 20) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/users?${params.toString()}`);
  }

  async createUser(userData: Record<string, unknown>) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Record<string, unknown>) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(filters: Record<string, unknown> = {}, page = 1, limit = 20) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/orders?${params.toString()}`);
  }

  async getOrderById(id: string) {
    return this.request(`/orders/${id}`);
  }

  // Addresses
  async getAddresses(filters: Record<string, unknown> = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/addresses?${params.toString()}`);
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard-stats');
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: Record<string, unknown>) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Helper methods for auth services
  async findUserByEmail(email: string) {
    const result = await this.getUsers({ email }, 1, 1);
    return (result as { users: unknown[] }).users[0] || null;
  }

  async findUserById(id: string) {
    const result = await this.getUsers({ _id: id }, 1, 1);
    return (result as { users: unknown[] }).users[0] || null;
  }
}

export const api = new ApiService();
