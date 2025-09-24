import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../services/api.service';

interface ShippingCalculation {
  address: string;
  products: Array<{ productId: string; quantity: number; product?: Product }>;
  result: {
    deliveryFee: number;
    estimatedDays: number;
    shippingZone: string;
  } | null;
}

@Component({
  selector: 'app-shipping-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shipping-calculator-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Shipping Calculator</h1>
          <p>Calculate delivery fees and estimated delivery times</p>
        </div>
      </div>

      <div class="calculator-container">
        <div class="calculator-form">
          <div class="form-section">
            <h3>Delivery Address</h3>
            
            <div class="form-group">
              <label for="address">Full Address</label>
              <textarea 
                id="address" 
                name="address" 
                [(ngModel)]="calculation.address" 
                (input)="onAddressChange()"
                rows="3"
                class="form-textarea"
                placeholder="Enter complete delivery address including ward, district, province">
              </textarea>
            </div>

            <div class="address-suggestions" *ngIf="addressSuggestions.length > 0">
              <h4>Address Suggestions</h4>
              <div class="suggestion-list">
                <div 
                  *ngFor="let suggestion of addressSuggestions" 
                  class="suggestion-item"
                  (click)="selectAddress(suggestion)">
                  {{ suggestion }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Products</h3>
            
            <div class="product-selection">
              <div class="form-group">
                <label for="productSelect">Select Product</label>
                <select 
                  id="productSelect" 
                  name="productSelect" 
                  [(ngModel)]="selectedProductId"
                  class="form-select">
                  <option value="">Choose a product</option>
                  <option *ngFor="let product of products" [value]="product.id">
                    {{ product.name }} - {{ product.brand }} (₫{{ product.price | number }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="quantity">Quantity</label>
                <input 
                  type="number" 
                  id="quantity" 
                  name="quantity" 
                  [(ngModel)]="selectedQuantity"
                  min="1"
                  class="form-input"
                  placeholder="Enter quantity">
              </div>

              <button 
                type="button" 
                class="btn btn-outline"
                (click)="addProduct()"
                [disabled]="!selectedProductId || !selectedQuantity">
                Add Product
              </button>
            </div>

            <div class="selected-products" *ngIf="calculation.products.length > 0">
              <h4>Selected Products</h4>
              <div class="product-list">
                <div 
                  *ngFor="let item of calculation.products; let i = index" 
                  class="product-item">
                  <div class="product-info">
                    <span class="product-name">{{ item.product?.name || 'Unknown Product' }}</span>
                    <span class="product-quantity">Qty: {{ item.quantity }}</span>
                  </div>
                  <button 
                    type="button" 
                    class="btn-remove"
                    (click)="removeProduct(i)">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="calculator-result" *ngIf="calculation.result">
          <div class="result-header">
            <h3>Shipping Calculation</h3>
          </div>
          
          <div class="result-content">
            <div class="result-item">
              <span class="result-label">Delivery Address:</span>
              <span class="result-value">{{ calculation.address }}</span>
            </div>
            
            <div class="result-item">
              <span class="result-label">Shipping Zone:</span>
              <span class="result-value">{{ calculation.result.shippingZone }}</span>
            </div>
            
            <div class="result-item">
              <span class="result-label">Estimated Delivery:</span>
              <span class="result-value">{{ calculation.result.estimatedDays }} days</span>
            </div>
            
            <div class="result-item highlight">
              <span class="result-label">Delivery Fee:</span>
              <span class="result-value">₫{{ calculation.result.deliveryFee | number }}</span>
            </div>
          </div>

          <div class="result-actions">
            <button class="btn btn-outline" (click)="resetCalculator()">
              Reset Calculator
            </button>
            <button class="btn btn-primary" (click)="saveCalculation()">
              Save Calculation
            </button>
          </div>
        </div>

        <div class="calculator-help" *ngIf="!calculation.result">
          <div class="help-content">
            <h4>How to Use the Shipping Calculator</h4>
            <ol>
              <li>Enter the complete delivery address</li>
              <li>Select products and quantities</li>
              <li>View shipping calculation results</li>
            </ol>
            
            <div class="shipping-info">
              <h5>Shipping Information:</h5>
              <ul>
                <li><strong>Zone 1 (HCMC):</strong> ₫50,000 - 1-2 days</li>
                <li><strong>Zone 2 (Major cities):</strong> ₫80,000 - 2-3 days</li>
                <li><strong>Zone 3 (Other provinces):</strong> ₫120,000 - 3-5 days</li>
                <li><strong>Remote areas:</strong> ₫200,000+ - 5-7 days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shipping-calculator-page {
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
      margin: 0 0 8px 0;
    }

    .page-header p {
      color: #64748b;
      margin: 0;
    }

    .calculator-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      align-items: start;
    }

    .calculator-form {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section:last-child {
      margin-bottom: 0;
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
    .form-select,
    .form-textarea {
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

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3730a3;
      box-shadow: 0 0 0 3px rgba(55, 48, 163, 0.1);
    }

    .address-suggestions {
      margin-top: 16px;
    }

    .address-suggestions h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 12px 0;
    }

    .suggestion-list {
      background: #f8fafc;
      border-radius: 8px;
      padding: 8px;
    }

    .suggestion-item {
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 4px;
      color: #64748b;
      transition: all 0.2s;
    }

    .suggestion-item:hover {
      background: #e2e8f0;
      color: #1e293b;
    }

    .product-selection {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 16px;
      align-items: end;
    }

    .selected-products {
      margin-top: 24px;
    }

    .selected-products h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .product-list {
      background: #f8fafc;
      border-radius: 8px;
      padding: 16px;
    }

    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
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

    .product-quantity {
      font-size: 0.875rem;
      color: #64748b;
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

    .calculator-result {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .result-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 24px 0;
    }

    .result-content {
      margin-bottom: 24px;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .result-item:last-child {
      border-bottom: none;
    }

    .result-item.highlight {
      background: #f0f9ff;
      border-radius: 8px;
      padding: 16px;
      margin: 8px 0;
      border: 1px solid #0ea5e9;
    }

    .result-label {
      font-weight: 500;
      color: #374151;
    }

    .result-value {
      font-weight: 600;
      color: #1e293b;
    }

    .result-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .calculator-help {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .help-content h4 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .help-content ol {
      margin: 0 0 24px 0;
      padding-left: 20px;
    }

    .help-content li {
      margin-bottom: 8px;
      color: #64748b;
    }

    .shipping-info {
      background: #f8fafc;
      border-radius: 8px;
      padding: 16px;
    }

    .shipping-info h5 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 12px 0;
    }

    .shipping-info ul {
      margin: 0;
      padding-left: 20px;
    }

    .shipping-info li {
      margin-bottom: 4px;
      color: #64748b;
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

    .btn-primary:hover {
      background-color: #312e81;
      border-color: #312e81;
    }

    @media (max-width: 768px) {
      .calculator-container {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .calculator-form,
      .calculator-result,
      .calculator-help {
        padding: 20px;
      }

      .product-selection {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .result-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ShippingCalculatorComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  addressSuggestions: string[] = [];

  calculation: ShippingCalculation = {
    address: '',
    products: [],
    result: null
  };

  selectedProductId = '';
  selectedQuantity = 1;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getProducts({ limit: 100 }).subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
        // No fallback data - rely on API only
      }
    });
  }


  onAddressChange(): void {
    // Generate address suggestions based on input
    this.generateAddressSuggestions();
    this.calculateShipping();
  }

  generateAddressSuggestions(): void {
    const commonAddresses = [
      '123 Le Loi Street, Ward 1, District 1, Ho Chi Minh City',
      '456 Nguyen Hue Boulevard, Ward 2, District 1, Ho Chi Minh City',
      '789 Tran Hung Dao, Ward 3, District 5, Ho Chi Minh City',
      '321 Hai Ba Trung, Ward 1, District 3, Ho Chi Minh City',
      '654 Ly Tu Trong, Ward 1, District 1, Ho Chi Minh City'
    ];

    if (this.calculation.address.length > 3) {
      this.addressSuggestions = commonAddresses.filter(addr => 
        addr.toLowerCase().includes(this.calculation.address.toLowerCase())
      );
    } else {
      this.addressSuggestions = [];
    }
  }

  selectAddress(address: string): void {
    this.calculation.address = address;
    this.addressSuggestions = [];
    this.calculateShipping();
  }

  addProduct(): void {
    if (!this.selectedProductId || !this.selectedQuantity) return;

    const product = this.products.find(p => p.id === this.selectedProductId);
    if (!product) return;

    // Check if product already exists
    const existingIndex = this.calculation.products.findIndex(p => p.productId === this.selectedProductId);
    if (existingIndex !== -1) {
      this.calculation.products[existingIndex].quantity += this.selectedQuantity;
    } else {
      this.calculation.products.push({
        productId: this.selectedProductId,
        quantity: this.selectedQuantity,
        product: product
      });
    }

    this.selectedProductId = '';
    this.selectedQuantity = 1;
    this.calculateShipping();
  }

  removeProduct(index: number): void {
    this.calculation.products.splice(index, 1);
    this.calculateShipping();
  }

  calculateShipping(): void {
    if (!this.calculation.address || this.calculation.products.length === 0) {
      this.calculation.result = null;
      return;
    }

    // Calculate shipping based on address and products
    const address = this.calculation.address.toLowerCase();
    let shippingZone = 'Zone 3';
    let deliveryFee = 120000;
    let estimatedDays = 4;

    // Determine shipping zone based on address
    if (address.includes('ho chi minh') || address.includes('hcmc')) {
      shippingZone = 'Zone 1';
      deliveryFee = 50000;
      estimatedDays = 1;
    } else if (address.includes('hanoi') || address.includes('da nang') || address.includes('can tho')) {
      shippingZone = 'Zone 2';
      deliveryFee = 80000;
      estimatedDays = 2;
    }

    // Adjust for product weight/volume
    const totalVolume = this.calculation.products.reduce((sum, item) => {
      return sum + (item.product?.volume || 1) * item.quantity;
    }, 0);

    if (totalVolume > 5) {
      deliveryFee += 50000; // Additional fee for heavy items
      estimatedDays += 1;
    }

    this.calculation.result = {
      deliveryFee: deliveryFee,
      estimatedDays: estimatedDays,
      shippingZone: shippingZone
    };
  }

  resetCalculator(): void {
    this.calculation = {
      address: '',
      products: [],
      result: null
    };
    this.selectedProductId = '';
    this.selectedQuantity = 1;
    this.addressSuggestions = [];
  }

  saveCalculation(): void {
    if (this.calculation.result) {
      // Save calculation to localStorage or send to API
      const savedCalculations = JSON.parse(localStorage.getItem('savedShippingCalculations') || '[]');
      savedCalculations.push({
        ...this.calculation,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('savedShippingCalculations', JSON.stringify(savedCalculations));
      alert('Shipping calculation saved successfully!');
    }
  }
}
