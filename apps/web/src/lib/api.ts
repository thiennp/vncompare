const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
  currentPrice: number;
  discountPercentage?: number;
  images: string[];
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details: any[];
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
  avgPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  avgSavings?: number;
  topBrands?: string[];
  comparisonCount?: number;
  icon?: string;
  color?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Return the API response directly
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred',
          details: [],
        },
      };
    }
  }


  // Products API
  async getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
  } = {}): Promise<ApiResponse<ProductListResponse>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ProductListResponse>(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>(`/api/v1/products/${id}`);
  }

  async getFeaturedProducts(limit: number = 10): Promise<ApiResponse<{ products: Product[] }>> {
    return this.request<{ products: Product[] }>(`/api/v1/products/featured?limit=${limit}`);
  }

  async searchProducts(query: string, params: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  } = {}): Promise<ApiResponse<ProductListResponse>> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/products/search?${queryString}`;
    
    return this.request<ProductListResponse>(endpoint);
  }

  // Categories API
  async getCategories(): Promise<ApiResponse<{ categories: Category[] }>> {
    return this.request<{ categories: Category[] }>('/api/v1/categories');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/api/v1/health');
  }
}

export const apiService = new ApiService();
export default apiService;
