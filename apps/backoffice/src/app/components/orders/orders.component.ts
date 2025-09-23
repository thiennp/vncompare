import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Order as ApiOrder, PaginatedResponse } from '../../services/api.service';

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

      <!-- Orders Table -->
      <div class="table-container" *ngIf="!loading || orders.length > 0">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders">
              <td class="order-id">{{ order.id }}</td>
              <td class="customer-cell">
                <div class="customer-info">
                  <div class="customer-name">{{ order.customerName }}</div>
                  <div class="customer-email">{{ order.customerEmail }}</div>
                </div>
              </td>
              <td class="products-cell">
                <div class="products-list">
                  <div class="product-item" *ngFor="let product of order.products">
                    {{ product.productName }} (x{{ product.quantity }})
                  </div>
                </div>
              </td>
              <td class="amount-cell">₫{{ order.totalAmount | number }}</td>
              <td>
                <span class="status-badge" [class]="order.status">
                  {{ order.status }}
                </span>
              </td>
              <td>
                <span class="payment-badge" [class]="order.paymentStatus">
                  {{ order.paymentStatus }}
                </span>
              </td>
              <td class="date-cell">{{ order.createdAt | date:'short' }}</td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="btn-icon" (click)="viewOrder(order)" title="View">
                    👁️
                  </button>
                  <button class="btn-icon" (click)="editOrder(order)" title="Edit">
                    ✏️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .orders-page {
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

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
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
      border-bottom: 1px solid #e5e7eb;
    }

    .orders-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
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
    }

    .customer-name {
      font-weight: 500;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .customer-email {
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
      font-size: 0.875rem;
      color: #374151;
      padding: 2px 0;
    }

    .amount-cell {
      font-weight: 600;
      color: #059669;
    }

    .status-badge, .payment-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #d97706;
    }

    .status-badge.processing {
      background: #dbeafe;
      color: #2563eb;
    }

    .status-badge.shipped {
      background: #d1fae5;
      color: #059669;
    }

    .status-badge.delivered {
      background: #d1fae5;
      color: #059669;
    }

    .status-badge.cancelled {
      background: #fee2e2;
      color: #dc2626;
    }

    .payment-badge.pending {
      background: #fef3c7;
      color: #d97706;
    }

    .payment-badge.paid {
      background: #d1fae5;
      color: #059669;
    }

    .payment-badge.failed {
      background: #fee2e2;
      color: #dc2626;
    }

    .payment-badge.refunded {
      background: #f3f4f6;
      color: #6b7280;
    }

    .date-cell {
      font-size: 0.875rem;
      color: #64748b;
    }

    .actions-cell {
      min-width: 100px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #f9fafb;
      border-color: #9ca3af;
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

    .btn-primary {
      background-color: #3730a3;
      color: white;
      border-color: #3730a3;
    }

    .btn-primary:hover {
      background-color: #312e81;
      border-color: #312e81;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .orders-page {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .orders-table {
        font-size: 14px;
      }

      .orders-table th,
      .orders-table td {
        padding: 8px;
      }

      .action-buttons {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  loading = false;
  error: string | null = null;
  orders: ApiOrder[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getOrders({ limit: 50, page: 1 }).subscribe({
      next: (response: PaginatedResponse<ApiOrder>) => {
        this.orders = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = this.apiService.handleError(error);
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
          id: '1',
          street: '123 Le Loi Street',
          ward: 'Ward 1',
          district: 'District 1',
          province: 'Ho Chi Minh City',
          postalCode: '700000',
          isServiceArea: true,
          deliveryFee: 50000,
          estimatedDays: 3,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
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
          id: '2',
          street: '456 Nguyen Hue Boulevard',
          ward: 'Ward 2',
          district: 'District 1',
          province: 'Ho Chi Minh City',
          postalCode: '700000',
          isServiceArea: true,
          deliveryFee: 50000,
          estimatedDays: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-15T14:15:00Z',
        updatedAt: '2024-01-16T09:30:00Z',
        estimatedDelivery: '2024-01-18T00:00:00Z'
      }
    ];
  }

  createOrder(): void {
    // Navigate to create order page
    this.router.navigate(['/orders/create']);
  }

  viewOrder(order: ApiOrder): void {
    // Navigate to order detail view
    this.router.navigate(['/orders', order.id]);
  }

  editOrder(order: ApiOrder): void {
    // Navigate to edit order page
    this.router.navigate(['/orders', order.id, 'edit']);
  }

  updateOrderStatus(order: ApiOrder, newStatus: string): void {
    this.apiService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updatedOrder) => {
        // Update order in local array
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        console.log('Order status updated successfully');
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status: ' + this.apiService.handleError(error));
      }
    });
  }
}