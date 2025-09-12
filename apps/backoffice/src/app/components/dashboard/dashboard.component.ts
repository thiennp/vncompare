import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, DashboardMetrics, Product as ApiProduct, Order as ApiOrder } from '../../services/api.service';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your business today.</p>
        <button class="btn btn-outline" (click)="loadDashboardData()" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="error">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
          <button class="btn btn-sm btn-outline" (click)="loadDashboardData()">Retry</button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading && !error">
        <div class="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <!-- Metrics Cards -->
      <div class="metrics-grid" *ngIf="!loading || metrics.length > 0">
        <div class="metric-card" *ngFor="let metric of metrics">
          <div class="metric-icon" [style.background-color]="metric.color">
            <span>{{ metric.icon }}</span>
          </div>
          <div class="metric-content">
            <h3>{{ metric.title }}</h3>
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-change" [class]="metric.changeType">
              {{ metric.change }}
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Analytics -->
      <div class="analytics-grid" *ngIf="!loading">
        <!-- Revenue Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Revenue Trend</h3>
            <select [(ngModel)]="selectedPeriod" class="period-select">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <div class="chart-content">
            <div class="revenue-chart">
              <div class="chart-bars">
                <div class="chart-bar" *ngFor="let bar of revenueBars" [style.height.%]="bar.height"></div>
              </div>
              <div class="chart-labels">
                <span *ngFor="let label of chartLabels">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Top Products</h3>
          </div>
          <div class="chart-content">
            <div class="top-products">
              <div class="product-item" *ngFor="let product of topProducts; let i = index">
                <div class="product-rank">{{ i + 1 }}</div>
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-brand">{{ product.brand }}</div>
                </div>
                <div class="product-metrics">
                  <div class="product-rating">⭐ {{ product.rating || 0 }}</div>
                  <div class="product-reviews">({{ product.totalReviews || 0 }})</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="recent-section" *ngIf="!loading">
        <div class="section-header">
          <h3>Recent Orders</h3>
          <a href="/orders" class="view-all-link">View All</a>
        </div>
        <div class="orders-list">
          <div class="order-item" *ngFor="let order of recentOrders">
            <div class="order-info">
              <div class="order-id">{{ order.id }}</div>
              <div class="order-customer">{{ order.customer }}</div>
              <div class="order-product">{{ order.product }}</div>
            </div>
            <div class="order-amount">₫{{ order.amount | number }}</div>
            <div class="order-status" [class]="order.status">{{ order.status }}</div>
            <div class="order-date">{{ order.date }}</div>
          </div>
        </div>
      </div>

      <!-- Low Stock Alert -->
      <div class="alert-section" *ngIf="!loading && lowStockProducts.length > 0">
        <div class="section-header">
          <h3>Low Stock Alert</h3>
        </div>
        <div class="alert-list">
          <div class="alert-item" *ngFor="let product of lowStockProducts">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <div class="alert-title">{{ product.name }}</div>
              <div class="alert-subtitle">{{ product.brand }}</div>
            </div>
            <div class="alert-stock" [class]="product.stockLevel">
              {{ product.stock }} left
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .dashboard-header p {
      color: #64748b;
      font-size: 1.1rem;
      margin: 0;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .metric-content h3 {
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      margin: 0 0 4px 0;
    }

    .metric-value {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 4px 0;
    }

    .metric-change {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .metric-change.positive {
      color: #059669;
    }

    .metric-change.negative {
      color: #dc2626;
    }

    .metric-change.neutral {
      color: #64748b;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .chart-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .period-select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      font-size: 0.875rem;
    }

    .revenue-chart {
      height: 200px;
      display: flex;
      flex-direction: column;
    }

    .chart-bars {
      display: flex;
      align-items: end;
      gap: 8px;
      height: 150px;
      margin-bottom: 16px;
    }

    .chart-bar {
      flex: 1;
      background: linear-gradient(to top, #3b82f6, #60a5fa);
      border-radius: 4px 4px 0 0;
      min-height: 20px;
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748b;
    }

    .top-products {
      max-height: 200px;
      overflow-y: auto;
    }

    .product-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .product-item:last-child {
      border-bottom: none;
    }

    .product-rank {
      width: 24px;
      height: 24px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .product-info {
      flex: 1;
    }

    .product-name {
      font-weight: 500;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .product-brand {
      font-size: 0.875rem;
      color: #64748b;
    }

    .product-metrics {
      text-align: right;
    }

    .product-rating {
      font-size: 0.875rem;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .product-reviews {
      font-size: 0.75rem;
      color: #64748b;
    }

    .recent-section, .alert-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .view-all-link {
      color: #3b82f6;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .view-all-link:hover {
      text-decoration: underline;
    }

    .orders-list, .alert-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .order-item, .alert-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #f8fafc;
    }

    .order-info {
      flex: 1;
    }

    .order-id {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .order-customer {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 2px;
    }

    .order-product {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .order-amount {
      font-weight: 600;
      color: #059669;
    }

    .order-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .order-status.pending {
      background: #fef3c7;
      color: #d97706;
    }

    .order-status.processing {
      background: #dbeafe;
      color: #2563eb;
    }

    .order-status.shipped {
      background: #d1fae5;
      color: #059669;
    }

    .order-status.delivered {
      background: #d1fae5;
      color: #059669;
    }

    .order-status.cancelled {
      background: #fee2e2;
      color: #dc2626;
    }

    .order-date {
      font-size: 0.75rem;
      color: #64748b;
    }

    .alert-icon {
      font-size: 1.25rem;
    }

    .alert-content {
      flex: 1;
    }

    .alert-title {
      font-weight: 500;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .alert-subtitle {
      font-size: 0.875rem;
      color: #64748b;
    }

    .alert-stock {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .alert-stock.low {
      background: #fee2e2;
      color: #dc2626;
    }

    .alert-stock.medium {
      background: #fef3c7;
      color: #d97706;
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

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 16px;
      }

      .analytics-grid {
        grid-template-columns: 1fr;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  selectedPeriod = '30d';
  loading = true;
  error: string | null = null;
  
  metrics: MetricCard[] = [];
  dashboardData: DashboardMetrics | null = null;

  revenueBars: { height: number }[] = [];
  chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  topProducts: ApiProduct[] = [];
  recentOrders: RecentOrder[] = [];
  lowStockProducts: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load dashboard metrics
    this.apiService.getDashboardAnalytics().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.updateMetrics(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });

    // Load top products
    this.apiService.getTopProducts(4).subscribe({
      next: (products) => {
        this.topProducts = products;
      },
      error: (error) => {
        console.error('Error loading top products:', error);
      }
    });

    // Load recent orders
    this.apiService.getOrders({ limit: 4, page: 1 }).subscribe({
      next: (response) => {
        this.recentOrders = response.data.map((order: ApiOrder) => ({
          id: order.id,
          customer: order.customerName,
          product: order.products[0]?.productName || 'Multiple products',
          amount: order.totalAmount,
          status: order.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
          date: new Date(order.createdAt).toISOString().split('T')[0]
        }));
      },
      error: (error) => {
        console.error('Error loading recent orders:', error);
      }
    });

    // Load low stock products
    this.apiService.getProducts({ limit: 10, page: 1 }).subscribe({
      next: (response) => {
        this.lowStockProducts = response.products
          .filter((product: ApiProduct) => (product.stock || 0) < 20)
          .slice(0, 3)
          .map((product: ApiProduct) => ({
            name: product.name,
            brand: product.brand,
            stock: product.stock || 0,
            stockLevel: (product.stock || 0) < 10 ? 'low' : 'medium'
          }));
      },
      error: (error) => {
        console.error('Error loading low stock products:', error);
      }
    });
  }

  updateMetrics(data: DashboardMetrics): void {
    this.metrics = [
      {
        title: 'Total Revenue',
        value: `₫${data.totalRevenue.toLocaleString()}`,
        change: `${data.revenueChange > 0 ? '+' : ''}${data.revenueChange}%`,
        changeType: data.revenueChange > 0 ? 'positive' : data.revenueChange < 0 ? 'negative' : 'neutral',
        icon: '💰',
        color: '#10b981'
      },
      {
        title: 'Total Orders',
        value: data.totalOrders.toString(),
        change: `${data.ordersChange > 0 ? '+' : ''}${data.ordersChange}%`,
        changeType: data.ordersChange > 0 ? 'positive' : data.ordersChange < 0 ? 'negative' : 'neutral',
        icon: '🛒',
        color: '#3b82f6'
      },
      {
        title: 'Active Products',
        value: data.activeProducts.toString(),
        change: `${data.productsChange > 0 ? '+' : ''}${data.productsChange}%`,
        changeType: data.productsChange > 0 ? 'positive' : data.productsChange < 0 ? 'negative' : 'neutral',
        icon: '📦',
        color: '#8b5cf6'
      },
      {
        title: 'Service Areas',
        value: data.serviceAreas.toString(),
        change: `${data.areasChange > 0 ? '+' : ''}${data.areasChange}%`,
        changeType: data.areasChange > 0 ? 'positive' : data.areasChange < 0 ? 'negative' : 'neutral',
        icon: '📍',
        color: '#f59e0b'
      }
    ];
  }

}