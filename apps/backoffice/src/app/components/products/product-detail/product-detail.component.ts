import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Product as ApiProduct } from '../../../services/api.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-detail-page">
      <div class="page-header">
        <div class="header-content">
          <button class="btn btn-outline" (click)="goBack()">
            ← Back to Products
          </button>
          <h1>Product Details</h1>
          <p>Product ID: {{ product?.id }}</p>
        </div>
      </div>

      <div class="product-content" *ngIf="product">
        <div class="product-info">
          <div class="info-section">
            <h3>Basic Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Product Name:</label>
                <span>{{ product.name }}</span>
              </div>
              <div class="info-item">
                <label>Brand:</label>
                <span>{{ product.brand }}</span>
              </div>
              <div class="info-item">
                <label>SKU:</label>
                <span>{{ product.sku }}</span>
              </div>
              <div class="info-item">
                <label>Category:</label>
                <span>{{ product.category.name }}</span>
              </div>
              <div class="info-item">
                <label>Supplier:</label>
                <span>{{ product.supplier.companyName }}</span>
              </div>
              <div class="info-item">
                <label>Status:</label>
                <span class="status-badge" [class]="product.isActive ? 'active' : 'inactive'">
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Product Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Color:</label>
                <span>{{ product.color }}</span>
              </div>
              <div class="info-item">
                <label>Finish:</label>
                <span>{{ product.finish }}</span>
              </div>
              <div class="info-item">
                <label>Coverage:</label>
                <span>{{ product.coverage }} m²/liter</span>
              </div>
              <div class="info-item">
                <label>Volume:</label>
                <span>{{ product.volume }} liter(s)</span>
              </div>
              <div class="info-item">
                <label>Price:</label>
                <span>₫{{ product.price | number }}</span>
              </div>
              <div class="info-item" *ngIf="product.discountPrice">
                <label>Discount Price:</label>
                <span>₫{{ product.discountPrice | number }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Performance Metrics</h3>
            <div class="metrics-grid">
              <div class="metric-item">
                <div class="metric-value">{{ product.rating }}/5.0</div>
                <div class="metric-label">Rating</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ product.totalReviews }}</div>
                <div class="metric-label">Reviews</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ product.isFeatured ? 'Yes' : 'No' }}</div>
                <div class="metric-label">Featured</div>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Description</h3>
            <div class="description">
              <p>{{ product.description }}</p>
            </div>
          </div>

          <div class="info-section" *ngIf="product.images && product.images.length > 0">
            <h3>Product Images</h3>
            <div class="images-grid">
              <div 
                *ngFor="let image of product.images" 
                class="image-item">
                <img [src]="image" [alt]="product.name" (click)="viewImage(image)">
              </div>
            </div>
          </div>
        </div>

        <div class="product-actions">
          <h3>Product Actions</h3>
          <div class="actions-grid">
            <button class="btn btn-outline" (click)="editProduct()">
              Edit Product
            </button>
            <button 
              class="btn btn-warning" 
              (click)="toggleProductStatus()"
              *ngIf="product.isActive">
              Deactivate Product
            </button>
            <button 
              class="btn btn-success" 
              (click)="toggleProductStatus()"
              *ngIf="!product.isActive">
              Activate Product
            </button>
            <button 
              class="btn btn-info" 
              (click)="toggleFeatured()"
              *ngIf="!product.isFeatured">
              Make Featured
            </button>
            <button 
              class="btn btn-outline" 
              (click)="toggleFeatured()"
              *ngIf="product.isFeatured">
              Remove Featured
            </button>
            <button class="btn btn-danger" (click)="deleteProduct()">
              Delete Product
            </button>
          </div>
        </div>

        <div class="product-reviews" *ngIf="productReviews.length > 0">
          <h3>Product Reviews</h3>
          <div class="reviews-list">
            <div 
              *ngFor="let review of productReviews" 
              class="review-item">
              <div class="review-header">
                <div class="review-rating">
                  <span class="stars">{{ getStars(review.rating) }}</span>
                  <span class="rating-value">{{ review.rating }}/5</span>
                </div>
                <div class="review-meta">
                  <span class="reviewer">{{ review.customerName }}</span>
                  <span class="review-date">{{ formatDate(review.createdAt) }}</span>
                </div>
              </div>
              <div class="review-content">
                <h4>{{ review.title }}</h4>
                <p>{{ review.comment }}</p>
              </div>
              <div class="review-actions">
                <button 
                  class="btn btn-sm btn-success" 
                  (click)="approveReview(review)"
                  *ngIf="review.status === 'pending'">
                  Approve
                </button>
                <button 
                  class="btn btn-sm btn-danger" 
                  (click)="rejectReview(review)"
                  *ngIf="review.status === 'pending'">
                  Reject
                </button>
                <button class="btn btn-sm btn-outline" (click)="editReview(review)">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading product details...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadProduct()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-page {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 8px 0;
    }

    .page-header p {
      color: #64748b;
      margin: 0;
    }

    .product-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .info-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .info-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .info-item span {
      color: #1e293b;
      font-weight: 500;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
    }

    .metric-item {
      text-align: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .metric-label {
      font-size: 0.875rem;
      color: #64748b;
    }

    .description {
      color: #64748b;
      line-height: 1.6;
    }

    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
    }

    .image-item {
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .image-item:hover {
      transform: scale(1.05);
    }

    .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-actions {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .product-actions h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .product-reviews {
      grid-column: 1 / -1;
    }

    .product-reviews h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .review-item {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .review-rating {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stars {
      color: #f59e0b;
      font-size: 1.25rem;
    }

    .rating-value {
      font-weight: 600;
      color: #1e293b;
    }

    .review-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .reviewer {
      font-weight: 600;
      color: #1e293b;
    }

    .review-date {
      font-size: 0.875rem;
      color: #64748b;
    }

    .review-content h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .review-content p {
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    .review-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      justify-content: flex-end;
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

    .btn-sm {
      padding: 8px 16px;
      font-size: 14px;
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

    .btn-primary:hover {
      background-color: #312e81;
      border-color: #312e81;
    }

    .btn-warning {
      background-color: #f59e0b;
      color: white;
      border-color: #f59e0b;
    }

    .btn-warning:hover {
      background-color: #d97706;
      border-color: #d97706;
    }

    .btn-success {
      background-color: #10b981;
      color: white;
      border-color: #10b981;
    }

    .btn-success:hover {
      background-color: #059669;
      border-color: #059669;
    }

    .btn-info {
      background-color: #06b6d4;
      color: white;
      border-color: #06b6d4;
    }

    .btn-info:hover {
      background-color: #0891b2;
      border-color: #0891b2;
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
      border-color: #ef4444;
    }

    .btn-danger:hover {
      background-color: #dc2626;
      border-color: #dc2626;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      color: #64748b;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #f3f4f6;
      border-top: 3px solid #3730a3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error {
      text-align: center;
      padding: 64px;
      color: #ef4444;
    }

    @media (max-width: 768px) {
      .product-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .info-grid,
      .metrics-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }

      .review-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .review-meta {
        align-items: flex-start;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: ApiProduct | null = null;
  productReviews: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) {
      this.error = 'Product ID not provided';
      return;
    }

    this.loading = true;
    this.error = null;

    this.apiService.getProduct(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loadProductReviews(productId);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
      }
    });
  }

  loadProductReviews(productId: string): void {
    // Load product reviews
    this.apiService.getReviews({ limit: 10, page: 1 }).subscribe({
      next: (response) => {
        // Filter reviews by product ID
        this.productReviews = response.data.filter((review: any) => 
          review.productId === productId
        );
      },
      error: (error) => {
        console.error('Error loading product reviews:', error);
        // Load mock data as fallback
        this.loadMockReviews();
      }
    });
  }

  loadMockReviews(): void {
    this.productReviews = [
      {
        id: 'REV-001',
        productId: this.product?.id,
        customerName: 'Nguyen Van A',
        rating: 5,
        title: 'Excellent quality paint',
        comment: 'This paint is amazing! It covers well and looks great. Highly recommended.',
        status: 'approved',
        createdAt: '2024-01-10T00:00:00Z'
      },
      {
        id: 'REV-002',
        productId: this.product?.id,
        customerName: 'Tran Thi B',
        rating: 4,
        title: 'Good paint, easy to apply',
        comment: 'The paint goes on smoothly and dries quickly. Color is exactly as expected.',
        status: 'pending',
        createdAt: '2024-01-12T00:00:00Z'
      }
    ];
  }

  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/products', this.product.id, 'edit']);
    }
  }

  toggleProductStatus(): void {
    if (!this.product) return;

    const action = this.product.isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} this product?`)) {
      this.apiService.toggleProductStatus(this.product.id).subscribe({
        next: (updatedProduct) => {
          this.product = updatedProduct;
          console.log('Product status updated successfully');
        },
        error: (error) => {
          console.error('Error updating product status:', error);
          alert('Failed to update product status: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  toggleFeatured(): void {
    if (!this.product) return;

    const action = this.product.isFeatured ? 'remove from featured' : 'make featured';
    if (confirm(`Are you sure you want to ${action} this product?`)) {
      // Note: This would need to be implemented in the API service
      console.log('Featured toggle not yet implemented in API');
      alert('Featured toggle functionality not yet implemented');
    }
  }

  deleteProduct(): void {
    if (!this.product) return;

    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      this.apiService.deleteProduct(this.product.id).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  approveReview(review: any): void {
    this.apiService.updateReviewStatus(review.id, 'approved').subscribe({
      next: (updatedReview) => {
        review.status = 'approved';
        console.log('Review approved successfully');
      },
      error: (error) => {
        console.error('Error approving review:', error);
        alert('Failed to approve review: ' + this.apiService.handleError(error));
      }
    });
  }

  rejectReview(review: any): void {
    this.apiService.updateReviewStatus(review.id, 'rejected').subscribe({
      next: (updatedReview) => {
        review.status = 'rejected';
        console.log('Review rejected successfully');
      },
      error: (error) => {
        console.error('Error rejecting review:', error);
        alert('Failed to reject review: ' + this.apiService.handleError(error));
      }
    });
  }

  editReview(review: any): void {
    this.router.navigate(['/reviews', review.id, 'edit']);
  }

  viewImage(imageUrl: string): void {
    window.open(imageUrl, '_blank');
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
