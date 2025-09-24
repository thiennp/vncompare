import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EnvironmentService } from './environment.service';

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
  // Additional properties that might be needed
  type?: string;
  stock?: number;
  coverageRate?: number;
  imageUrl?: string;
  totalSales?: number;
  totalRevenue?: number;
  weeklySales?: number[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'USER' | 'SUPPLIER' | 'ADMIN';
  roles?: string[]; // Support both single role and array of roles
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
  // Additional properties that might be needed
  lastLoginAt?: string;
  ordersCount?: number;
  totalSpent?: number;
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
  companyName: string;
  description: string;
  logo: string | null;
  website: string | null;
  isVerified: boolean;
  rating: string | null;
  totalReviews: number;
  serviceAreas: string[];
  totalProducts: number;
  activeProducts: number;
  createdAt: string;
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
  newCustomers: number;
  productsSold: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  areasChange: number;
  customersChange: number;
  // Additional metrics for comprehensive dashboard
  totalUsers?: number;
  totalProducts?: number;
  activeSuppliers?: number;
  pendingOrders?: number;
  completedOrders?: number;
  cancelledOrders?: number;
  monthlyRevenue?: number;
  monthlyOrders?: number;
  monthlyUsers?: number;
  conversionRate?: number;
  averageOrderValue?: number;
  topSellingCategory?: string;
  recentActivity?: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
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
  private readonly baseUrl: string;
  private readonly isApiAvailable = true; // Set to true when API is deployed
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private environmentService: EnvironmentService) {
    // Get the appropriate API base URL based on environment
    this.baseUrl = this.environmentService.getApiBaseUrl();
    
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

    return this.http.get<ApiResponse<PaginatedResponse<User>>>(`${this.baseUrl}/test/users`, {
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

    // Temporarily use test endpoint until database is fully set up
    return this.http.get<ApiResponse<{suppliers: Supplier[], pagination: any}>>(`${this.baseUrl}/test/suppliers`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (response.success) {
          return {
            data: response.data.suppliers,
            pagination: response.data.pagination
          };
        }
        throw new Error(response.message || 'Failed to fetch suppliers');
      })
    );
  }

  createSupplier(payload: any): Observable<any> {
    // Temporarily use test endpoint until database is fully set up
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/test/suppliers`, payload, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to create supplier');
      })
    );
  }

  verifySupplier(id: string, verified: boolean = true): Observable<Supplier> {
    // Temporarily use test endpoint until database is fully set up
    return this.http.post<ApiResponse<{ supplier: Supplier }>>(`${this.baseUrl}/test/suppliers/${id}/verify`, { verified }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          // Some backends wrap supplier; normalize
          return (response.data as any).supplier ?? (response.data as any);
        }
        throw new Error(response.message || 'Failed to verify supplier');
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

    return this.http.get<ApiResponse<PaginatedResponse<Address>>>(`${this.baseUrl}/test/addresses`, {
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

  updateAddress(id: string, addressData: Partial<Address>): Observable<Address> {
    return this.http.patch<ApiResponse<Address>>(`${this.baseUrl}/addresses/${id}`, addressData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to update address');
      })
    );
  }

  deleteAddress(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/addresses/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return;
        }
        throw new Error(response.message || 'Failed to delete address');
      })
    );
  }

  createAddress(addressData: Partial<Address>): Observable<Address> {
    return this.http.post<ApiResponse<Address>>(`${this.baseUrl}/test/addresses`, addressData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to create address');
      })
    );
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/test/users`, userData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to create user');
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

  getAnalyticsChartData(period: string): Observable<{
    revenueData: number[];
    ordersData: number[];
    labels: string[];
  }> {
    return this.http.get<ApiResponse<{
      revenueData: number[];
      ordersData: number[];
      labels: string[];
    }>>(`${this.baseUrl}/analytics/chart-data?period=${period}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch chart data');
      })
    );
  }

  getRegionalAnalytics(): Observable<{
    regions: Array<{
      name: string;
      orders: number;
      revenue: number;
    }>;
  }> {
    return this.http.get<ApiResponse<{
      regions: Array<{
        name: string;
        orders: number;
        revenue: number;
      }>;
    }>>(`${this.baseUrl}/analytics/regional`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch regional analytics');
      })
    );
  }

  // Additional API methods for complete functionality
  
  // Dashboard methods
  getDashboardMetrics(): Observable<{
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalSuppliers: number;
    totalReviews: number;
    revenueGrowth: number;
    ordersGrowth: number;
    productsGrowth: number;
    usersGrowth: number;
    pendingReviews: number;
    lowStockProducts: number;
    pendingSuppliers: number;
  }> {
    return this.http.get<ApiResponse<{
      totalRevenue: number;
      totalOrders: number;
      totalProducts: number;
      totalUsers: number;
      totalSuppliers: number;
      totalReviews: number;
      revenueGrowth: number;
      ordersGrowth: number;
      productsGrowth: number;
      usersGrowth: number;
      pendingReviews: number;
      lowStockProducts: number;
      pendingSuppliers: number;
    }>>(`${this.baseUrl}/dashboard/metrics`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch dashboard metrics');
      })
    );
  }

  // Supplier document methods
  getSupplierDocuments(supplierId: string): Observable<Array<{
    id: string;
    type: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
    status: string;
  }>> {
    return this.http.get<ApiResponse<Array<{
      id: string;
      type: string;
      fileName: string;
      fileUrl: string;
      uploadedAt: string;
      status: string;
    }>>>(`${this.baseUrl}/suppliers/${supplierId}/documents`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch supplier documents');
      })
    );
  }

  // Product review methods
  getProductReviews(productId: string): Observable<Array<{
    id: string;
    productId: string;
    customerName: string;
    rating: number;
    title: string;
    comment: string;
    status: string;
    createdAt: string;
  }>> {
    return this.http.get<ApiResponse<Array<{
      id: string;
      productId: string;
      customerName: string;
      rating: number;
      title: string;
      comment: string;
      status: string;
      createdAt: string;
    }>>>(`${this.baseUrl}/products/${productId}/reviews`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch product reviews');
      })
    );
  }

  // User order methods
  getUserOrders(userId: string): Observable<Array<{
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>> {
    return this.http.get<ApiResponse<Array<{
      id: string;
      customerName: string;
      totalAmount: number;
      status: string;
      createdAt: string;
    }>>>(`${this.baseUrl}/users/${userId}/orders`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch user orders');
      })
    );
  }

  // Address order methods
  getAddressOrders(addressId: string): Observable<Array<{
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>> {
    return this.http.get<ApiResponse<Array<{
      id: string;
      customerName: string;
      totalAmount: number;
      status: string;
      createdAt: string;
    }>>>(`${this.baseUrl}/addresses/${addressId}/orders`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch address orders');
      })
    );
  }

  // Settings methods
  getSystemSettings(): Observable<{
    general: any;
    business: any;
    shipping: any;
    notifications: any;
    security: any;
  }> {
    return this.http.get<ApiResponse<{
      general: any;
      business: any;
      shipping: any;
      notifications: any;
      security: any;
    }>>(`${this.baseUrl}/settings`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch system settings');
      })
    );
  }

  updateSystemSettings(settings: any): Observable<any> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/settings`, settings, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to update system settings');
      })
    );
  }

  // Additional missing methods
  
  // Address methods - single address
  getAddress(id: string): Observable<Address> {
    return this.http.get<ApiResponse<Address>>(`${this.baseUrl}/addresses/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch address');
      })
    );
  }

  // Analytics methods - simplified
  getAnalytics(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/analytics`, {
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

  // Review methods - single review
  getReview(id: string): Observable<Review> {
    return this.http.get<ApiResponse<Review>>(`${this.baseUrl}/reviews/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch review');
      })
    );
  }

  // Settings methods - simplified
  getSettings(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/settings`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch settings');
      })
    );
  }

  resetSettings(): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/settings/reset`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to reset settings');
      })
    );
  }
  
  // Product methods
  toggleProductStatus(id: string): Observable<Product> {
    return this.http.patch<ApiResponse<Product>>(`${this.baseUrl}/products/${id}/toggle-status`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to toggle product status');
      })
    );
  }

  // Supplier methods
  getSupplier(id: string): Observable<Supplier> {
    return this.http.get<ApiResponse<Supplier>>(`${this.baseUrl}/suppliers/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch supplier');
      })
    );
  }

  deleteSupplier(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/suppliers/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to delete supplier');
      })
    );
  }

  // User methods
  getUser(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/users/${id}`, {
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

  deleteUser(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/users/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to delete user');
      })
    );
  }

  // Error handling utility
  handleError(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.status === 401) {
      return 'Authentication required. Please log in again.';
    }
    if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
  }

  // Utility methods
  isAuthenticated(): boolean {
    return this.tokenSubject.value !== null;
  }

  isApiReady(): boolean {
    return this.isApiAvailable;
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
