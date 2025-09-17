import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface AnalyticsData {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  products: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="analytics-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Analytics & Reports</h1>
          <p>Comprehensive business insights and performance metrics</p>
        </div>
        <div class="header-actions">
          <select [(ngModel)]="selectedPeriod" (change)="updateAnalytics()" class="period-select">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button class="btn btn-outline" (click)="exportReport()">
            📊 Export Report
          </button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">💰</div>
          <div class="metric-content">
            <h3>Total Revenue</h3>
            <div class="metric-value">₫{{ totalRevenue | number }}</div>
            <div class="metric-change positive">+{{ revenueChange }}%</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">🛒</div>
          <div class="metric-content">
            <h3>Total Orders</h3>
            <div class="metric-value">{{ totalOrders | number }}</div>
            <div class="metric-change positive">+{{ ordersChange }}%</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">👥</div>
          <div class="metric-content">
            <h3>New Customers</h3>
            <div class="metric-value">{{ newCustomers | number }}</div>
            <div class="metric-change positive">+{{ customersChange }}%</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">📦</div>
          <div class="metric-content">
            <h3>Products Sold</h3>
            <div class="metric-value">{{ productsSold | number }}</div>
            <div class="metric-change positive">+{{ productsChange }}%</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Revenue Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Revenue Trend</h3>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-color" style="background: #3b82f6;"></span>
                Revenue
              </span>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-bars">
              <div class="bar" *ngFor="let value of revenueData" [style.height.%]="(value / maxRevenue) * 100"></div>
            </div>
            <div class="chart-labels">
              <span *ngFor="let label of chartLabels">{{ label }}</span>
            </div>
          </div>
        </div>

        <!-- Orders Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Orders Trend</h3>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-color" style="background: #10b981;"></span>
                Orders
              </span>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-bars">
              <div class="bar" *ngFor="let value of ordersData" [style.height.%]="(value / maxOrders) * 100"></div>
            </div>
            <div class="chart-labels">
              <span *ngFor="let label of chartLabels">{{ label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="top-products">
        <div class="section-header">
          <h3>Top Selling Products</h3>
          <button class="btn btn-outline" (click)="viewAllProducts()">View All</button>
        </div>
        <div class="products-list">
          <div class="product-item" *ngFor="let product of topProducts; let i = index">
            <div class="product-rank">{{ i + 1 }}</div>
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-brand">{{ product.brand }}</div>
            </div>
            <div class="product-metrics">
              <div class="product-sales">{{ product.sales }} sold</div>
              <div class="product-revenue">₫{{ product.revenue | number }}</div>
            </div>
            <div class="product-chart">
              <div class="mini-chart">
                <div class="mini-bar" *ngFor="let value of product.weeklySales" [style.height.%]="(value / product.maxWeeklySales) * 100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Analytics -->
      <div class="customer-analytics">
        <div class="section-header">
          <h3>Customer Insights</h3>
        </div>
        <div class="customer-stats">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalCustomers }}</div>
              <div class="stat-label">Total Customers</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🆕</div>
            <div class="stat-content">
              <div class="stat-value">{{ newCustomers }}</div>
              <div class="stat-label">New This Period</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔄</div>
            <div class="stat-content">
              <div class="stat-value">{{ returningCustomers }}</div>
              <div class="stat-label">Returning</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-value">₫{{ averageOrderValue | number }}</div>
              <div class="stat-label">Avg. Order Value</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Geographic Analytics -->
      <div class="geographic-analytics">
        <div class="section-header">
          <h3>Geographic Distribution</h3>
        </div>
        <div class="geo-stats">
          <div class="geo-item" *ngFor="let region of topRegions">
            <div class="region-info">
              <div class="region-name">{{ region.name }}</div>
              <div class="region-orders">{{ region.orders }} orders</div>
            </div>
            <div class="region-revenue">₫{{ region.revenue | number }}</div>
            <div class="region-chart">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="(region.revenue / maxRegionRevenue) * 100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-page {
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
      align-items: center;
    }

    .period-select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      font-size: 14px;
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
      font-size: 2rem;
    }

    .metric-content h3 {
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      margin: 0 0 8px 0;
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

    .charts-grid {
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
      margin-bottom: 24px;
    }

    .chart-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .chart-legend {
      display: flex;
      gap: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: #64748b;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .chart-container {
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
      min-height: 4px;
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #64748b;
    }

    .top-products {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .products-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .product-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
    }

    .product-rank {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f1f5f9;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .product-info {
      flex: 1;
    }

    .product-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
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

    .product-chart {
      width: 100px;
    }

    .mini-chart {
      display: flex;
      align-items: end;
      gap: 2px;
      height: 40px;
    }

    .mini-bar {
      flex: 1;
      background: #e2e8f0;
      border-radius: 1px;
      min-height: 2px;
    }

    .customer-analytics {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;
    }

    .customer-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .stat-card {
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

    .geographic-analytics {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .geo-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .geo-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
    }

    .region-info {
      flex: 1;
    }

    .region-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .region-orders {
      font-size: 0.875rem;
      color: #64748b;
    }

    .region-revenue {
      font-weight: 600;
      color: #059669;
      min-width: 120px;
      text-align: right;
    }

    .region-chart {
      width: 100px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      border-radius: 4px;
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

      .charts-grid {
        grid-template-columns: 1fr;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .customer-stats {
        grid-template-columns: 1fr;
      }

      .product-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .product-metrics {
        align-items: flex-start;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  selectedPeriod = '30d';
  loading = false;
  error: string | null = null;

  // Analytics data - initialized as empty, will be loaded from API
  totalRevenue = 0;
  totalOrders = 0;
  newCustomers = 0;
  productsSold = 0;

  revenueChange = 0;
  ordersChange = 0;
  customersChange = 0;
  productsChange = 0;

  revenueData: number[] = [];
  ordersData: number[] = [];
  chartLabels: string[] = [];

  get maxRevenue(): number {
    return this.revenueData.length > 0 ? Math.max(...this.revenueData) : 0;
  }

  get maxOrders(): number {
    return this.ordersData.length > 0 ? Math.max(...this.ordersData) : 0;
  }

  topProducts: any[] = [];
  totalCustomers = 0;
  returningCustomers = 0;
  averageOrderValue = 0;

  topRegions: any[] = [];

  get maxRegionRevenue(): number {
    return this.topRegions.length > 0 ? Math.max(...this.topRegions.map(region => region.revenue)) : 0;
  }

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  loadAnalyticsData(): void {
    this.loading = true;
    this.error = null;

    // Load analytics data from API
    this.apiService.getDashboardAnalytics().subscribe({
      next: (data: any) => {
        this.totalRevenue = data.totalRevenue || 0;
        this.totalOrders = data.totalOrders || 0;
        this.newCustomers = data.newCustomers || 0;
        this.productsSold = data.productsSold || 0;
        this.revenueChange = data.revenueChange || 0;
        this.ordersChange = data.ordersChange || 0;
        this.customersChange = data.customersChange || 0;
        this.productsChange = data.productsChange || 0;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading analytics data:', error);
        this.error = 'Failed to load analytics data';
        this.loading = false;
      }
    });

    // Load chart data
    this.apiService.getAnalyticsChartData(this.selectedPeriod).subscribe({
      next: (data: any) => {
        this.revenueData = data.revenueData || [];
        this.ordersData = data.ordersData || [];
        this.chartLabels = data.labels || [];
      },
      error: (error: any) => {
        console.error('Error loading chart data:', error);
      }
    });

    // Load top products
    this.apiService.getTopProducts(3).subscribe({
      next: (products: any[]) => {
        this.topProducts = products.map((product: any) => ({
          name: product.name,
          brand: product.brand,
          sales: product.totalSales || 0,
          revenue: product.totalRevenue || 0,
          weeklySales: product.weeklySales || [],
          maxWeeklySales: product.weeklySales ? Math.max(...product.weeklySales) : 0
        }));
      },
      error: (error: any) => {
        console.error('Error loading top products:', error);
      }
    });

    // Load regional data
    this.apiService.getRegionalAnalytics().subscribe({
      next: (data: any) => {
        this.topRegions = data.regions || [];
      },
      error: (error: any) => {
        console.error('Error loading regional data:', error);
      }
    });
  }

  updateAnalytics(): void {
    console.log('Update analytics for period:', this.selectedPeriod);
    // Update data based on selected period
  }

  viewAllProducts(): void {
    console.log('View all products clicked');
  }

  exportReport(): void {
    console.log('Export report clicked');
  }
}
