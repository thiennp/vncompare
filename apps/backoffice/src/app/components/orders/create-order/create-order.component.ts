import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Order as ApiOrder, Product } from '../../../services/api.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-order-page">
      <div class="page-header">
        <div class="header-content">
          <button class="btn btn-outline" (click)="goBack()">
            ← Back to Orders
          </button>
          <h1>Create New Order</h1>
          <p>Add a new order to the system</p>
        </div>
      </div>

      <form class="order-form" (ngSubmit)="createOrder()">
        <div class="form-sections">
          <div class="form-section">
            <h3>Customer Information</h3>
            
            <div class="form-group">
              <label for="customerName">Customer Name *</label>
              <input 
                type="text" 
                id="customerName" 
                name="customerName" 
                [(ngModel)]="order.customerName" 
                required
                class="form-input">
            </div>

            <div class="form-group">
              <label for="customerEmail">Email *</label>
              <input 
                type="email" 
                id="customerEmail" 
                name="customerEmail" 
                [(ngModel)]="order.customerEmail" 
                required
                class="form-input">
            </div>

            <div class="form-group">
              <label for="customerPhone">Phone *</label>
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
              </select>
            </div>
          </div>

          <div class="form-section">
            <h3>Shipping Address</h3>
            
            <div class="form-group">
              <label for="street">Street Address *</label>
              <input 
                type="text" 
                id="street" 
                name="street" 
                [(ngModel)]="shippingAddress.street" 
                required
                class="form-input">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="ward">Ward *</label>
                <input 
                  type="text" 
                  id="ward" 
                  name="ward" 
                  [(ngModel)]="shippingAddress.ward" 
                  required
                  class="form-input">
              </div>

              <div class="form-group">
                <label for="district">District *</label>
                <input 
                  type="text" 
                  id="district" 
                  name="district" 
                  [(ngModel)]="shippingAddress.district" 
                  required
                  class="form-input">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="province">Province *</label>
                <input 
                  type="text" 
                  id="province" 
                  name="province" 
                  [(ngModel)]="shippingAddress.province" 
                  required
                  class="form-input">
              </div>

              <div class="form-group">
                <label for="postalCode">Postal Code</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  name="postalCode" 
                  [(ngModel)]="shippingAddress.postalCode" 
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
                  [(ngModel)]="shippingAddress.deliveryFee" 
                  min="0"
                  class="form-input">
              </div>

              <div class="form-group">
                <label for="estimatedDays">Estimated Days</label>
                <input 
                  type="number" 
                  id="estimatedDays" 
                  name="estimatedDays" 
                  [(ngModel)]="shippingAddress.estimatedDays" 
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
                  <span>₫{{ shippingAddress.deliveryFee | number }}</span>
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
          <button type="submit" class="btn btn-primary" [disabled]="saving || (order.products?.length || 0) === 0">
            {{ saving ? 'Creating...' : 'Create Order' }}
          </button>
        </div>
      </form>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading products...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadProducts()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .create-order-page {
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
export class CreateOrderComponent implements OnInit {
  order: Partial<ApiOrder> = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    products: [],
    totalAmount: 0,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: {
      id: '0',
      street: '',
      ward: '',
      district: '',
      province: '',
      postalCode: '',
      deliveryFee: 0,
      estimatedDays: 1,
      isServiceArea: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  // Form properties for two-way binding
  shippingAddress = {
    street: '',
    ward: '',
    district: '',
    province: '',
    postalCode: '',
    deliveryFee: 0,
    estimatedDays: 1
  };
  products: Product[] = [];
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.addProduct(); // Add one empty product row by default
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.apiService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products: ' + this.apiService.handleError(error);
        this.loading = false;
      }
    });
  }

  addProduct(): void {
    this.order.products!.push({
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    });
  }

  removeProduct(index: number): void {
    if (this.order.products!.length > 1) {
      this.order.products!.splice(index, 1);
      this.updateOrderTotal();
    }
  }

  onProductChange(index: number): void {
    const productId = this.order.products![index].productId;
    const product = this.products.find(p => p.id === productId);
    
    if (product) {
      this.order.products![index].productName = product.name;
      this.order.products![index].unitPrice = product.price;
      this.updateItemTotal(index);
    }
  }

  updateItemTotal(index: number): void {
    const item = this.order.products![index];
    item.totalPrice = item.quantity * item.unitPrice;
    this.updateOrderTotal();
  }

  updateOrderTotal(): void {
    this.order.totalAmount = this.calculateSubtotal() + (this.order.shippingAddress?.deliveryFee || 0);
  }

  calculateSubtotal(): number {
    return this.order.products!.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + (this.order.shippingAddress?.deliveryFee || 0);
  }

  createOrder(): void {
    if (this.order.products!.length === 0) {
      alert('Please add at least one product to the order.');
      return;
    }

    // Validate required fields
    if (!this.order.customerName || !this.order.customerEmail || !this.order.customerPhone) {
      alert('Please fill in all required customer information.');
      return;
    }

    if (!this.order.shippingAddress?.street || !this.order.shippingAddress?.ward || 
        !this.order.shippingAddress?.district || !this.order.shippingAddress?.province) {
      alert('Please fill in all required shipping address fields.');
      return;
    }

    this.saving = true;
    this.error = null;

    // For now, we'll simulate creating an order since the API method doesn't exist
    // In a real implementation, you would call this.apiService.createOrder(this.order)
    setTimeout(() => {
      console.log('Creating order:', this.order);
      alert('Order created successfully! (This is a demo - API integration needed)');
      this.saving = false;
      this.goBack();
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
