import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Order as ApiOrder } from '../../../services/api.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="order-detail-page">
      <div class="page-header">
        <div class="header-content">
          <button class="btn btn-outline" (click)="goBack()">
            ← Back to Orders
          </button>
          <h1>Order Details</h1>
          <p>Order ID: {{ order?.id }}</p>
        </div>
      </div>

      <div class="order-content" *ngIf="order">
        <div class="order-info">
          <div class="info-section">
            <h3>Customer Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Name:</label>
                <span>{{ order.customerName }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ order.customerEmail }}</span>
              </div>
              <div class="info-item">
                <label>Phone:</label>
                <span>{{ order.customerPhone }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Order Status</h3>
            <div class="status-controls">
              <div class="status-item">
                <label>Order Status:</label>
                <select 
                  [(ngModel)]="order.status" 
                  (change)="updateOrderStatus()"
                  class="form-select">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div class="status-item">
                <label>Payment Status:</label>
                <select 
                  [(ngModel)]="order.paymentStatus" 
                  (change)="updatePaymentStatus()"
                  class="form-select">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Shipping Address</h3>
            <div class="address-info">
              <p><strong>Street:</strong> {{ order.shippingAddress.street }}</p>
              <p><strong>Ward:</strong> {{ order.shippingAddress.ward }}</p>
              <p><strong>District:</strong> {{ order.shippingAddress.district }}</p>
              <p><strong>Province:</strong> {{ order.shippingAddress.province }}</p>
              <p><strong>Postal Code:</strong> {{ order.shippingAddress.postalCode }}</p>
              <p><strong>Delivery Fee:</strong> ₫{{ order.shippingAddress.deliveryFee | number }}</p>
              <p><strong>Estimated Days:</strong> {{ order.shippingAddress.estimatedDays }} days</p>
            </div>
          </div>
        </div>

        <div class="order-products">
          <h3>Order Items</h3>
          <div class="products-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of order.products">
                  <td>{{ item.productName }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>₫{{ item.unitPrice | number }}</td>
                  <td>₫{{ item.totalPrice | number }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="3"><strong>Total Amount:</strong></td>
                  <td><strong>₫{{ order.totalAmount | number }}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="order-timeline">
          <h3>Order Timeline</h3>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h4>Order Created</h4>
                <p>{{ formatDate(order.createdAt) }}</p>
              </div>
            </div>
            <div class="timeline-item" *ngIf="order.updatedAt !== order.createdAt">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h4>Last Updated</h4>
                <p>{{ formatDate(order.updatedAt) }}</p>
              </div>
            </div>
            <div class="timeline-item" *ngIf="order.estimatedDelivery">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h4>Estimated Delivery</h4>
                <p>{{ formatDate(order.estimatedDelivery) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="order-actions">
          <button class="btn btn-outline" (click)="editOrder()">
            Edit Order
          </button>
          <button class="btn btn-primary" (click)="printOrder()">
            Print Order
          </button>
          <button class="btn btn-danger" (click)="cancelOrder()" *ngIf="order.status !== 'cancelled'">
            Cancel Order
          </button>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading order details...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadOrder()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .order-detail-page {
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

    .order-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .order-info {
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

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .info-item span {
      color: #1e293b;
      font-weight: 500;
    }

    .status-controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .status-item label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
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

    .address-info p {
      margin: 0 0 8px 0;
      color: #64748b;
    }

    .order-products {
      grid-column: 1 / -1;
    }

    .order-products h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .products-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .products-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table th,
    .products-table td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid #f1f5f9;
    }

    .products-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
    }

    .products-table td {
      color: #64748b;
    }

    .total-row {
      background: #f0fdf4;
      font-weight: 600;
    }

    .total-row td {
      color: #1e293b;
    }

    .order-timeline {
      grid-column: 1 / -1;
    }

    .order-timeline h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .timeline {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
    }

    .timeline-item:last-child {
      margin-bottom: 0;
    }

    .timeline-marker {
      width: 12px;
      height: 12px;
      background: #3730a3;
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
    }

    .timeline-content h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 4px 0;
    }

    .timeline-content p {
      color: #64748b;
      margin: 0;
    }

    .order-actions {
      grid-column: 1 / -1;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
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
      .order-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .order-actions {
        flex-direction: column;
      }
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: ApiOrder | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.error = 'Order ID not provided';
      return;
    }

    this.loading = true;
    this.error = null;

    this.apiService.getOrder(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
      }
    });
  }

  updateOrderStatus(): void {
    if (!this.order) return;

    this.apiService.updateOrderStatus(this.order.id, this.order.status).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        console.log('Order status updated successfully');
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status: ' + this.apiService.handleError(error));
      }
    });
  }

  updatePaymentStatus(): void {
    if (!this.order) return;

    // Note: This would need to be implemented in the API service
    console.log('Payment status update not yet implemented in API');
    alert('Payment status update functionality not yet implemented');
  }

  editOrder(): void {
    if (this.order) {
      this.router.navigate(['/orders', this.order.id, 'edit']);
    }
  }

  printOrder(): void {
    if (this.order) {
      window.print();
    }
  }

  cancelOrder(): void {
    if (!this.order) return;

    if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      this.apiService.updateOrderStatus(this.order.id, 'cancelled').subscribe({
        next: (updatedOrder) => {
          this.order = updatedOrder;
          console.log('Order cancelled successfully');
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
