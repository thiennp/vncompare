import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const API_BASE_URL = 'http://localhost:8000/index.php';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeSuppliers: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: Date;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    tension?: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }

  // Dashboard API
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.baseUrl}/api/v1/analytics/dashboard`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Failed to load dashboard stats');
        }),
        catchError(this.handleError)
      );
  }

  getRecentOrders(limit: number = 5): Observable<RecentOrder[]> {
    return this.http.get<ApiResponse<{ orders: RecentOrder[] }>>(`${this.baseUrl}/api/v1/orders?limit=${limit}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.orders;
          }
          throw new Error(response.error?.message || 'Failed to load recent orders');
        }),
        catchError(this.handleError)
      );
  }

  getSalesChartData(): Observable<ChartData> {
    return this.http.get<ApiResponse<ChartData>>(`${this.baseUrl}/api/v1/analytics/sales-chart`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Failed to load sales chart data');
        }),
        catchError(this.handleError)
      );
  }

  getProductsChartData(): Observable<ChartData> {
    return this.http.get<ApiResponse<ChartData>>(`${this.baseUrl}/api/v1/analytics/products-chart`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Failed to load products chart data');
        }),
        catchError(this.handleError)
      );
  }

  // Products API
  getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    search?: string;
  } = {}): Observable<{ products: any[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/products${queryString ? `?${queryString}` : ''}`;
    
    return this.http.get<ApiResponse<{ products: any[]; pagination: any }>>(`${this.baseUrl}${endpoint}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Failed to load products');
        }),
        catchError(this.handleError)
      );
  }

  // Orders API
  getOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}): Observable<{ orders: any[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/orders${queryString ? `?${queryString}` : ''}`;
    
    return this.http.get<ApiResponse<{ orders: any[]; pagination: any }>>(`${this.baseUrl}${endpoint}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Failed to load orders');
        }),
        catchError(this.handleError)
      );
  }

  // Users API
  getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  } = {}): Observable<{ users: any[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/users${queryString ? `?${queryString}` : ''}`;
    
    return this.http.get<ApiResponse<{ users: any[]; pagination: any }>>(`${this.baseUrl}${endpoint}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Failed to load users');
        }),
        catchError(this.handleError)
      );
  }
}
