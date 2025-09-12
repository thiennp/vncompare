import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.filteredReviews = [...this.reviews];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.error = 'Failed to load reviews';
        this.loading = false;
      }
    });
  }

  filterReviews(): void {
    this.filteredReviews = this.reviews.filter(review => {
      const matchesSearch = review.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           review.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           review.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || review.status === this.statusFilter;
      const matchesRating = !this.ratingFilter || review.rating === parseInt(this.ratingFilter);
      
      return matchesSearch && matchesStatus && matchesRating;
    });
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  approveReview(review: Review): void {
    review.status = 'approved';
    console.log('Approve review:', review);
  }

  rejectReview(review: Review): void {
    review.status = 'rejected';
    console.log('Reject review:', review);
  }

  editReview(review: Review): void {
    console.log('Edit review:', review);
  }

  deleteReview(review: Review): void {
    if (confirm('Are you sure you want to delete this review?')) {
      console.log('Delete review:', review);
    }
  }

  exportReviews(): void {
    console.log('Export reviews clicked');
  }
}
