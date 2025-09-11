import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Order, PaginatedResponse } from '../../services/api.service';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
}

interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Address {
  street: string;
  ward: string;
  district: string;
  province: string;
  postalCode: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="orders-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Order Management</h1>
          <p>Track and manage customer orders</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="loadOrders()" [disabled]="loading">
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
          <button class="btn btn-outline" (click)="exportOrders()">
            📤 Export
          </button>
          <button class="btn btn-primary" (click)="createOrder()">
            ➕ Create Order
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="error">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
          <button class="btn btn-sm btn-outline" (click)="loadOrders()">Retry</button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading && !error">
        <div class="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search orders..." 
            [(ngModel)]="searchTerm"
            (input)="filterOrders()"
            class="search-input">
        </div>
        <div class="filter-controls">
          <select [(ngModel)]="statusFilter" (change)="filterOrders()" class="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select [(ngModel)]="paymentFilter" (change)="filterOrders()" class="filter-select">
            <option value="">All Payments</option>
            <option value="pending">Pending Payment</option>
            <option value="paid">Paid</option>
            <option value="failed">Payment Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <input 
            type="date" 
            [(ngModel)]="dateFilter" 
            (change)="filterOrders()"
            class="filter-date">
        </div>
      </div>

      <!-- Orders Table -->
      <div class="orders-table-container">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of filteredOrders">
              <td class="order-id">{{ order.id }}</td>
              <td class="customer-cell">
                <div class="customer-info">
                  <div class="customer-name">{{ order.customerName }}</div>
                  <div class="customer-details">
                    <span>{{ order.customerEmail }}</span>
                    <span>{{ order.customerPhone }}</span>
                  </div>
                </div>
              </td>
              <td class="products-cell">
                <div class="products-list">
                  <div *ngFor="let product of order.products" class="product-item">
                    <span class="product-name">{{ product.productName }}</span>
                    <span class="product-quantity">x{{ product.quantity }}</span>
                  </div>
                </div>
              </td>
              <td class="total-cell">₫{{ order.totalAmount | number }}</td>
              <td>
                <span class="status-badge" [class]="order.status">
                  {{ order.status | titlecase }}
                </span>
              </td>
              <td>
                <span class="payment-badge" [class]="order.paymentStatus">
                  {{ order.paymentStatus | titlecase }}
                </span>
              </td>
              <td class="date-cell">
                <div class="date-info">
                  <div>{{ order.createdAt | date:'short' }}</div>
                  <div class="delivery-date" *ngIf="order.estimatedDelivery">
                    Est: {{ order.estimatedDelivery | date:'short' }}
                  </div>
                </div>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="btn-icon" (click)="viewOrder(order)" title="View">
                    👁️
                  </button>
                  <button class="btn-icon" (click)="editOrder(order)" title="Edit">
                    ✏️
                  </button>
                  <button class="btn-icon" (click)="trackOrder(order)" title="Track">
                    📍
                  </button>
                  <button class="btn-icon" (click)="printOrder(order)" title="Print">
                    🖨️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Order Statistics -->
      <div class="order-stats">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalOrders }}</div>
            <div class="stat-label">Total Orders</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-value">₫{{ totalRevenue | number }}</div>
            <div class="stat-label">Total Revenue</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingOrders }}</div>
            <div class="stat-label">Pending Orders</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🚚</div>
          <div class="stat-content">
            <div class="stat-value">{{ shippedOrders }}</div>
            <div class="stat-label">Shipped Today</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page {
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

    .filter-select, .filter-date {
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      font-size: 14px;
      min-width: 150px;
    }

    .orders-table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 24px;
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
    }

    .orders-table th {
      background: #f8fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e2e8f0;
    }

    .orders-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .orders-table tr:hover {
      background: #f8fafc;
    }

    .order-id {
      font-weight: 600;
      color: #3730a3;
    }

    .customer-cell {
      min-width: 200px;
    }

    .customer-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .customer-name {
      font-weight: 600;
      color: #1e293b;
    }

    .customer-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 0.875rem;
      color: #64748b;
    }

    .products-cell {
      min-width: 250px;
    }

    .products-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .product-name {
      color: #1e293b;
    }

    .product-quantity {
      color: #64748b;
      font-weight: 500;
    }

    .total-cell {
      font-weight: 600;
      color: #059669;
    }

    .status-badge, .payment-badge {
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

    .status-badge.processing {
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

    .status-badge.cancelled {
      background: #fee2e2;
      color: #dc2626;
    }

    .payment-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .payment-badge.paid {
      background: #d1fae5;
      color: #065f46;
    }

    .payment-badge.failed {
      background: #fee2e2;
      color: #dc2626;
    }

    .payment-badge.refunded {
      background: #f3e8ff;
      color: #7c3aed;
    }

    .date-cell {
      min-width: 120px;
    }

    .date-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.875rem;
    }

    .delivery-date {
      color: #64748b;
    }

    .actions-cell {
      width: 150px;
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

    .order-stats {
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

    .btn-primary {
      background-color: #3730a3;
      color: white;
      border-color: #3730a3;
    }

    .btn-primary:hover {
      background-color: #312e81;
      border-color: #312e81;
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

      .orders-table-container {
        overflow-x: auto;
      }

      .order-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  searchTerm = '';
  statusFilter = '';
  paymentFilter = '';
  dateFilter = '';
  loading = false;
  error: string | null = null;

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    const params = {
      page: 1,
      limit: 50,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined,
      paymentStatus: this.paymentFilter || undefined,
      sort: 'createdAt:desc'
    };

    this.apiService.getOrders(params).subscribe({
      next: (response: PaginatedResponse<Order>) => {
        this.orders = response.data;
        this.filteredOrders = [...this.orders];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders';
        this.loading = false;
        // Fallback to mock data
        this.loadMockData();
      }
    });
  }

  loadMockData(): void {
    this.orders = [
    {
      id: 'ORD-001',
      customerName: 'Nguyen Van A',
      customerEmail: 'nguyenvana@email.com',
      customerPhone: '+84901234567',
      products: [
        { productId: '1', productName: 'Dulux Weathershield', quantity: 2, unitPrice: 1250000, totalPrice: 2500000 },
        { productId: '2', productName: 'Jotun Lady', quantity: 1, unitPrice: 850000, totalPrice: 850000 }
      ],
      totalAmount: 3350000,
      status: 'delivered',
      paymentStatus: 'paid',
      shippingAddress: {
        street: '123 Le Loi Street',
        ward: 'Ward 1',
        district: 'District 1',
        province: 'Ho Chi Minh City',
        postalCode: '700000'
      },
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      estimatedDelivery: '2024-01-18T00:00:00Z'
    },
    {
      id: 'ORD-002',
      customerName: 'Tran Thi B',
      customerEmail: 'tranthib@email.com',
      customerPhone: '+84901234568',
      products: [
        { productId: '3', productName: 'Kova Premium', quantity: 1, unitPrice: 2100000, totalPrice: 2100000 }
      ],
      totalAmount: 2100000,
      status: 'shipped',
      paymentStatus: 'paid',
      shippingAddress: {
        street: '456 Nguyen Hue Boulevard',
        ward: 'Ward 2',
        district: 'District 1',
        province: 'Ho Chi Minh City',
        postalCode: '700000'
      },
      createdAt: '2024-01-15T14:15:00Z',
      updatedAt: '2024-01-16T09:30:00Z',
      estimatedDelivery: '2024-01-19T00:00:00Z'
    }
  ];

  filteredOrders: Order[] = [];

  get totalOrders(): number {
    return this.orders.length;
  }

  get totalRevenue(): number {
    return this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  get pendingOrders(): number {
    return this.orders.filter(order => order.status === 'pending').length;
  }

  get shippedOrders(): number {
    return this.orders.filter(order => order.status === 'shipped').length;
  }

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];
  }

  filterOrders(): void {
    // Reload orders with new filters
    this.loadOrders();
  }

  viewOrder(order: Order): void {
    console.log('View order:', order);
  }

  editOrder(order: Order): void {
    console.log('Edit order:', order);
  }

  trackOrder(order: Order): void {
    console.log('Track order:', order);
  }

  printOrder(order: Order): void {
    console.log('Print order:', order);
  }

  createOrder(): void {
    console.log('Create order clicked');
  }

  exportOrders(): void {
    console.log('Export orders clicked');
  }
}
