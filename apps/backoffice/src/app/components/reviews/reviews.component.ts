import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface Review {
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

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reviews-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Review Management</h1>
          <p>Moderate and manage product reviews</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="exportReviews()">
            📤 Export
          </button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search reviews..." 
            [(ngModel)]="searchTerm"
            (input)="filterReviews()"
            class="search-input">
        </div>
        <div class="filter-controls">
          <select [(ngModel)]="statusFilter" (change)="filterReviews()" class="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select [(ngModel)]="ratingFilter" (change)="filterReviews()" class="filter-select">
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <button class="btn btn-outline" (click)="clearFilters()">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="reviews-list">
        <div class="review-card" *ngFor="let review of filteredReviews">
          <div class="review-header">
            <div class="review-info">
              <div class="product-name">{{ review.productName }}</div>
              <div class="customer-info">
                <span class="customer-name">{{ review.customerName }}</span>
                <span class="verified-badge" *ngIf="review.verified">✓ Verified</span>
              </div>
            </div>
            <div class="review-meta">
              <div class="rating">
                <span class="stars">{{ getStars(review.rating) }}</span>
                <span class="rating-value">{{ review.rating }}/5</span>
              </div>
              <div class="review-date">{{ review.createdAt | date:'short' }}</div>
            </div>
          </div>
          
          <div class="review-content">
            <h4 class="review-title">{{ review.title }}</h4>
            <p class="review-comment">{{ review.comment }}</p>
          </div>

          <div class="review-footer">
            <div class="review-stats">
              <span class="helpful-count">{{ review.helpful }} helpful</span>
            </div>
            <div class="review-actions">
              <span class="status-badge" [class]="review.status">
                {{ review.status | titlecase }}
              </span>
              <div class="action-buttons">
                <button class="btn-icon" (click)="approveReview(review)" *ngIf="review.status === 'pending'" title="Approve">
                  ✅
                </button>
                <button class="btn-icon" (click)="rejectReview(review)" *ngIf="review.status === 'pending'" title="Reject">
                  ❌
                </button>
                <button class="btn-icon" (click)="editReview(review)" title="Edit">
                  ✏️
                </button>
                <button class="btn-icon danger" (click)="deleteReview(review)" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Review Statistics -->
      <div class="review-stats">
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalReviews }}</div>
            <div class="stat-label">Total Reviews</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingReviews }}</div>
            <div class="stat-label">Pending</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ approvedReviews }}</div>
            <div class="stat-label">Approved</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ averageRating }}/5</div>
            <div class="stat-label">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-page {
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

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .review-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .review-info {
      flex: 1;
    }

    .product-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
    }

    .customer-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .customer-name {
      font-weight: 500;
      color: #374151;
    }

    .verified-badge {
      background: #d1fae5;
      color: #065f46;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .review-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stars {
      color: #fbbf24;
      font-size: 1.125rem;
    }

    .rating-value {
      font-weight: 600;
      color: #1e293b;
    }

    .review-date {
      font-size: 0.875rem;
      color: #64748b;
    }

    .review-content {
      margin-bottom: 16px;
    }

    .review-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .review-comment {
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    .review-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .review-stats {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .helpful-count {
      font-size: 0.875rem;
      color: #64748b;
    }

    .review-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.rejected {
      background: #fee2e2;
      color: #dc2626;
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

    .review-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
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

      .review-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .review-meta {
        align-items: flex-start;
      }

      .review-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .review-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReviewsComponent implements OnInit {
  searchTerm = '';
  statusFilter = '';
  ratingFilter = '';

  reviews: Review[] = [];
  loading = false;
  error: string | null = null;

  filteredReviews: Review[] = [];

  get totalReviews(): number {
    return this.reviews.length;
  }

  get pendingReviews(): number {
    return this.reviews.filter(review => review.status === 'pending').length;
  }

  get approvedReviews(): number {
    return this.reviews.filter(review => review.status === 'approved').length;
  }

  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / this.reviews.length) * 10) / 10;
  }

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getReviews({ limit: 50, page: 1 }).subscribe({
      next: (response) => {
        this.reviews = response.data;
        this.filteredReviews = [...this.reviews];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
        // Load mock data as fallback
        this.loadMockData();
      }
    });
  }

  loadMockData(): void {
    this.reviews = [
      {
        id: 'REV-001',
        productId: 'PROD-001',
        productName: 'Dulux Weathershield Exterior Paint',
        customerName: 'Nguyen Van A',
        customerEmail: 'nguyenvana@email.com',
        rating: 5,
        title: 'Excellent quality paint',
        comment: 'This paint is amazing! It covers well and looks great. Highly recommended.',
        status: 'approved',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
        helpful: 12,
        verified: true
      },
      {
        id: 'REV-002',
        productId: 'PROD-002',
        productName: 'Jotun Lady Interior Paint',
        customerName: 'Tran Thi B',
        customerEmail: 'tranthib@email.com',
        rating: 4,
        title: 'Good paint, easy to apply',
        comment: 'The paint goes on smoothly and dries quickly. Color is exactly as expected.',
        status: 'pending',
        createdAt: '2024-01-12T00:00:00Z',
        updatedAt: '2024-01-12T00:00:00Z',
        helpful: 8,
        verified: true
      },
      {
        id: 'REV-003',
        productId: 'PROD-003',
        productName: 'Kova Premium Primer',
        customerName: 'Le Van C',
        customerEmail: 'levanc@email.com',
        rating: 3,
        title: 'Average primer',
        comment: 'It works okay but could be better. Takes longer to dry than expected.',
        status: 'rejected',
        createdAt: '2024-01-14T00:00:00Z',
        updatedAt: '2024-01-14T00:00:00Z',
        helpful: 2,
        verified: false
      }
    ];
    this.filteredReviews = [...this.reviews];
  }

  filterReviews(): void {
    this.filteredReviews = this.reviews.filter(review => {
      const matchesSearch = !this.searchTerm || 
        review.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        review.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || review.status === this.statusFilter;
      const matchesRating = !this.ratingFilter || review.rating === parseInt(this.ratingFilter);
      
      return matchesSearch && matchesStatus && matchesRating;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.ratingFilter = '';
    this.filteredReviews = [...this.reviews];
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  approveReview(review: Review): void {
    this.apiService.updateReviewStatus(review.id, 'approved').subscribe({
      next: (updatedReview) => {
        // Update review in local array
        const index = this.reviews.findIndex(r => r.id === review.id);
        if (index !== -1) {
          this.reviews[index].status = 'approved';
          this.filteredReviews = [...this.reviews];
        }
        console.log('Review approved successfully');
      },
      error: (error) => {
        console.error('Error approving review:', error);
        alert('Failed to approve review: ' + this.apiService.handleError(error));
      }
    });
  }

  rejectReview(review: Review): void {
    this.apiService.updateReviewStatus(review.id, 'rejected').subscribe({
      next: (updatedReview) => {
        // Update review in local array
        const index = this.reviews.findIndex(r => r.id === review.id);
        if (index !== -1) {
          this.reviews[index].status = 'rejected';
          this.filteredReviews = [...this.reviews];
        }
        console.log('Review rejected successfully');
      },
      error: (error) => {
        console.error('Error rejecting review:', error);
        alert('Failed to reject review: ' + this.apiService.handleError(error));
      }
    });
  }

  editReview(review: Review): void {
    // Navigate to edit review page
    this.router.navigate(['/reviews', review.id, 'edit']);
  }

  deleteReview(review: Review): void {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      // Note: The API service doesn't have a deleteReview method yet
      // This would need to be added to the API service
      console.log('Delete review:', review);
      alert('Delete functionality not yet implemented in API');
    }
  }

  exportReviews(): void {
    // Export reviews to CSV
    const csvContent = this.generateReviewsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reviews.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generateReviewsCSV(): string {
    const headers = ['Product', 'Customer', 'Rating', 'Title', 'Comment', 'Status', 'Helpful', 'Verified', 'Date'];
    const rows = this.filteredReviews.map(review => [
      review.productName,
      review.customerName,
      review.rating,
      review.title,
      review.comment,
      review.status,
      review.helpful,
      review.verified ? 'Yes' : 'No',
      new Date(review.createdAt).toLocaleDateString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}
