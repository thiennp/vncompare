import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, DashboardMetrics, Product, Order } from '../../services/api.service';

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
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
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
      <div class="analytics-grid">
        <!-- Revenue Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Revenue Overview</h3>
            <div class="chart-period">
              <select [(ngModel)]="selectedPeriod">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div class="bar" *ngFor="let bar of revenueBars" [style.height.%]="bar.height"></div>
            </div>
            <div class="chart-labels">
              <span *ngFor="let label of chartLabels">{{ label }}</span>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Top Products</h3>
          </div>
          <div class="product-list">
            <div class="product-item" *ngFor="let product of topProducts">
              <div class="product-info">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-brand">{{ product.brand }}</span>
              </div>
              <div class="product-metrics">
                <span class="product-sales">{{ product.sales }} sales</span>
                <span class="product-revenue">₫{{ product.revenue | number }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-grid">
        <!-- Recent Orders -->
        <div class="activity-card">
          <div class="activity-header">
            <h3>Recent Orders</h3>
            <a routerLink="/orders" class="view-all">View All</a>
          </div>
          <div class="order-list">
            <div class="order-item" *ngFor="let order of recentOrders">
              <div class="order-info">
                <span class="order-id">{{ order.id }}</span>
                <span class="order-customer">{{ order.customer }}</span>
                <span class="order-product">{{ order.product }}</span>
              </div>
              <div class="order-details">
                <span class="order-amount">₫{{ order.amount | number }}</span>
                <span class="order-status" [class]="order.status">{{ order.status }}</span>
                <span class="order-date">{{ order.date }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Low Stock Products -->
        <div class="activity-card">
          <div class="activity-header">
            <h3>Low Stock Alert</h3>
            <a routerLink="/products" class="view-all">Manage</a>
          </div>
          <div class="stock-list">
            <div class="stock-item" *ngFor="let product of lowStockProducts">
              <div class="product-info">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-brand">{{ product.brand }}</span>
              </div>
              <div class="stock-info">
                <span class="stock-level" [class]="product.stockLevel">{{ product.stock }} left</span>
                <button class="btn btn-sm btn-primary">Reorder</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <button class="action-btn" routerLink="/products/new">
            <span class="action-icon">➕</span>
            <span>Add Product</span>
          </button>
          <button class="action-btn" routerLink="/orders/new">
            <span class="action-icon">🛒</span>
            <span>Create Order</span>
          </button>
          <button class="action-btn" routerLink="/suppliers/new">
            <span class="action-icon">🏢</span>
            <span>Add Supplier</span>
          </button>
          <button class="action-btn" routerLink="/analytics">
            <span class="action-icon">📊</span>
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
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
      border-radius: 12px;
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
      grid-template-columns: 2fr 1fr;
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
      margin-bottom: 24px;
    }

    .chart-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .chart-period select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
    }

    .chart-placeholder {
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .chart-bars {
      display: flex;
      align-items: end;
      gap: 8px;
      height: 150px;
    }

    .bar {
      flex: 1;
      background: linear-gradient(to top, #3b82f6, #60a5fa);
      border-radius: 4px 4px 0 0;
      min-height: 20px;
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #64748b;
    }

    .product-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .product-item:last-child {
      border-bottom: none;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .product-name {
      font-weight: 500;
      color: #1e293b;
    }

    .product-brand {
      font-size: 0.875rem;
      color: #64748b;
    }

    .product-metrics {
      display: flex;
      flex-direction: column;
      align-items: end;
      gap: 4px;
    }

    .product-sales {
      font-size: 0.875rem;
      color: #64748b;
    }

    .product-revenue {
      font-weight: 600;
      color: #059669;
    }

    .activity-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .activity-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .activity-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .view-all {
      color: #3b82f6;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .order-list, .stock-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .order-item, .stock-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .order-item:last-child, .stock-item:last-child {
      border-bottom: none;
    }

    .order-info, .product-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .order-id, .product-name {
      font-weight: 500;
      color: #1e293b;
    }

    .order-customer, .order-product, .product-brand {
      font-size: 0.875rem;
      color: #64748b;
    }

    .order-details, .stock-info {
      display: flex;
      flex-direction: column;
      align-items: end;
      gap: 4px;
    }

    .order-amount, .product-revenue {
      font-weight: 600;
      color: #059669;
    }

    .order-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .order-status.pending {
      background-color: #fef3c7;
      color: #92400e;
    }

    .order-status.processing {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .order-status.shipped {
      background-color: #e0e7ff;
      color: #3730a3;
    }

    .order-status.delivered {
      background-color: #d1fae5;
      color: #065f46;
    }

    .order-date {
      font-size: 0.75rem;
      color: #64748b;
    }

    .stock-level {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .stock-level.low {
      color: #dc2626;
    }

    .stock-level.medium {
      color: #d97706;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 0.75rem;
    }

    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .quick-actions h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 20px 0;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: #374151;
    }

    .action-btn:hover {
      background: #e2e8f0;
      border-color: #cbd5e1;
    }

    .action-icon {
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .analytics-grid,
      .activity-grid {
        grid-template-columns: 1fr;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
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
  topProducts: Product[] = [];
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
        // Fallback to mock data
        this.loadMockData();
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
        this.recentOrders = response.data.map(order => ({
          id: order.id,
          customer: order.customerName,
          product: order.products[0]?.productName || 'Multiple products',
          amount: order.totalAmount,
          status: order.status,
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
          .filter(product => product.stock < 20)
          .slice(0, 3)
          .map(product => ({
            name: product.name,
            brand: product.brand,
            stock: product.stock,
            stockLevel: product.stock < 10 ? 'low' : 'medium'
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

  loadMockData(): void {
    // Fallback mock data when API fails
    this.metrics = [
      {
        title: 'Total Revenue',
        value: '₫45,250,000',
        change: '+12.5%',
        changeType: 'positive',
        icon: '💰',
        color: '#10b981'
      },
      {
        title: 'Orders Today',
        value: '23',
        change: '+8.2%',
        changeType: 'positive',
        icon: '🛒',
        color: '#3b82f6'
      },
      {
        title: 'Active Products',
        value: '156',
        change: '+3',
        changeType: 'positive',
        icon: '📦',
        color: '#8b5cf6'
      },
      {
        title: 'Service Areas',
        value: '12',
        change: '0%',
        changeType: 'neutral',
        icon: '📍',
        color: '#f59e0b'
      }
    ];

    this.revenueBars = [
      { height: 65 },
      { height: 78 },
      { height: 82 },
      { height: 75 },
      { height: 88 },
      { height: 92 },
      { height: 85 }
    ];

    this.topProducts = [
      { name: 'Dulux Weathershield', brand: 'Dulux', sales: 45, revenue: 12500000 } as any,
      { name: 'Jotun Lady', brand: 'Jotun', sales: 32, revenue: 8500000 } as any,
      { name: 'Kova Premium', brand: 'Kova', sales: 28, revenue: 21000000 } as any,
      { name: 'Nippon Paint', brand: 'Nippon', sales: 24, revenue: 9800000 } as any
    ];

    this.recentOrders = [
      {
        id: 'ORD-001',
        customer: 'Nguyen Van A',
        product: 'Dulux Weathershield',
        amount: 1250000,
        status: 'delivered',
        date: '2024-01-15'
      },
      {
        id: 'ORD-002',
        customer: 'Tran Thi B',
        product: 'Jotun Lady',
        amount: 850000,
        status: 'shipped',
        date: '2024-01-15'
      },
      {
        id: 'ORD-003',
        customer: 'Le Van C',
        product: 'Kova Premium',
        amount: 2100000,
        status: 'processing',
        date: '2024-01-14'
      },
      {
        id: 'ORD-004',
        customer: 'Pham Thi D',
        product: 'Nippon Paint',
        amount: 980000,
        status: 'pending',
        date: '2024-01-14'
      }
    ];

    this.lowStockProducts = [
      { name: 'Dulux Weathershield', brand: 'Dulux', stock: 5, stockLevel: 'low' },
      { name: 'Jotun Lady', brand: 'Jotun', stock: 12, stockLevel: 'medium' },
      { name: 'Kova Premium', brand: 'Kova', stock: 3, stockLevel: 'low' }
    ];
  }
}
