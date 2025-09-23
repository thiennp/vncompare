import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Product as ApiProduct, ProductListResponse } from '../../services/api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Product Management</h1>
          <p>Manage your paint products, categories, and inventory</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="loadProducts()" [disabled]="loading">
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
          <button class="btn btn-primary" (click)="addProduct()">
            ➕ Add Product
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="error">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
          <button class="btn btn-sm btn-outline" (click)="loadProducts()">Retry</button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section" *ngIf="!loading || products.length > 0">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search products..." 
            [(ngModel)]="searchTerm"
            (input)="filterProducts()"
            class="search-input">
        </div>
        <div class="filter-controls">
          <select [(ngModel)]="categoryFilter" (change)="filterProducts()" class="filter-select">
            <option value="">All Categories</option>
            <option value="Interior Paint">Interior Paint</option>
            <option value="Exterior Paint">Exterior Paint</option>
            <option value="Primer">Primer</option>
            <option value="Specialty Paint">Specialty Paint</option>
          </select>
          <select [(ngModel)]="brandFilter" (change)="filterProducts()" class="filter-select">
            <option value="">All Brands</option>
            <option value="Dulux">Dulux</option>
            <option value="Jotun">Jotun</option>
            <option value="Kova">Kova</option>
            <option value="Nippon">Nippon</option>
          </select>
          <select [(ngModel)]="statusFilter" (change)="filterProducts()" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button class="btn btn-outline" (click)="clearFilters()">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading && !error">
        <div class="loading-spinner"></div>
        <p>Loading products...</p>
      </div>

      <!-- Products Table -->
      <div class="table-container" *ngIf="!loading || products.length > 0">
        <table class="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of filteredProducts">
              <td class="product-cell">
                <div class="product-info">
                  <div class="product-image">
                    <img [src]="product.images[0] || '/assets/placeholder-product.png'" [alt]="product.name" onerror="this.src='/assets/placeholder-product.png'">
                  </div>
                  <div class="product-details">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-sku">SKU: {{ product.sku }}</div>
                    <div class="product-color">{{ product.color }} - {{ product.finish }}</div>
                  </div>
                </div>
              </td>
              <td>{{ product.brand }}</td>
              <td>{{ product.category.name || 'N/A' }}</td>
              <td class="price-cell">₫{{ product.price | number }}</td>
              <td class="rating-cell">
                <div class="rating">
                  <span class="stars">⭐</span>
                  <span class="rating-value">{{ product.rating || 0 }}</span>
                  <span class="reviews-count">({{ product.totalReviews || 0 }})</span>
                </div>
              </td>
              <td>
                <span class="status-badge" [class]="product.isActive ? 'active' : 'inactive'">
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="btn-icon" (click)="viewProduct(product)" title="View">
                    👁️
                  </button>
                  <button class="btn-icon" (click)="editProduct(product)" title="Edit">
                    ✏️
                  </button>
                  <button class="btn-icon" (click)="deleteProduct(product)" title="Delete">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header-content h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .header-content p {
      color: #64748b;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      padding: 20px;
      background: var(--ios-system-background);
      border-radius: var(--ios-radius-2xl);
      border: 0.5px solid var(--ios-opaque-separator);
      box-shadow: var(--ios-shadow-sm);
    }

    .search-box {
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 0.5px solid var(--ios-opaque-separator);
      border-radius: var(--ios-radius-lg);
      font-size: 15px;
      font-family: var(--ios-font-family);
      background-color: var(--ios-system-background);
      color: var(--ios-label);
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--ios-system-blue);
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }

    .search-input::placeholder {
      color: var(--ios-placeholder-text);
    }

    .filter-controls {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .filter-select {
      padding: 12px 16px;
      border: 0.5px solid var(--ios-opaque-separator);
      border-radius: var(--ios-radius-lg);
      background: var(--ios-system-background);
      font-size: 15px;
      font-family: var(--ios-font-family);
      color: var(--ios-label);
      min-width: 150px;
      transition: all 0.2s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--ios-system-blue);
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }

    .error-message {
      background: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .error-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .error-icon {
      font-size: 1.25rem;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #3730a3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table th {
      background: #f8fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }

    .products-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
    }

    .product-cell {
      min-width: 300px;
    }

    .product-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .product-image {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-details {
      flex: 1;
    }

    .product-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .product-sku {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 2px;
    }

    .product-color {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .price-cell {
      font-weight: 600;
      color: #059669;
    }

    .rating-cell {
      min-width: 120px;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stars {
      font-size: 0.875rem;
    }

    .rating-value {
      font-weight: 600;
      color: #1e293b;
    }

    .reviews-count {
      font-size: 0.75rem;
      color: #64748b;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #059669;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    .actions-cell {
      min-width: 120px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .btn {
      padding: 8px 16px;
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-outline {
      background-color: transparent;
      border-color: #d1d5db;
      color: #374151;
    }

    .btn-outline:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-outline:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #3730a3;
      color: white;
      border-color: #3730a3;
    }

    .btn-primary:hover {
      background-color: #312e81;
      border-color: #312e81;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .products-page {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .filters-section {
        flex-direction: column;
        gap: 12px;
      }

      .filter-controls {
        flex-wrap: wrap;
        gap: 8px;
      }

      .filter-select {
        min-width: 120px;
        flex: 1;
      }

      .products-table {
        font-size: 14px;
      }

      .products-table th,
      .products-table td {
        padding: 8px;
      }

      .action-buttons {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  loading = false;
  error: string | null = null;
  products: ApiProduct[] = [];
  filteredProducts: ApiProduct[] = [];
  
  // Filter properties
  searchTerm = '';
  categoryFilter = '';
  brandFilter = '';
  statusFilter = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getProducts({ limit: 50, page: 1 }).subscribe({
      next: (response: ProductListResponse) => {
        this.products = response.products;
        this.filteredProducts = [...this.products];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
        // Load mock data as fallback
        this.loadMockData();
      }
    });
  }

  loadMockData(): void {
    this.products = [
      {
        id: 'PROD-001',
        name: 'Dulux Weathershield Exterior Paint',
        description: 'High-quality exterior paint with excellent weather resistance',
        brand: 'Dulux',
        category: { id: '1', name: 'Exterior Paint', slug: 'exterior-paint' },
        supplier: { id: 'SUP-001', companyName: 'Dulux Vietnam', rating: 4.8 },
        sku: 'DLX-WS-001',
        color: 'White',
        finish: 'Matte',
        coverage: 12,
        volume: 1,
        price: 1250000,
        discountPrice: 1100000,
        images: ['https://example.com/dulux-weathershield.jpg'],
        rating: 4.5,
        totalReviews: 23,
        isFeatured: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'PROD-002',
        name: 'Jotun Lady Interior Paint',
        description: 'Premium interior paint with easy application and washable finish',
        brand: 'Jotun',
        category: { id: '2', name: 'Interior Paint', slug: 'interior-paint' },
        supplier: { id: 'SUP-002', companyName: 'Jotun Vietnam', rating: 4.5 },
        sku: 'JTN-LD-001',
        color: 'Blue',
        finish: 'Satin',
        coverage: 15,
        volume: 1,
        price: 850000,
        images: ['https://example.com/jotun-lady.jpg'],
        rating: 4.2,
        totalReviews: 15,
        isFeatured: false,
        isActive: true,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-14T14:20:00Z'
      },
      {
        id: 'PROD-003',
        name: 'Kova Premium Primer',
        description: 'High-adhesion primer for all surfaces',
        brand: 'Kova',
        category: { id: '3', name: 'Primer', slug: 'primer' },
        supplier: { id: 'SUP-003', companyName: 'Kova Paint', rating: 4.9 },
        sku: 'KVA-PR-001',
        color: 'White',
        finish: 'Matte',
        coverage: 18,
        volume: 1,
        price: 650000,
        images: ['https://example.com/kova-primer.jpg'],
        rating: 4.7,
        totalReviews: 8,
        isFeatured: false,
        isActive: true,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-15T09:15:00Z'
      }
    ];
    this.filteredProducts = [...this.products];
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.color.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.categoryFilter || 
        (product.category && product.category.name === this.categoryFilter);
      
      const matchesBrand = !this.brandFilter || product.brand === this.brandFilter;
      
      const matchesStatus = !this.statusFilter || 
        (this.statusFilter === 'active' && product.isActive) ||
        (this.statusFilter === 'inactive' && !product.isActive);
      
      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.brandFilter = '';
    this.statusFilter = '';
    this.filteredProducts = [...this.products];
  }


  addProduct(): void {
    this.router.navigate(['/products/add']);
  }

  viewProduct(product: ApiProduct): void {
    // Navigate to product detail view
    this.router.navigate(['/products', product.id]);
  }

  editProduct(product: ApiProduct): void {
    // Navigate to edit product page
    this.router.navigate(['/products', product.id, 'edit']);
  }

  deleteProduct(product: ApiProduct): void {
    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      this.apiService.deleteProduct(product.id).subscribe({
        next: () => {
          // Remove product from local array
          this.products = this.products.filter(p => p.id !== product.id);
          this.filteredProducts = this.filteredProducts.filter(p => p.id !== product.id);
          console.log('Product deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  toggleProductStatus(product: ApiProduct): void {
    this.apiService.toggleProductStatus(product.id).subscribe({
      next: (updatedProduct) => {
        // Update product in local array
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
          this.filteredProducts = [...this.products];
        }
        console.log('Product status updated successfully');
      },
      error: (error) => {
        console.error('Error updating product status:', error);
        alert('Failed to update product status: ' + this.apiService.handleError(error));
      }
    });
  }
}