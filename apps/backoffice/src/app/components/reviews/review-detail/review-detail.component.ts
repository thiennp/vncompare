import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

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
  selector: 'app-review-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="review-detail-page">
      <div class="page-header">
        <div class="header-content">
          <button class="btn btn-outline" (click)="goBack()">
            ← Back to Reviews
          </button>
          <h1>Review Details</h1>
          <p>Review ID: {{ review?.id }}</p>
        </div>
      </div>

      <div class="review-content" *ngIf="review">
        <div class="review-info">
          <div class="info-section">
            <h3>Review Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Product:</label>
                <span>{{ review.productName }}</span>
              </div>
              <div class="info-item">
                <label>Customer:</label>
                <span>{{ review.customerName }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ review.customerEmail }}</span>
              </div>
              <div class="info-item">
                <label>Rating:</label>
                <span class="rating">{{ getStars(review.rating) }} ({{ review.rating }}/5)</span>
              </div>
              <div class="info-item">
                <label>Status:</label>
                <span class="status-badge" [class]="review.status">
                  {{ review.status }}
                </span>
              </div>
              <div class="info-item">
                <label>Verified:</label>
                <span class="status-badge" [class]="review.verified ? 'verified' : 'unverified'">
                  {{ review.verified ? 'Verified' : 'Unverified' }}
                </span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Review Content</h3>
            <div class="review-content-section">
              <h4>{{ review.title }}</h4>
              <p>{{ review.comment }}</p>
            </div>
          </div>

          <div class="info-section">
            <h3>Review Metrics</h3>
            <div class="metrics-grid">
              <div class="metric-item">
                <div class="metric-value">{{ review.helpful }}</div>
                <div class="metric-label">Helpful Votes</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ formatDate(review.createdAt) }}</div>
                <div class="metric-label">Created Date</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ formatDate(review.updatedAt) }}</div>
                <div class="metric-label">Last Updated</div>
              </div>
            </div>
          </div>
        </div>

        <div class="review-actions">
          <h3>Review Actions</h3>
          <div class="actions-grid">
            <button class="btn btn-outline" (click)="editReview()">
              Edit Review
            </button>
            <button 
              class="btn btn-success" 
              (click)="approveReview()"
              *ngIf="review.status === 'pending'">
              Approve Review
            </button>
            <button 
              class="btn btn-danger" 
              (click)="rejectReview()"
              *ngIf="review.status === 'pending'">
              Reject Review
            </button>
            <button 
              class="btn btn-warning" 
              (click)="markAsPending()"
              *ngIf="review.status !== 'pending'">
              Mark as Pending
            </button>
            <button class="btn btn-info" (click)="viewProduct()">
              View Product
            </button>
            <button class="btn btn-danger" (click)="deleteReview()">
              Delete Review
            </button>
          </div>
        </div>

        <div class="review-history" *ngIf="reviewHistory.length > 0">
          <h3>Review History</h3>
          <div class="history-list">
            <div 
              *ngFor="let history of reviewHistory" 
              class="history-item">
              <div class="history-content">
                <div class="history-action">{{ history.action }}</div>
                <div class="history-details">{{ history.details }}</div>
                <div class="history-meta">
                  <span class="history-user">{{ history.user }}</span>
                  <span class="history-date">{{ formatDate(history.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading review details...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadReview()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .review-detail-page {
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

    .review-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .review-info {
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
      color: #991b1b;
    }

    .status-badge.verified {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.unverified {
      background: #fee2e2;
      color: #991b1b;
    }

    .rating {
      color: #f59e0b;
      font-weight: 600;
    }

    .review-content-section {
      background: #f8fafc;
      border-radius: 8px;
      padding: 20px;
    }

    .review-content-section h4 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 12px 0;
    }

    .review-content-section p {
      color: #64748b;
      line-height: 1.6;
      margin: 0;
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
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .metric-label {
      font-size: 0.875rem;
      color: #64748b;
    }

    .review-actions {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .review-actions h3 {
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

    .review-history {
      grid-column: 1 / -1;
    }

    .review-history h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .history-list {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .history-item {
      padding: 16px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .history-item:last-child {
      border-bottom: none;
    }

    .history-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .history-action {
      font-weight: 600;
      color: #1e293b;
    }

    .history-details {
      color: #64748b;
    }

    .history-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #9ca3af;
    }

    .history-user {
      font-weight: 500;
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
      .review-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .info-grid,
      .metrics-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReviewDetailComponent implements OnInit {
  review: Review | null = null;
  reviewHistory: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadReview();
  }

  loadReview(): void {
    const reviewId = this.route.snapshot.paramMap.get('id');
    if (!reviewId) {
      this.error = 'Review ID not provided';
      return;
    }

    this.loading = true;
    this.error = null;

    // Note: This would need to be implemented in the API service
    // For now, we'll load mock data
    this.loadMockReview(reviewId);
  }

  loadMockReview(reviewId: string): void {
    this.review = {
      id: reviewId,
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
    };

    this.loadReviewHistory(reviewId);
    this.loading = false;
  }

  loadReviewHistory(reviewId: string): void {
    // Load review history
    this.reviewHistory = [
      {
        action: 'Review Created',
        details: 'Customer submitted review',
        user: 'System',
        timestamp: '2024-01-10T00:00:00Z'
      },
      {
        action: 'Review Approved',
        details: 'Review approved by admin',
        user: 'Admin User',
        timestamp: '2024-01-10T10:30:00Z'
      },
      {
        action: 'Review Updated',
        details: 'Review content updated',
        user: 'Admin User',
        timestamp: '2024-01-12T14:20:00Z'
      }
    ];
  }

  editReview(): void {
    if (this.review) {
      this.router.navigate(['/reviews', this.review.id, 'edit']);
    }
  }

  approveReview(): void {
    if (!this.review) return;

    this.apiService.updateReviewStatus(this.review.id, 'approved').subscribe({
      next: (updatedReview) => {
        this.review = updatedReview;
        console.log('Review approved successfully');
      },
      error: (error) => {
        console.error('Error approving review:', error);
        alert('Failed to approve review: ' + this.apiService.handleError(error));
      }
    });
  }

  rejectReview(): void {
    if (!this.review) return;

    this.apiService.updateReviewStatus(this.review.id, 'rejected').subscribe({
      next: (updatedReview) => {
        this.review = updatedReview;
        console.log('Review rejected successfully');
      },
      error: (error) => {
        console.error('Error rejecting review:', error);
        alert('Failed to reject review: ' + this.apiService.handleError(error));
      }
    });
  }

  markAsPending(): void {
    if (!this.review) return;

    this.apiService.updateReviewStatus(this.review.id, 'pending').subscribe({
      next: (updatedReview) => {
        this.review = updatedReview;
        console.log('Review marked as pending successfully');
      },
      error: (error) => {
        console.error('Error updating review status:', error);
        alert('Failed to update review status: ' + this.apiService.handleError(error));
      }
    });
  }

  viewProduct(): void {
    if (this.review) {
      this.router.navigate(['/products', this.review.productId]);
    }
  }

  deleteReview(): void {
    if (!this.review) return;

    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      // Note: This would need to be implemented in the API service
      console.log('Delete review not yet implemented in API');
      alert('Delete functionality not yet implemented');
    }
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  goBack(): void {
    this.router.navigate(['/reviews']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
