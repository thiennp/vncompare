import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  supplier: {
    id: string;
    companyName: string;
    rating: number;
  };
  sku: string;
  color: string;
  finish: string;
  coverage: number;
  volume: number;
  price: number;
  discountPrice?: number;
  images: string[];
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'USER' | 'SUPPLIER' | 'ADMIN';
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    categories: any[];
    brands: any[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  id: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  postalCode: string;
  isServiceArea: boolean;
  deliveryFee: number;
  estimatedDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  status: 'pending' | 'verified' | 'suspended' | 'rejected';
  productsCount: number;
  totalRevenue: number;
  rating: number;
  joinedAt: string;
  lastActiveAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  helpful: number;
  verified: boolean;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  serviceAreas: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  areasChange: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8000/api/v1';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token in localStorage
    const savedToken = localStorage.getItem('vncompare_token');
    if (savedToken) {
      this.tokenSubject.next(savedToken);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.tokenSubject.value;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-Version': 'v1',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Authentication methods
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        map(response => {
          if (response.success) {
            this.tokenSubject.next(response.data.token);
            localStorage.setItem('vncompare_token', response.data.token);
            localStorage.setItem('vncompare_user', JSON.stringify(response.data.user));
            return response.data;
          }
          throw new Error(response.message || 'Login failed');
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/auth/logout`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        this.tokenSubject.next(null);
        localStorage.removeItem('vncompare_token');
        localStorage.removeItem('vncompare_user');
        return response;
      }),
      catchError(error => {
        // Even if logout fails on server, clear local data
        this.tokenSubject.next(null);
        localStorage.removeItem('vncompare_token');
        localStorage.removeItem('vncompare_user');
        throw error;
      })
    );
  }

  refreshToken(): Observable<{ token: string; expiresAt: string }> {
    return this.http.post<ApiResponse<{ token: string; expiresAt: string }>>(`${this.baseUrl}/auth/refresh`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.tokenSubject.next(response.data.token);
          localStorage.setItem('vncompare_token', response.data.token);
          return response.data;
        }
        throw new Error(response.message || 'Token refresh failed');
      })
    );
  }

  // Product methods
  getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    color?: string;
    finish?: string;
    search?: string;
    sort?: string;
    supplier?: string;
  }): Observable<ProductListResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<ProductListResponse>>(`${this.baseUrl}/products`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch products');
      })
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch product');
      })
    );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/products`, product, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to create product');
      })
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`, product, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to update product');
      })
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/products/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to delete product');
      })
    );
  }

  // User methods
  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/users/me`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch user');
      })
    );
  }

  // Order methods
  getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Observable<PaginatedResponse<Order>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Order>>>(`${this.baseUrl}/orders`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch orders');
      })
    );
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/orders/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch order');
      })
    );
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<ApiResponse<Order>>(`${this.baseUrl}/orders/${id}/status`, { status }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to update order status');
      })
    );
  }

  // User management methods
  getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Observable<PaginatedResponse<User>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<User>>>(`${this.baseUrl}/users`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch users');
      })
    );
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/users/${id}`, user, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to update user');
      })
    );
  }

  toggleUserStatus(id: string): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/users/${id}/toggle-status`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to toggle user status');
      })
    );
  }

  // Supplier methods
  getSuppliers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    rating?: number;
    search?: string;
  }): Observable<PaginatedResponse<Supplier>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Supplier>>>(`${this.baseUrl}/suppliers`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch suppliers');
      })
    );
  }

  updateSupplierStatus(id: string, status: string): Observable<Supplier> {
    return this.http.patch<ApiResponse<Supplier>>(`${this.baseUrl}/suppliers/${id}/status`, { status }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to update supplier status');
      })
    );
  }

  // Address methods
  getAddresses(params?: {
    page?: number;
    limit?: number;
    province?: string;
    serviceArea?: boolean;
    search?: string;
  }): Observable<PaginatedResponse<Address>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Address>>>(`${this.baseUrl}/addresses`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch addresses');
      })
    );
  }

  updateAddressServiceArea(id: string, isServiceArea: boolean): Observable<Address> {
    return this.http.patch<ApiResponse<Address>>(`${this.baseUrl}/addresses/${id}/service-area`, { isServiceArea }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to update address service area');
      })
    );
  }

  // Review methods
  getReviews(params?: {
    page?: number;
    limit?: number;
    status?: string;
    rating?: number;
    search?: string;
  }): Observable<PaginatedResponse<Review>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Review>>>(`${this.baseUrl}/reviews`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch reviews');
      })
    );
  }

  updateReviewStatus(id: string, status: string): Observable<Review> {
    return this.http.patch<ApiResponse<Review>>(`${this.baseUrl}/reviews/${id}/status`, { status }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to update review status');
      })
    );
  }

  // Analytics methods (Admin only)
  getDashboardAnalytics(): Observable<DashboardMetrics> {
    return this.http.get<ApiResponse<DashboardMetrics>>(`${this.baseUrl}/analytics/dashboard`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch analytics');
      })
    );
  }

  getRevenueAnalytics(period: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/analytics/revenue?period=${period}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch revenue analytics');
      })
    );
  }

  getTopProducts(limit: number = 10): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/analytics/top-products?limit=${limit}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch top products');
      })
    );
  }

  // Utility methods
  isAuthenticated(): boolean {
    return this.tokenSubject.value !== null;
  }

  getCurrentToken(): string | null {
    return this.tokenSubject.value;
  }

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('vncompare_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        return null;
      }
    }
    return null;
  }
}
