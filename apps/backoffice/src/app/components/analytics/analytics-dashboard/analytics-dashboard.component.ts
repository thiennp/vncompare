import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  usersGrowth: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  topSuppliers: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="analytics-dashboard-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Analytics Dashboard</h1>
          <p>Real-time business insights and performance metrics</p>
        </div>
        <div class="header-actions">
          <select [(ngModel)]="selectedPeriod" (change)="onPeriodChange()" class="form-select">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button class="btn btn-primary" (click)="refreshData()">
            Refresh Data
          </button>
        </div>
      </div>

      <div class="analytics-content" *ngIf="analyticsData">
        <!-- Key Metrics -->
        <div class="metrics-section">
          <h2>Key Metrics</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon revenue">
                <span>💰</span>
              </div>
              <div class="metric-content">
                <div class="metric-value">₫{{ analyticsData.totalRevenue | number }}</div>
                <div class="metric-label">Total Revenue</div>
                <div class="metric-change" [class]="analyticsData.revenueGrowth >= 0 ? 'positive' : 'negative'">
                  {{ analyticsData.revenueGrowth >= 0 ? '+' : '' }}{{ analyticsData.revenueGrowth }}%
                </div>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon orders">
                <span>🛒</span>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ analyticsData.totalOrders | number }}</div>
                <div class="metric-label">Total Orders</div>
                <div class="metric-change" [class]="analyticsData.ordersGrowth >= 0 ? 'positive' : 'negative'">
                  {{ analyticsData.ordersGrowth >= 0 ? '+' : '' }}{{ analyticsData.ordersGrowth }}%
                </div>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon products">
                <span>📦</span>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ analyticsData.totalProducts | number }}</div>
                <div class="metric-label">Total Products</div>
                <div class="metric-change" [class]="analyticsData.productsGrowth >= 0 ? 'positive' : 'negative'">
                  {{ analyticsData.productsGrowth >= 0 ? '+' : '' }}{{ analyticsData.productsGrowth }}%
                </div>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon users">
                <span>👥</span>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ analyticsData.totalUsers | number }}</div>
                <div class="metric-label">Total Users</div>
                <div class="metric-change" [class]="analyticsData.usersGrowth >= 0 ? 'positive' : 'negative'">
                  {{ analyticsData.usersGrowth >= 0 ? '+' : '' }}{{ analyticsData.usersGrowth }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="chart-container">
            <h3>Revenue Trend</h3>
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div 
                  *ngFor="let data of analyticsData.monthlyRevenue" 
                  class="chart-bar"
                  [style.height.%]="getBarHeight(data.revenue)">
                  <div class="bar-value">₫{{ data.revenue | number }}</div>
                </div>
              </div>
              <div class="chart-labels">
                <span *ngFor="let data of analyticsData.monthlyRevenue">{{ data.month }}</span>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h3>Orders Trend</h3>
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div 
                  *ngFor="let data of analyticsData.monthlyRevenue" 
                  class="chart-bar"
                  [style.height.%]="getBarHeight(data.orders)">
                  <div class="bar-value">{{ data.orders }}</div>
                </div>
              </div>
              <div class="chart-labels">
                <span *ngFor="let data of analyticsData.monthlyRevenue">{{ data.month }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Performers -->
        <div class="performers-section">
          <div class="performer-container">
            <h3>Top Products</h3>
            <div class="performer-list">
              <div 
                *ngFor="let product of analyticsData.topProducts; let i = index" 
                class="performer-item">
                <div class="performer-rank">{{ i + 1 }}</div>
                <div class="performer-info">
                  <div class="performer-name">{{ product.name }}</div>
                  <div class="performer-stats">
                    <span>{{ product.sales }} sales</span>
                    <span>₫{{ product.revenue | number }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="performer-container">
            <h3>Top Suppliers</h3>
            <div class="performer-list">
              <div 
                *ngFor="let supplier of analyticsData.topSuppliers; let i = index" 
                class="performer-item">
                <div class="performer-rank">{{ i + 1 }}</div>
                <div class="performer-info">
                  <div class="performer-name">{{ supplier.name }}</div>
                  <div class="performer-stats">
                    <span>{{ supplier.orders }} orders</span>
                    <span>₫{{ supplier.revenue | number }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="activity-section">
          <h3>Recent Orders</h3>
          <div class="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of analyticsData.recentOrders">
                  <td>{{ order.id }}</td>
                  <td>{{ order.customerName }}</td>
                  <td>₫{{ order.totalAmount | number }}</td>
                  <td>
                    <span class="status-badge" [class]="order.status">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading analytics data...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadAnalytics()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .analytics-dashboard-page {
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
      align-items: center;
    }

    .form-select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      background-color: white;
      color: #1f2937;
    }

    .form-select:focus {
      outline: none;
      border-color: #3730a3;
      box-shadow: 0 0 0 3px rgba(55, 48, 163, 0.1);
    }

    .analytics-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .metrics-section h2,
    .performer-container h3,
    .activity-section h3 {
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
    }

    .metric-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .metric-icon.revenue {
      background: #fef3c7;
    }

    .metric-icon.orders {
      background: #dbeafe;
    }

    .metric-icon.products {
      background: #d1fae5;
    }

    .metric-icon.users {
      background: #e0e7ff;
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

    .charts-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .chart-container {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .chart-container h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 20px 0;
    }

    .chart-placeholder {
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      height: 250px;
      padding: 0 20px;
    }

    .chart-bar {
      flex: 1;
      background: #3730a3;
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 20px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 8px;
    }

    .bar-value {
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      text-align: center;
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-top: 8px;
    }

    .chart-labels span {
      font-size: 0.75rem;
      color: #64748b;
    }

    .performers-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .performer-container {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .performer-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .performer-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .performer-rank {
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

    .performer-info {
      flex: 1;
    }

    .performer-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .performer-stats {
      display: flex;
      gap: 16px;
      font-size: 0.875rem;
      color: #64748b;
    }

    .activity-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
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
    }

    .activity-table td {
      color: #64748b;
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

      .charts-section,
      .performers-section {
        grid-template-columns: 1fr;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AnalyticsDashboardComponent implements OnInit {
  analyticsData: AnalyticsData | null = null;
  selectedPeriod = '30';
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading = true;
    this.error = null;

    // Note: This would need to be implemented in the API service
    // For now, we'll load mock data
    this.loadMockAnalytics();
  }

  loadMockAnalytics(): void {
    this.analyticsData = {
      totalRevenue: 125000000,
      totalOrders: 1250,
      totalProducts: 150,
      totalUsers: 850,
      revenueGrowth: 15.5,
      ordersGrowth: 8.2,
      productsGrowth: 12.3,
      usersGrowth: 6.7,
      topProducts: [
        { id: 'PROD-001', name: 'Dulux Weathershield Exterior Paint', sales: 125, revenue: 15000000 },
        { id: 'PROD-002', name: 'Jotun Lady Interior Paint', sales: 98, revenue: 12000000 },
        { id: 'PROD-003', name: 'Kova Premium Primer', sales: 87, revenue: 10000000 },
        { id: 'PROD-004', name: 'Nippon Paint Exterior', sales: 76, revenue: 9500000 },
        { id: 'PROD-005', name: 'Sika Paint Interior', sales: 65, revenue: 8000000 }
      ],
      topSuppliers: [
        { id: 'SUP-001', name: 'Dulux Vietnam', orders: 450, revenue: 50000000 },
        { id: 'SUP-002', name: 'Jotun Vietnam', orders: 320, revenue: 35000000 },
        { id: 'SUP-003', name: 'Kova Paint', orders: 280, revenue: 30000000 },
        { id: 'SUP-004', name: 'Nippon Paint', orders: 200, revenue: 25000000 }
      ],
      recentOrders: [
        { id: 'ORD-001', customerName: 'Nguyen Van A', totalAmount: 3350000, status: 'delivered', createdAt: '2024-01-15T10:30:00Z' },
        { id: 'ORD-002', customerName: 'Tran Thi B', totalAmount: 2100000, status: 'shipped', createdAt: '2024-01-15T09:15:00Z' },
        { id: 'ORD-003', customerName: 'Le Van C', totalAmount: 1800000, status: 'confirmed', createdAt: '2024-01-15T08:45:00Z' },
        { id: 'ORD-004', customerName: 'Pham Thi D', totalAmount: 4200000, status: 'pending', createdAt: '2024-01-15T07:20:00Z' },
        { id: 'ORD-005', customerName: 'Hoang Van E', totalAmount: 1500000, status: 'delivered', createdAt: '2024-01-14T16:30:00Z' }
      ],
      monthlyRevenue: [
        { month: 'Jan', revenue: 10000000, orders: 100 },
        { month: 'Feb', revenue: 12000000, orders: 120 },
        { month: 'Mar', revenue: 15000000, orders: 150 },
        { month: 'Apr', revenue: 18000000, orders: 180 },
        { month: 'May', revenue: 20000000, orders: 200 },
        { month: 'Jun', revenue: 22000000, orders: 220 }
      ]
    };

    this.loading = false;
  }

  onPeriodChange(): void {
    this.loadAnalytics();
  }

  refreshData(): void {
    this.loadAnalytics();
  }

  getBarHeight(value: number): number {
    if (!this.analyticsData) return 0;
    const maxValue = Math.max(...this.analyticsData.monthlyRevenue.map(d => d.revenue));
    return (value / maxValue) * 100;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
