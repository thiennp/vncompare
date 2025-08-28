import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  salesChart: any;
  productsChart: any;
  
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeSuppliers: 0
  };

  recentOrders = [
    {
      id: 1,
      customer: 'Nguyễn Văn A',
      product: 'Sơn Dulux Nội Thất',
      amount: 2500000,
      status: 'completed',
      date: new Date()
    },
    {
      id: 2,
      customer: 'Trần Thị B',
      product: 'Sơn Jotun Ngoại Thất',
      amount: 1800000,
      status: 'pending',
      date: new Date()
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadStats();
    this.initCharts();
  }

  loadStats(): void {
    // TODO: Load from API
    this.stats = {
      totalProducts: 45,
      totalOrders: 128,
      totalRevenue: 125000000,
      activeSuppliers: 12
    };
  }

  initCharts(): void {
    this.initSalesChart();
    this.initProductsChart();
  }

  initSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (ctx) {
      this.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
          datasets: [{
            label: 'Doanh thu (triệu VND)',
            data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
            borderColor: '#3f51b5',
            backgroundColor: 'rgba(63, 81, 181, 0.1)',
            tension: 0.4
          }]
        },
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

  initProductsChart(): void {
    const ctx = document.getElementById('productsChart') as HTMLCanvasElement;
    if (ctx) {
      this.productsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Sơn nội thất', 'Sơn ngoại thất', 'Sơn chống thấm', 'Sơn chống cháy'],
          datasets: [{
            data: [35, 25, 20, 20],
            backgroundColor: [
              '#3f51b5',
              '#ff9800',
              '#4caf50',
              '#f44336'
            ]
          }]
        },
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
