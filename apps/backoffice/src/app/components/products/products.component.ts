import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
            <tr *ngFor="let product of products">
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getProducts({ limit: 50, page: 1 }).subscribe({
      next: (response: ProductListResponse) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }


  addProduct(): void {
    console.log('Add product clicked');
  }

  viewProduct(product: ApiProduct): void {
    console.log('View product:', product);
  }

  editProduct(product: ApiProduct): void {
    console.log('Edit product:', product);
  }

  deleteProduct(product: ApiProduct): void {
    console.log('Delete product:', product);
  }
}