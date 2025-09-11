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

  // Analytics methods (Admin only)
  getDashboardAnalytics(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/analytics/dashboard`, {
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
