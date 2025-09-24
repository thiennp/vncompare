import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, User as ApiUser } from '../../../services/api.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-detail-page">
      <div class="page-header">
        <div class="header-content">
          <button class="btn btn-outline" (click)="goBack()">
            ← Back to Users
          </button>
          <h1>User Details</h1>
          <p>User ID: {{ user?.id }}</p>
        </div>
      </div>

      <div class="user-content" *ngIf="user">
        <div class="user-info">
          <div class="info-section">
            <h3>Personal Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>First Name:</label>
                <span>{{ user.firstName }}</span>
              </div>
              <div class="info-item">
                <label>Last Name:</label>
                <span>{{ user.lastName }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ user.email }}</span>
              </div>
              <div class="info-item">
                <label>Phone:</label>
                <span>{{ user.phone }}</span>
              </div>
              <div class="info-item">
                <label>Role:</label>
                <span class="role-badge" [class]="'role-' + user.role.toLowerCase()">
                  {{ user.role }}
                </span>
              </div>
              <div class="info-item">
                <label>Status:</label>
                <span class="status-badge" [class]="user.isActive ? 'active' : 'inactive'">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Account Status</h3>
            <div class="status-grid">
              <div class="status-item">
                <label>Email Verified:</label>
                <span class="status-badge" [class]="user.emailVerified ? 'verified' : 'unverified'">
                  {{ user.emailVerified ? 'Verified' : 'Unverified' }}
                </span>
              </div>
              <div class="status-item">
                <label>Phone Verified:</label>
                <span class="status-badge" [class]="user.phoneVerified ? 'verified' : 'unverified'">
                  {{ user.phoneVerified ? 'Verified' : 'Unverified' }}
                </span>
              </div>
              <div class="status-item">
                <label>Last Login:</label>
                <span>{{ user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never' }}</span>
              </div>
              <div class="status-item">
                <label>Created:</label>
                <span>{{ formatDate(user.createdAt) }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Activity Summary</h3>
            <div class="activity-grid">
              <div class="activity-item">
                <div class="activity-value">{{ user.ordersCount }}</div>
                <div class="activity-label">Total Orders</div>
              </div>
              <div class="activity-item">
                <div class="activity-value">₫{{ user.totalSpent | number }}</div>
                <div class="activity-label">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        <div class="user-actions">
          <h3>User Actions</h3>
          <div class="actions-grid">
            <button class="btn btn-outline" (click)="editUser()">
              Edit User
            </button>
            <button 
              class="btn btn-warning" 
              (click)="toggleUserStatus()"
              *ngIf="user.isActive">
              Deactivate User
            </button>
            <button 
              class="btn btn-success" 
              (click)="toggleUserStatus()"
              *ngIf="!user.isActive">
              Activate User
            </button>
            <button class="btn btn-info" (click)="resetPassword()">
              Reset Password
            </button>
            <button class="btn btn-danger" (click)="deleteUser()">
              Delete User
            </button>
          </div>
        </div>

        <div class="user-orders" *ngIf="userOrders.length > 0">
          <h3>Recent Orders</h3>
          <div class="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of userOrders">
                  <td>{{ order.id }}</td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                  <td>
                    <span class="status-badge" [class]="order.status">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>₫{{ order.totalAmount | number }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline" (click)="viewOrder(order.id)">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading user details...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadUser()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .user-detail-page {
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

    .user-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .user-info {
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

    .info-grid,
    .status-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-item,
    .status-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item label,
    .status-item label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .info-item span,
    .status-item span {
      color: #1e293b;
      font-weight: 500;
    }

    .role-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .role-admin {
      background: #fef3c7;
      color: #92400e;
    }

    .role-user {
      background: #dbeafe;
      color: #1e40af;
    }

    .role-supplier {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active,
    .status-badge.verified {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive,
    .status-badge.unverified {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.confirmed {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.shipped {
      background: #e0e7ff;
      color: #3730a3;
    }

    .status-badge.delivered {
      background: #d1fae5;
      color: #065f46;
    }

    .activity-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .activity-item {
      text-align: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .activity-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .activity-label {
      font-size: 0.875rem;
      color: #64748b;
    }

    .user-actions {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .user-actions h3 {
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

    .user-orders {
      grid-column: 1 / -1;
    }

    .user-orders h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .orders-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .orders-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .orders-table th,
    .orders-table td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid #f1f5f9;
    }

    .orders-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
    }

    .orders-table td {
      color: #64748b;
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
      .user-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .info-grid,
      .status-grid,
      .activity-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserDetailComponent implements OnInit {
  user: ApiUser | null = null;
  userOrders: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (!userId) {
      this.error = 'User ID not provided';
      return;
    }

    this.loading = true;
    this.error = null;

    this.apiService.getUser(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loadUserOrders(userId);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
      }
    });
  }

  loadUserOrders(userId: string): void {
    // Load user's orders
    this.apiService.getOrders({ limit: 10, page: 1 }).subscribe({
      next: (response) => {
        // Filter orders by user ID (this would need to be implemented in the API)
        this.userOrders = response.data.filter((order: any) => 
          order.customerEmail === this.user?.email
        );
      },
      error: (error) => {
        console.error('Error loading user orders:', error);
        // No fallback data - rely on API only
      }
    });
  }


  editUser(): void {
    if (this.user) {
      this.router.navigate(['/users', this.user.id, 'edit']);
    }
  }

  toggleUserStatus(): void {
    if (!this.user) return;

    const action = this.user.isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      this.apiService.toggleUserStatus(this.user.id).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          console.log('User status updated successfully');
        },
        error: (error) => {
          console.error('Error updating user status:', error);
          alert('Failed to update user status: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  resetPassword(): void {
    if (!this.user) return;

    if (confirm('Are you sure you want to reset the password for this user?')) {
      // Note: This would need to be implemented in the API service
      console.log('Password reset not yet implemented in API');
      alert('Password reset functionality not yet implemented');
    }
  }

  deleteUser(): void {
    if (!this.user) return;

    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.apiService.deleteUser(this.user.id).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  viewOrder(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
