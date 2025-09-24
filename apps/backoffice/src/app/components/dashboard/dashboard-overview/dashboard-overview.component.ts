import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalSuppliers: number;
  totalReviews: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  usersGrowth: number;
  recentOrders?: Array<{
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  topProducts?: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  pendingReviews: number;
  lowStockProducts: number;
  pendingSuppliers: number;
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-overview-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="refreshData()">
            🔄 Refresh
          </button>
          <button class="btn btn-primary" (click)="viewAnalytics()">
            📊 View Analytics
          </button>
        </div>
      </div>

      <div class="dashboard-content" *ngIf="metrics">
        <!-- Key Metrics -->
        <div class="metrics-section">
          <h2>Key Metrics</h2>
          <div class="metrics-grid">
            <div class="metric-card revenue">
              <div class="metric-icon">
                <span>💰</span>
              </div>
              <div class="metric-content">
                <div class="metric-value">₫{{ metrics.totalRevenue | number }}</div>
                <div class="metric-label">Total Revenue</div>
                <div class="metric-change" [class]="metrics.revenueGrowth >= 0 ? 'positive' : 'negative'">
                  {{ metrics.revenueGrowth >= 0 ? '+' : '' }}{{ metrics.revenueGrowth }}% vs last month
                </div>
              </div>
            </div>

            <div class="metric-card orders">
              <div class="metric-icon">
                <span>🛒</span>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ metrics.totalOrders | number }}</div>
                <div class="metric-label">Total Orders</div>
                <div class="metric-change" [class]="metrics.ordersGrowth >= 0 ? 'positive' : 'negative'">
                  {{ metrics.ordersGrowth >= 0 ? '+' : '' }}{{ metrics.ordersGrowth }}% vs last month
                </div>
              </div>
            </div>

            <div class="metric-card products">
              <div class="metric-icon">
                <span>📦</span>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ metrics.totalProducts | number }}</div>
                <div class="metric-label">Total Products</div>
                <div class="metric-change" [class]="metrics.productsGrowth >= 0 ? 'positive' : 'negative'">
                  {{ metrics.productsGrowth >= 0 ? '+' : '' }}{{ metrics.productsGrowth }}% vs last month
                </div>
              </div>
            </div>

            <div class="metric-card users">
              <div class="metric-icon">
                <span>👥</span>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ metrics.totalUsers | number }}</div>
                <div class="metric-label">Total Users</div>
                <div class="metric-change" [class]="metrics.usersGrowth >= 0 ? 'positive' : 'negative'">
                  {{ metrics.usersGrowth >= 0 ? '+' : '' }}{{ metrics.usersGrowth }}% vs last month
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-section">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <button class="action-card" (click)="navigateTo('/products/add')">
              <div class="action-icon">➕</div>
              <div class="action-content">
                <h3>Add Product</h3>
                <p>Add a new product to the catalog</p>
              </div>
            </button>

            <button class="action-card" (click)="navigateTo('/orders')">
              <div class="action-icon">📋</div>
              <div class="action-content">
                <h3>Manage Orders</h3>
                <p>View and process orders</p>
              </div>
            </button>

            <button class="action-card" (click)="navigateTo('/suppliers/add')">
              <div class="action-icon">🏢</div>
              <div class="action-content">
                <h3>Add Supplier</h3>
                <p>Register a new supplier</p>
              </div>
            </button>

            <button class="action-card" (click)="navigateTo('/users')">
              <div class="action-icon">👤</div>
              <div class="action-content">
                <h3>Manage Users</h3>
                <p>View and manage user accounts</p>
              </div>
            </button>

            <button class="action-card" (click)="navigateTo('/coverage-calculator')">
              <div class="action-icon">🎨</div>
              <div class="action-content">
                <h3>Coverage Calculator</h3>
                <p>Calculate paint coverage</p>
              </div>
            </button>

            <button class="action-card" (click)="navigateTo('/shipping-calculator')">
              <div class="action-icon">🚚</div>
              <div class="action-content">
                <h3>Shipping Calculator</h3>
                <p>Calculate delivery fees</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Status Alerts -->
        <div class="alerts-section" *ngIf="hasAlerts()">
          <h2>Status Alerts</h2>
          <div class="alerts-grid">
            <div class="alert-card warning" *ngIf="metrics.pendingReviews > 0">
              <div class="alert-icon">⚠️</div>
              <div class="alert-content">
                <h3>{{ metrics.pendingReviews }} Pending Reviews</h3>
                <p>Reviews waiting for approval</p>
                <button class="btn btn-sm btn-outline" (click)="navigateTo('/reviews')">
                  Review Now
                </button>
              </div>
            </div>

            <div class="alert-card danger" *ngIf="metrics.lowStockProducts > 0">
              <div class="alert-icon">📉</div>
              <div class="alert-content">
                <h3>{{ metrics.lowStockProducts }} Low Stock Products</h3>
                <p>Products running low on inventory</p>
                <button class="btn btn-sm btn-outline" (click)="navigateTo('/products')">
                  Check Inventory
                </button>
              </div>
            </div>

            <div class="alert-card info" *ngIf="metrics.pendingSuppliers > 0">
              <div class="alert-icon">⏳</div>
              <div class="alert-content">
                <h3>{{ metrics.pendingSuppliers }} Pending Suppliers</h3>
                <p>Suppliers waiting for verification</p>
                <button class="btn btn-sm btn-outline" (click)="navigateTo('/suppliers')">
                  Verify Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="activity-section">
          <div class="activity-container">
            <h2>Recent Orders</h2>
            <div class="activity-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let order of metrics.recentOrders">
                    <td>{{ order.id }}</td>
                    <td>{{ order.customerName }}</td>
                    <td>₫{{ order.totalAmount | number }}</td>
                    <td>
                      <span class="status-badge" [class]="order.status">
                        {{ order.status }}
                      </span>
                    </td>
                    <td>{{ formatDate(order.createdAt) }}</td>
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

          <div class="activity-container">
            <h2>Top Products</h2>
            <div class="products-list">
              <div 
                *ngFor="let product of metrics.topProducts; let i = index" 
                class="product-item">
                <div class="product-rank">{{ i + 1 }}</div>
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-stats">
                    <span>{{ product.sales }} sales</span>
                    <span>₫{{ product.revenue | number }}</span>
                  </div>
                </div>
                <button class="btn btn-sm btn-outline" (click)="viewProduct(product.id)">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadDashboard()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-overview-page {
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

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .page-header p {
      color: #64748b;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .dashboard-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .metrics-section h2,
    .quick-actions-section h2,
    .alerts-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 20px 0;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.2s;
    }

    .metric-card:hover {
      transform: translateY(-2px);
    }

    .metric-card.revenue {
      border-left: 4px solid #10b981;
    }

    .metric-card.orders {
      border-left: 4px solid #3b82f6;
    }

    .metric-card.products {
      border-left: 4px solid #f59e0b;
    }

    .metric-card.users {
      border-left: 4px solid #8b5cf6;
    }

    .metric-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      background: #f8fafc;
    }

    .metric-content {
      flex: 1;
    }

    .metric-value {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .metric-label {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 8px;
    }

    .metric-change {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .metric-change.positive {
      color: #059669;
    }

    .metric-change.negative {
      color: #dc2626;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .action-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 16px;
      text-align: left;
    }

    .action-card:hover {
      border-color: #3730a3;
      box-shadow: 0 4px 12px 0 rgba(55, 48, 163, 0.1);
      transform: translateY(-2px);
    }

    .action-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      background: #f0f9ff;
      color: #3730a3;
    }

    .action-content h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 4px 0;
    }

    .action-content p {
      color: #64748b;
      margin: 0;
      font-size: 0.875rem;
    }

    .alerts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .alert-card {
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-left: 4px solid;
    }

    .alert-card.warning {
      background: #fef3c7;
      border-left-color: #f59e0b;
    }

    .alert-card.danger {
      background: #fee2e2;
      border-left-color: #ef4444;
    }

    .alert-card.info {
      background: #dbeafe;
      border-left-color: #3b82f6;
    }

    .alert-icon {
      font-size: 24px;
    }

    .alert-content {
      flex: 1;
    }

    .alert-content h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 4px 0;
    }

    .alert-content p {
      color: #64748b;
      margin: 0 0 12px 0;
      font-size: 0.875rem;
    }

    .activity-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .activity-container {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .activity-container h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 20px 0;
    }

    .activity-table {
      overflow-x: auto;
    }

    .activity-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .activity-table th,
    .activity-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #f1f5f9;
    }

    .activity-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .activity-table td {
      color: #64748b;
      font-size: 0.875rem;
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

    .products-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .product-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .product-rank {
      width: 32px;
      height: 32px;
      background: #3730a3;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .product-info {
      flex: 1;
    }

    .product-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .product-stats {
      display: flex;
      gap: 16px;
      font-size: 0.875rem;
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
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .alerts-grid {
        grid-template-columns: 1fr;
      }

      .activity-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardOverviewComponent implements OnInit {
  metrics: DashboardMetrics | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getDashboardMetrics().subscribe({
      next: (response) => {
        this.metrics = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard metrics:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
      }
    });
  }


  refreshData(): void {
    this.loadDashboard();
  }

  viewAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  viewOrder(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  hasAlerts(): boolean {
    return this.metrics ? 
      (this.metrics.pendingReviews > 0 || this.metrics.lowStockProducts > 0 || this.metrics.pendingSuppliers > 0) : 
      false;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
