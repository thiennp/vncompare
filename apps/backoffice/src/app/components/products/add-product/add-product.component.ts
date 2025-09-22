import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Product as ApiProduct } from '../../../services/api.service';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Supplier {
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

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-product-page">
      <div class="page-header">
        <div class="header-content">
          <button class="btn btn-outline" (click)="goBack()">
            ← Back to Products
          </button>
          <h1>Add New Product</h1>
          <p>Create a new paint product for your inventory</p>
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="error">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- Success Message -->
      <div class="success-message" *ngIf="success">
        <div class="success-content">
          <span class="success-icon">✅</span>
          <span>{{ success }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>

      <!-- Product Form -->
      <form class="product-form" (ngSubmit)="onSubmit()" #productForm="ngForm" *ngIf="!loading">
        <div class="form-grid">
          <!-- Basic Information -->
          <div class="form-section">
            <h3>Basic Information</h3>
            
            <div class="form-group">
              <label for="name">Product Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                [(ngModel)]="product.name" 
                required 
                class="form-input"
                placeholder="Enter product name">
            </div>

            <div class="form-group">
              <label for="description">Description *</label>
              <textarea 
                id="description" 
                name="description" 
                [(ngModel)]="product.description" 
                required 
                class="form-textarea"
                rows="4"
                placeholder="Enter product description"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="brand">Brand *</label>
                <input 
                  type="text" 
                  id="brand" 
                  name="brand" 
                  [(ngModel)]="product.brand" 
                  required 
                  class="form-input"
                  placeholder="Enter brand name">
              </div>

              <div class="form-group">
                <label for="sku">SKU *</label>
                <input 
                  type="text" 
                  id="sku" 
                  name="sku" 
                  [(ngModel)]="product.sku" 
                  required 
                  class="form-input"
                  placeholder="Enter SKU">
              </div>
            </div>
          </div>

          <!-- Category and Supplier -->
          <div class="form-section">
            <h3>Category & Supplier</h3>
            
            <div class="form-group">
              <label for="category">Category *</label>
              <select 
                id="category" 
                name="category" 
                [(ngModel)]="selectedCategoryId" 
                required 
                class="form-select">
                <option value="">Select a category</option>
                <option *ngFor="let category of categories" [value]="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="supplier">Supplier *</label>
              <select 
                id="supplier" 
                name="supplier" 
                [(ngModel)]="selectedSupplierId" 
                required 
                class="form-select">
                <option value="">Select a supplier</option>
                <option *ngFor="let supplier of suppliers" [value]="supplier.id">
                  {{ supplier.name }} (Rating: {{ supplier.rating }})
                </option>
              </select>
            </div>
          </div>

          <!-- Product Details -->
          <div class="form-section">
            <h3>Product Details</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="color">Color *</label>
                <input 
                  type="text" 
                  id="color" 
                  name="color" 
                  [(ngModel)]="product.color" 
                  required 
                  class="form-input"
                  placeholder="e.g., White, Blue, Red">
              </div>

              <div class="form-group">
                <label for="finish">Finish *</label>
                <select 
                  id="finish" 
                  name="finish" 
                  [(ngModel)]="product.finish" 
                  required 
                  class="form-select">
                  <option value="">Select finish</option>
                  <option value="Matte">Matte</option>
                  <option value="Satin">Satin</option>
                  <option value="Semi-Gloss">Semi-Gloss</option>
                  <option value="Gloss">Gloss</option>
                  <option value="High-Gloss">High-Gloss</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="coverage">Coverage (sq ft per gallon) *</label>
                <input 
                  type="number" 
                  id="coverage" 
                  name="coverage" 
                  [(ngModel)]="product.coverage" 
                  required 
                  min="0"
                  step="0.1"
                  class="form-input"
                  placeholder="e.g., 350">
              </div>

              <div class="form-group">
                <label for="volume">Volume (gallons) *</label>
                <input 
                  type="number" 
                  id="volume" 
                  name="volume" 
                  [(ngModel)]="product.volume" 
                  required 
                  min="0"
                  step="0.1"
                  class="form-input"
                  placeholder="e.g., 1">
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="form-section">
            <h3>Pricing</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="price">Price (VND) *</label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  [(ngModel)]="product.price" 
                  required 
                  min="0"
                  step="1000"
                  class="form-input"
                  placeholder="e.g., 500000">
              </div>

              <div class="form-group">
                <label for="discountPrice">Discount Price (VND)</label>
                <input 
                  type="number" 
                  id="discountPrice" 
                  name="discountPrice" 
                  [(ngModel)]="product.discountPrice" 
                  min="0"
                  step="1000"
                  class="form-input"
                  placeholder="e.g., 450000">
              </div>
            </div>
          </div>

          <!-- Images -->
          <div class="form-section">
            <h3>Product Images</h3>
            
            <div class="form-group">
              <label for="images">Image URLs (one per line)</label>
              <textarea 
                id="images" 
                name="images" 
                [(ngModel)]="imageUrls" 
                class="form-textarea"
                rows="3"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"></textarea>
              <small class="form-help">Enter one image URL per line. First image will be the main product image.</small>
            </div>
          </div>

          <!-- Status -->
          <div class="form-section">
            <h3>Status</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    [(ngModel)]="product.isActive">
                  <span class="checkmark"></span>
                  Active Product
                </label>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="isFeatured" 
                    [(ngModel)]="product.isFeatured">
                  <span class="checkmark"></span>
                  Featured Product
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="goBack()">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="!productForm.form.valid || submitting">
            {{ submitting ? 'Creating...' : 'Create Product' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .add-product-page {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .header-content h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .header-content p {
      color: #64748b;
      margin: 0;
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

    .success-message {
      background: #d1fae5;
      border: 1px solid #a7f3d0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .success-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .success-icon {
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

    .product-form {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      padding: 32px;
    }

    .form-grid {
      display: grid;
      gap: 32px;
    }

    .form-section {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 24px;
    }

    .form-section:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
    }

    .form-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 20px 0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }

    .form-input,
    .form-textarea,
    .form-select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 15px;
      font-family: inherit;
      background-color: white;
      color: #1f2937;
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus {
      outline: none;
      border-color: #3730a3;
      box-shadow: 0 0 0 3px rgba(55, 48, 163, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-help {
      display: block;
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 4px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-weight: 500;
      color: #374151;
    }

    .checkbox-label input[type="checkbox"] {
      width: 20px;
      height: 20px;
      margin: 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 12px 24px;
      border: 1px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      font-size: 15px;
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

    .btn-primary {
      background-color: #3730a3;
      color: white;
      border-color: #3730a3;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #312e81;
      border-color: #312e81;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .add-product-page {
        padding: 16px;
      }

      .product-form {
        padding: 20px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AddProductComponent implements OnInit {
  loading = false;
  submitting = false;
  error: string | null = null;
  success: string | null = null;
  loadingMessage = 'Loading...';

  product: Partial<ApiProduct> = {
    name: '',
    description: '',
    brand: '',
    sku: '',
    color: '',
    finish: '',
    coverage: 0,
    volume: 0,
    price: 0,
    discountPrice: undefined,
    images: [],
    isActive: true,
    isFeatured: false,
    rating: 0,
    totalReviews: 0
  };

  imageUrls = '';
  selectedCategoryId = '';
  selectedSupplierId = '';

  categories: Category[] = [
    { id: '1', name: 'Interior Paint', slug: 'interior-paint' },
    { id: '2', name: 'Exterior Paint', slug: 'exterior-paint' },
    { id: '3', name: 'Primer', slug: 'primer' },
    { id: '4', name: 'Specialty Paint', slug: 'specialty-paint' }
  ];

  suppliers: Supplier[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.loadingMessage = 'Loading suppliers...';

    this.apiService.getSuppliers({ limit: 100 }).subscribe({
      next: (response) => {
        this.suppliers = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.error = 'Failed to load suppliers';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.submitting = true;
    this.error = null;
    this.success = null;

    // Prepare product data
    const productData: Partial<ApiProduct> = {
      ...this.product,
      images: this.imageUrls ? this.imageUrls.split('\n').filter(url => url.trim()) : [],
      category: {
        id: this.selectedCategoryId,
        name: this.categories.find(c => c.id === this.selectedCategoryId)?.name || '',
        slug: this.categories.find(c => c.id === this.selectedCategoryId)?.slug || ''
      },
      supplier: {
        id: this.selectedSupplierId,
        companyName: this.suppliers.find(s => s.id === this.selectedSupplierId)?.name || '',
        rating: this.suppliers.find(s => s.id === this.selectedSupplierId)?.rating || 0
      }
    };

    this.apiService.createProduct(productData).subscribe({
      next: (createdProduct) => {
        this.success = 'Product created successfully!';
        this.submitting = false;
        
        // Redirect to products page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.error = error.message || 'Failed to create product';
        this.submitting = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.product.name?.trim()) {
      this.error = 'Product name is required';
      return false;
    }

    if (!this.product.description?.trim()) {
      this.error = 'Product description is required';
      return false;
    }

    if (!this.product.brand?.trim()) {
      this.error = 'Brand is required';
      return false;
    }

    if (!this.product.sku?.trim()) {
      this.error = 'SKU is required';
      return false;
    }

    if (!this.product.color?.trim()) {
      this.error = 'Color is required';
      return false;
    }

    if (!this.product.finish?.trim()) {
      this.error = 'Finish is required';
      return false;
    }

    if (!this.product.coverage || this.product.coverage <= 0) {
      this.error = 'Coverage must be greater than 0';
      return false;
    }

    if (!this.product.volume || this.product.volume <= 0) {
      this.error = 'Volume must be greater than 0';
      return false;
    }

    if (!this.product.price || this.product.price <= 0) {
      this.error = 'Price must be greater than 0';
      return false;
    }

    if (!this.selectedCategoryId) {
      this.error = 'Category is required';
      return false;
    }

    if (!this.selectedSupplierId) {
      this.error = 'Supplier is required';
      return false;
    }

    return true;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
