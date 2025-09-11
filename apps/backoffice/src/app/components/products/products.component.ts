import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  type: 'Interior' | 'Exterior' | 'Specialty' | 'Industrial' | 'Decorative' | 'Eco-friendly';
  price: number;
  stock: number;
  coverageRate: number; // m²/liter
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

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
          <button class="btn btn-outline" (click)="exportProducts()">
            📤 Export
          </button>
          <button class="btn btn-primary" (click)="addProduct()">
            ➕ Add Product
          </button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search products..." 
            [(ngModel)]="searchTerm"
            (input)="filterProducts()"
            class="search-input">
        </div>
        <div class="filter-controls">
          <select [(ngModel)]="selectedCategory" (change)="filterProducts()" class="filter-select">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>
          <select [(ngModel)]="selectedType" (change)="filterProducts()" class="filter-select">
            <option value="">All Types</option>
            <option *ngFor="let type of productTypes" [value]="type">
              {{ type }}
            </option>
          </select>
          <select [(ngModel)]="stockFilter" (change)="filterProducts()" class="filter-select">
            <option value="">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <!-- Products Table -->
      <div class="products-table-container">
        <table class="products-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" [(ngModel)]="selectAll" (change)="toggleSelectAll()">
              </th>
              <th>Product</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Type</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Coverage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of filteredProducts" [class.selected]="selectedProducts.has(product.id)">
              <td>
                <input 
                  type="checkbox" 
                  [checked]="selectedProducts.has(product.id)"
                  (change)="toggleProductSelection(product.id)">
              </td>
              <td class="product-cell">
                <div class="product-info">
                  <div class="product-image">
                    <img [src]="product.imageUrl" [alt]="product.name" *ngIf="product.imageUrl">
                    <div class="no-image" *ngIf="!product.imageUrl">📦</div>
                  </div>
                  <div class="product-details">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-description">{{ product.description }}</div>
                  </div>
                </div>
              </td>
              <td>{{ product.brand }}</td>
              <td>{{ product.category }}</td>
              <td>
                <span class="type-badge" [class]="product.type.toLowerCase()">
                  {{ product.type }}
                </span>
              </td>
              <td class="price-cell">₫{{ product.price | number }}</td>
              <td class="stock-cell">
                <span class="stock-badge" [class]="getStockLevel(product.stock)">
                  {{ product.stock }}
                </span>
              </td>
              <td>{{ product.coverageRate }} m²/L</td>
              <td>
                <span class="status-badge" [class]="product.isActive ? 'active' : 'inactive'">
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="btn-icon" (click)="editProduct(product)" title="Edit">
                    ✏️
                  </button>
                  <button class="btn-icon" (click)="viewProduct(product)" title="View">
                    👁️
                  </button>
                  <button class="btn-icon danger" (click)="deleteProduct(product)" title="Delete">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bulk Actions -->
      <div class="bulk-actions" *ngIf="selectedProducts.size > 0">
        <div class="bulk-info">
          <span>{{ selectedProducts.size }} product(s) selected</span>
        </div>
        <div class="bulk-buttons">
          <button class="btn btn-outline" (click)="bulkActivate()">Activate</button>
          <button class="btn btn-outline" (click)="bulkDeactivate()">Deactivate</button>
          <button class="btn btn-outline danger" (click)="bulkDelete()">Delete</button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <div class="pagination-info">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalProducts) }} of {{ totalProducts }} products
        </div>
        <div class="pagination-controls">
          <button 
            class="btn btn-outline" 
            [disabled]="currentPage === 1"
            (click)="previousPage()">
            ← Previous
          </button>
          <span class="page-numbers">
            <button 
              *ngFor="let page of getPageNumbers()" 
              class="page-btn"
              [class.active]="page === currentPage"
              (click)="goToPage(page)">
              {{ page }}
            </button>
          </span>
          <button 
            class="btn btn-outline" 
            [disabled]="currentPage === totalPages"
            (click)="nextPage()">
            Next →
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e2e8f0;
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
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .search-box {
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
    }

    .filter-controls {
      display: flex;
      gap: 12px;
    }

    .filter-select {
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      font-size: 14px;
      min-width: 150px;
    }

    .products-table-container {
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
      border-bottom: 1px solid #e2e8f0;
    }

    .products-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .products-table tr:hover {
      background: #f8fafc;
    }

    .products-table tr.selected {
      background: #e0e7ff;
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
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      font-size: 1.5rem;
    }

    .product-details {
      flex: 1;
    }

    .product-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .product-description {
      font-size: 0.875rem;
      color: #64748b;
      line-height: 1.4;
    }

    .type-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .type-badge.interior {
      background: #dbeafe;
      color: #1e40af;
    }

    .type-badge.exterior {
      background: #fef3c7;
      color: #92400e;
    }

    .type-badge.specialty {
      background: #e0e7ff;
      color: #3730a3;
    }

    .type-badge.industrial {
      background: #f3e8ff;
      color: #7c3aed;
    }

    .type-badge.decorative {
      background: #fce7f3;
      color: #be185d;
    }

    .type-badge.eco-friendly {
      background: #d1fae5;
      color: #065f46;
    }

    .price-cell {
      font-weight: 600;
      color: #059669;
    }

    .stock-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .stock-badge.high {
      background: #d1fae5;
      color: #065f46;
    }

    .stock-badge.medium {
      background: #fef3c7;
      color: #92400e;
    }

    .stock-badge.low {
      background: #fee2e2;
      color: #dc2626;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    .actions-cell {
      width: 120px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .btn-icon:hover {
      background: #f1f5f9;
    }

    .btn-icon.danger:hover {
      background: #fee2e2;
    }

    .bulk-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: #e0e7ff;
      border-radius: 8px;
      margin: 16px 0;
    }

    .bulk-info {
      font-weight: 500;
      color: #3730a3;
    }

    .bulk-buttons {
      display: flex;
      gap: 8px;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding: 16px 0;
    }

    .pagination-info {
      color: #64748b;
      font-size: 0.875rem;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-numbers {
      display: flex;
      gap: 4px;
    }

    .page-btn {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .page-btn:hover {
      background: #f8fafc;
    }

    .page-btn.active {
      background: #3730a3;
      color: white;
      border-color: #3730a3;
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
      background-color: #f8fafc;
    }

    .btn-outline.danger {
      border-color: #dc2626;
      color: #dc2626;
    }

    .btn-outline.danger:hover {
      background-color: #fee2e2;
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

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .filters-section {
        flex-direction: column;
      }

      .filter-controls {
        flex-wrap: wrap;
      }

      .products-table-container {
        overflow-x: auto;
      }

      .pagination {
        flex-direction: column;
        gap: 16px;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  searchTerm = '';
  selectedCategory = '';
  selectedType = '';
  stockFilter = '';
  selectAll = false;
  selectedProducts = new Set<string>();
  
  currentPage = 1;
  pageSize = 10;
  totalProducts = 0;
  totalPages = 0;

  Math = Math;

  productTypes = ['Interior', 'Exterior', 'Specialty', 'Industrial', 'Decorative', 'Eco-friendly'];

  categories: ProductCategory[] = [
    { id: '1', name: 'Interior Paint', description: 'Indoor paint products', productCount: 45 },
    { id: '2', name: 'Exterior Paint', description: 'Outdoor paint products', productCount: 32 },
    { id: '3', name: 'Specialty Paint', description: 'Special purpose paints', productCount: 18 },
    { id: '4', name: 'Industrial Paint', description: 'Industrial grade paints', productCount: 12 },
    { id: '5', name: 'Decorative Paint', description: 'Decorative and artistic paints', productCount: 25 },
    { id: '6', name: 'Eco-friendly Paint', description: 'Environmentally friendly paints', productCount: 15 }
  ];

  products: Product[] = [
    {
      id: '1',
      name: 'Dulux Weathershield',
      brand: 'Dulux',
      category: 'Exterior Paint',
      type: 'Exterior',
      price: 1250000,
      stock: 45,
      coverageRate: 12,
      description: 'High-quality exterior paint with weather protection',
      imageUrl: '',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jotun Lady',
      brand: 'Jotun',
      category: 'Interior Paint',
      type: 'Interior',
      price: 850000,
      stock: 12,
      coverageRate: 10,
      description: 'Premium interior paint with easy application',
      imageUrl: '',
      isActive: true,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-16'
    },
    {
      id: '3',
      name: 'Kova Premium',
      brand: 'Kova',
      category: 'Specialty Paint',
      type: 'Specialty',
      price: 2100000,
      stock: 3,
      coverageRate: 15,
      description: 'Specialty paint for unique applications',
      imageUrl: '',
      isActive: true,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-17'
    }
  ];

  filteredProducts: Product[] = [];

  ngOnInit(): void {
    this.filteredProducts = [...this.products];
    this.totalProducts = this.products.length;
    this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      const matchesType = !this.selectedType || product.type === this.selectedType;
      const matchesStock = this.matchesStockFilter(product.stock);
      
      return matchesSearch && matchesCategory && matchesType && matchesStock;
    });
    
    this.totalProducts = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
    this.currentPage = 1;
  }

  matchesStockFilter(stock: number): boolean {
    switch (this.stockFilter) {
      case 'in-stock': return stock > 10;
      case 'low-stock': return stock > 0 && stock <= 10;
      case 'out-of-stock': return stock === 0;
      default: return true;
    }
  }

  getStockLevel(stock: number): string {
    if (stock > 20) return 'high';
    if (stock > 10) return 'medium';
    return 'low';
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.filteredProducts.forEach(product => this.selectedProducts.add(product.id));
    } else {
      this.selectedProducts.clear();
    }
  }

  toggleProductSelection(productId: string): void {
    if (this.selectedProducts.has(productId)) {
      this.selectedProducts.delete(productId);
    } else {
      this.selectedProducts.add(productId);
    }
    this.selectAll = this.selectedProducts.size === this.filteredProducts.length;
  }

  getPageNumbers(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  addProduct(): void {
    console.log('Add product clicked');
  }

  editProduct(product: Product): void {
    console.log('Edit product:', product);
  }

  viewProduct(product: Product): void {
    console.log('View product:', product);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      console.log('Delete product:', product);
    }
  }

  exportProducts(): void {
    console.log('Export products clicked');
  }

  bulkActivate(): void {
    console.log('Bulk activate:', Array.from(this.selectedProducts));
  }

  bulkDeactivate(): void {
    console.log('Bulk deactivate:', Array.from(this.selectedProducts));
  }

  bulkDelete(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedProducts.size} products?`)) {
      console.log('Bulk delete:', Array.from(this.selectedProducts));
    }
  }
}
