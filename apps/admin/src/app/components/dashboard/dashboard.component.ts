import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ApiService, DashboardStats, RecentOrder, ChartData } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  salesChart: any;
  productsChart: any;
  
  stats: DashboardStats = {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeSuppliers: 0
  };

  recentOrders: RecentOrder[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load all dashboard data in parallel
    Promise.all([
      this.loadStats(),
      this.loadRecentOrders(),
      this.loadChartData()
    ]).finally(() => {
      this.loading = false;
    });
  }

  loadStats(): Promise<void> {
    return this.apiService.getDashboardStats().toPromise()
      .then((data) => {
        if (data) {
          this.stats = data;
        }
      })
      .catch((error) => {
        console.error('Failed to load dashboard stats:', error);
        this.error = 'Không thể tải thống kê dashboard';
      });
  }

  loadRecentOrders(): Promise<void> {
    return this.apiService.getRecentOrders(5).toPromise()
      .then((orders) => {
        if (orders) {
          this.recentOrders = orders;
        }
      })
      .catch((error) => {
        console.error('Failed to load recent orders:', error);
        this.error = 'Không thể tải đơn hàng gần đây';
      });
  }

  loadChartData(): Promise<void> {
    return Promise.all([
      this.apiService.getSalesChartData().toPromise(),
      this.apiService.getProductsChartData().toPromise()
    ]).then(([salesData, productsData]) => {
      if (salesData) {
        this.initSalesChart(salesData);
      }
      if (productsData) {
        this.initProductsChart(productsData);
      }
    }).catch((error) => {
      console.error('Failed to load chart data:', error);
      this.error = 'Không thể tải dữ liệu biểu đồ';
    });
  }

  initSalesChart(data?: ChartData): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (ctx) {
      // Destroy existing chart if it exists
      if (this.salesChart) {
        this.salesChart.destroy();
      }

      const chartData = data || {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [{
          label: 'Doanh thu (triệu VND)',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: '#3f51b5',
          backgroundColor: 'rgba(63, 81, 181, 0.1)',
          tension: 0.4
        }]
      };

      this.salesChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Doanh thu theo tháng'
            }
          }
        }
      });
    }
  }

  initProductsChart(data?: ChartData): void {
    const ctx = document.getElementById('productsChart') as HTMLCanvasElement;
    if (ctx) {
      // Destroy existing chart if it exists
      if (this.productsChart) {
        this.productsChart.destroy();
      }

      const chartData = data || {
        labels: ['Sơn nội thất', 'Sơn ngoại thất', 'Sơn chống thấm', 'Sơn chống cháy'],
        datasets: [{
          label: 'Số lượng sản phẩm',
          data: [0, 0, 0, 0],
          backgroundColor: [
            '#3f51b5',
            '#ff9800',
            '#4caf50',
            '#f44336'
          ]
        }]
      };

      this.productsChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Phân bố sản phẩm'
            }
          }
        }
      });
    }
  }
}
