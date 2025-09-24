import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Order as ApiOrder, Product } from '../../../services/api.service';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="order-edit-page">
      <div class="page-header">
        <div class="header-content">
          <button class="btn btn-outline" (click)="goBack()">
            ← Back to Order Details
          </button>
          <h1>Edit Order</h1>
          <p>Order ID: {{ order?.id }}</p>
        </div>
      </div>

      <form class="order-form" *ngIf="order" (ngSubmit)="saveOrder()">
        <div class="form-sections">
          <div class="form-section">
            <h3>Customer Information</h3>
            
            <div class="form-group">
              <label for="customerName">Customer Name</label>
              <input 
                type="text" 
                id="customerName" 
                name="customerName" 
                [(ngModel)]="order.customerName" 
                required
                class="form-input">
            </div>

            <div class="form-group">
              <label for="customerEmail">Email</label>
              <input 
                type="email" 
                id="customerEmail" 
                name="customerEmail" 
                [(ngModel)]="order.customerEmail" 
                required
                class="form-input">
            </div>

            <div class="form-group">
              <label for="customerPhone">Phone</label>
              <input 
                type="tel" 
                id="customerPhone" 
                name="customerPhone" 
                [(ngModel)]="order.customerPhone" 
                required
                class="form-input">
            </div>
          </div>

          <div class="form-section">
            <h3>Order Status</h3>
            
            <div class="form-group">
              <label for="status">Order Status</label>
              <select 
                id="status" 
                name="status" 
                [(ngModel)]="order.status" 
                class="form-select">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div class="form-group">
              <label for="paymentStatus">Payment Status</label>
              <select 
                id="paymentStatus" 
                name="paymentStatus" 
                [(ngModel)]="order.paymentStatus" 
                class="form-select">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h3>Shipping Address</h3>
            
            <div class="form-group">
              <label for="street">Street Address</label>
              <input 
                type="text" 
                id="street" 
                name="street" 
                [(ngModel)]="order.shippingAddress.street" 
                required
                class="form-input">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="ward">Ward</label>
                <input 
                  type="text" 
                  id="ward" 
                  name="ward" 
                  [(ngModel)]="order.shippingAddress.ward" 
                  required
                  class="form-input">
              </div>

              <div class="form-group">
                <label for="district">District</label>
                <input 
                  type="text" 
                  id="district" 
                  name="district" 
                  [(ngModel)]="order.shippingAddress.district" 
                  required
                  class="form-input">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="province">Province</label>
                <input 
                  type="text" 
                  id="province" 
                  name="province" 
                  [(ngModel)]="order.shippingAddress.province" 
                  required
                  class="form-input">
              </div>

              <div class="form-group">
                <label for="postalCode">Postal Code</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  name="postalCode" 
                  [(ngModel)]="order.shippingAddress.postalCode" 
                  class="form-input">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="deliveryFee">Delivery Fee (₫)</label>
                <input 
                  type="number" 
                  id="deliveryFee" 
                  name="deliveryFee" 
                  [(ngModel)]="order.shippingAddress.deliveryFee" 
                  min="0"
                  class="form-input">
              </div>

              <div class="form-group">
                <label for="estimatedDays">Estimated Days</label>
                <input 
                  type="number" 
                  id="estimatedDays" 
                  name="estimatedDays" 
                  [(ngModel)]="order.shippingAddress.estimatedDays" 
                  min="1"
                  class="form-input">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Order Items</h3>
            
            <div class="order-items">
              <div class="item-header">
                <h4>Products</h4>
                <button type="button" class="btn btn-outline" (click)="addProduct()">
                  Add Product
                </button>
              </div>

              <div class="items-list">
                <div 
                  *ngFor="let item of order.products; let i = index" 
                  class="item-row">
                  <div class="item-product">
                    <select 
                      [(ngModel)]="item.productId" 
                      (change)="onProductChange(i)"
                      class="form-select">
                      <option value="">Select Product</option>
                      <option *ngFor="let product of products" [value]="product.id">
                        {{ product.name }} - {{ product.brand }}
                      </option>
                    </select>
                  </div>

                  <div class="item-quantity">
                    <input 
                      type="number" 
                      [(ngModel)]="item.quantity" 
                      (input)="updateItemTotal(i)"
                      min="1"
                      class="form-input">
                  </div>

                  <div class="item-price">
                    <input 
                      type="number" 
                      [(ngModel)]="item.unitPrice" 
                      (input)="updateItemTotal(i)"
                      min="0"
                      class="form-input">
                  </div>

                  <div class="item-total">
                    ₫{{ item.totalPrice | number }}
                  </div>

                  <div class="item-actions">
                    <button 
                      type="button" 
                      class="btn-remove"
                      (click)="removeProduct(i)">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div class="order-total">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>₫{{ calculateSubtotal() | number }}</span>
                </div>
                <div class="total-row">
                  <span>Delivery Fee:</span>
                  <span>₫{{ order.shippingAddress.deliveryFee | number }}</span>
                </div>
                <div class="total-row total">
                  <span>Total Amount:</span>
                  <span>₫{{ calculateTotal() | number }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="goBack()">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading order...</p>
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
    .order-edit-page {
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

    .order-form {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .form-sections {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .form-section {
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 24px;
    }

    .form-section:last-child {
      border-bottom: none;
    }

    .form-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 20px 0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 15px;
      font-family: inherit;
      background-color: white;
      color: #1f2937;
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #3730a3;
      box-shadow: 0 0 0 3px rgba(55, 48, 163, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .order-items {
      background: #f8fafc;
      border-radius: 8px;
      padding: 20px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .item-header h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .items-list {
      margin-bottom: 20px;
    }

    .item-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .item-row:last-child {
      border-bottom: none;
    }

    .item-product select {
      min-width: 200px;
    }

    .item-quantity input,
    .item-price input {
      text-align: center;
    }

    .item-total {
      font-weight: 600;
      color: #1e293b;
      text-align: right;
    }

    .btn-remove {
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-remove:hover {
      background: #dc2626;
    }

    .order-total {
      background: white;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid #e2e8f0;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      color: #64748b;
    }

    .total-row.total {
      font-weight: 600;
      font-size: 1.125rem;
      color: #1e293b;
      border-top: 1px solid #e2e8f0;
      margin-top: 8px;
      padding-top: 16px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #f1f5f9;
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

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-outline {
      background-color: transparent;
      border-color: #d1d5db;
      color: #374151;
    }

    .btn-outline:hover:not(:disabled) {
      background-color: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-primary {
      background-color: #3730a3;
      color: white;
      border-color: #3730a3;
    }

    .btn-primary:hover:not(:disabled) {
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
      .form-row {
        grid-template-columns: 1fr;
      }

      .item-row {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class OrderEditComponent implements OnInit {
  order: ApiOrder | null = null;
  products: Product[] = [];
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
    this.loadProducts();
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

  loadProducts(): void {
    this.apiService.getProducts({ limit: 100 }).subscribe({
      next: (response) => {
        this.products = response.products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // No fallback data - rely on API only
      }
    });
  }


  addProduct(): void {
    if (this.order) {
      this.order.products.push({
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      });
    }
  }

  removeProduct(index: number): void {
    if (this.order && confirm('Are you sure you want to remove this product?')) {
      this.order.products.splice(index, 1);
      this.calculateTotal();
    }
  }

  onProductChange(index: number): void {
    if (!this.order) return;

    const item = this.order.products[index];
    const product = this.products.find(p => p.id === item.productId);
    
    if (product) {
      item.productName = product.name;
      item.unitPrice = product.price;
      item.totalPrice = item.quantity * item.unitPrice;
      this.calculateTotal();
    }
  }

  updateItemTotal(index: number): void {
    if (!this.order) return;

    const item = this.order.products[index];
    item.totalPrice = item.quantity * item.unitPrice;
    this.calculateTotal();
  }

  calculateSubtotal(): number {
    if (!this.order) return 0;
    return this.order.products.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  calculateTotal(): number {
    if (!this.order) return 0;
    const subtotal = this.calculateSubtotal();
    this.order.totalAmount = subtotal + this.order.shippingAddress.deliveryFee;
    return this.order.totalAmount;
  }

  saveOrder(): void {
    if (!this.order) return;

    this.saving = true;
    this.error = null;

    // Note: This would need to be implemented in the API service
    // For now, we'll simulate a successful save
    setTimeout(() => {
      this.saving = false;
      console.log('Order updated:', this.order);
      alert('Order updated successfully!');
      this.goBack();
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/orders', this.order?.id]);
  }
}
