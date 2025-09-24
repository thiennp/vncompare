import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../services/api.service';

interface CoverageCalculation {
  area: number;
  surfaceType: string;
  coatsRequired: number;
  selectedProduct: Product | null;
  result: {
    coverageRate: number;
    paintNeeded: number;
    productPrice: number;
    totalCost: number;
  } | null;
}

@Component({
  selector: 'app-coverage-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="coverage-calculator-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Coverage Calculator</h1>
          <p>Calculate how much paint you need for your project</p>
        </div>
      </div>

      <div class="calculator-container">
        <div class="calculator-form">
          <div class="form-section">
            <h3>Project Details</h3>
            
            <div class="form-group">
              <label for="surfaceType">Surface Type</label>
              <select 
                id="surfaceType" 
                name="surfaceType" 
                [(ngModel)]="calculation.surfaceType" 
                (change)="onSurfaceTypeChange()"
                class="form-select">
                <option value="">Select surface type</option>
                <option value="smooth">Smooth Walls</option>
                <option value="textured">Textured Walls</option>
                <option value="ceiling">Ceiling</option>
                <option value="exterior">Exterior Surfaces</option>
              </select>
            </div>

            <div class="form-group">
              <label for="area">Area (m²)</label>
              <input 
                type="number" 
                id="area" 
                name="area" 
                [(ngModel)]="calculation.area" 
                (input)="onAreaChange()"
                min="0"
                step="0.1"
                class="form-input"
                placeholder="Enter area in square meters">
            </div>

            <div class="form-group">
              <label for="coatsRequired">Number of Coats</label>
              <select 
                id="coatsRequired" 
                name="coatsRequired" 
                [(ngModel)]="calculation.coatsRequired" 
                (change)="onCoatsChange()"
                class="form-select">
                <option value="1">1 Coat</option>
                <option value="2">2 Coats (Recommended)</option>
                <option value="3">3 Coats</option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h3>Product Selection</h3>
            
            <div class="form-group">
              <label for="selectedProduct">Choose Product</label>
              <select 
                id="selectedProduct" 
                name="selectedProduct" 
                [(ngModel)]="calculation.selectedProduct" 
                (change)="onProductChange()"
                class="form-select">
                <option [value]="null">Select a product</option>
                <option *ngFor="let product of products" [value]="product">
                  {{ product.name }} - {{ product.brand }} (₫{{ product.price | number }})
                </option>
              </select>
            </div>

            <div class="product-info" *ngIf="calculation.selectedProduct">
              <div class="product-details">
                <h4>{{ calculation.selectedProduct.name }}</h4>
                <p><strong>Brand:</strong> {{ calculation.selectedProduct.brand }}</p>
                <p><strong>Coverage:</strong> {{ calculation.selectedProduct.coverage }} m²/liter</p>
                <p><strong>Price:</strong> ₫{{ calculation.selectedProduct.price | number }}</p>
                <p><strong>Volume:</strong> {{ calculation.selectedProduct.volume }} liter(s)</p>
              </div>
            </div>
          </div>
        </div>

        <div class="calculator-result" *ngIf="calculation.result">
          <div class="result-header">
            <h3>Calculation Result</h3>
          </div>
          
          <div class="result-content">
            <div class="result-item">
              <span class="result-label">Surface Type:</span>
              <span class="result-value">{{ getSurfaceTypeLabel(calculation.surfaceType) }}</span>
            </div>
            
            <div class="result-item">
              <span class="result-label">Total Area:</span>
              <span class="result-value">{{ calculation.area }} m²</span>
            </div>
            
            <div class="result-item">
              <span class="result-label">Number of Coats:</span>
              <span class="result-value">{{ calculation.coatsRequired }}</span>
            </div>
            
            <div class="result-item">
              <span class="result-label">Coverage Rate:</span>
              <span class="result-value">{{ calculation.result.coverageRate }} m²/liter</span>
            </div>
            
            <div class="result-item highlight">
              <span class="result-label">Paint Needed:</span>
              <span class="result-value">{{ calculation.result.paintNeeded }} liters</span>
            </div>
            
            <div class="result-item">
              <span class="result-label">Product Price:</span>
              <span class="result-value">₫{{ calculation.result.productPrice | number }}</span>
            </div>
            
            <div class="result-item total">
              <span class="result-label">Total Cost:</span>
              <span class="result-value">₫{{ calculation.result.totalCost | number }}</span>
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
            <h4>How to Use the Coverage Calculator</h4>
            <ol>
              <li>Select the surface type you're painting</li>
              <li>Enter the total area in square meters</li>
              <li>Choose the number of coats (2 coats recommended)</li>
              <li>Select a product from the list</li>
              <li>View your calculation results</li>
            </ol>
            
            <div class="coverage-tips">
              <h5>Coverage Tips:</h5>
              <ul>
                <li>Smooth walls: 12-15 m²/liter</li>
                <li>Textured walls: 8-10 m²/liter</li>
                <li>Ceilings: 10-12 m²/liter</li>
                <li>Exterior surfaces: 8-12 m²/liter</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .coverage-calculator-page {
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

    .product-info {
      background: #f8fafc;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
    }

    .product-details h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 12px 0;
    }

    .product-details p {
      margin: 0 0 8px 0;
      color: #64748b;
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

    .result-item.total {
      background: #f0fdf4;
      border-radius: 8px;
      padding: 16px;
      margin: 8px 0;
      border: 1px solid #22c55e;
      font-weight: 600;
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

    .coverage-tips {
      background: #f8fafc;
      border-radius: 8px;
      padding: 16px;
    }

    .coverage-tips h5 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 12px 0;
    }

    .coverage-tips ul {
      margin: 0;
      padding-left: 20px;
    }

    .coverage-tips li {
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

      .result-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CoverageCalculatorComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  calculation: CoverageCalculation = {
    area: 0,
    surfaceType: '',
    coatsRequired: 2,
    selectedProduct: null,
    result: null
  };

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


  onSurfaceTypeChange(): void {
    this.calculateCoverage();
  }

  onAreaChange(): void {
    this.calculateCoverage();
  }

  onCoatsChange(): void {
    this.calculateCoverage();
  }

  onProductChange(): void {
    this.calculateCoverage();
  }

  calculateCoverage(): void {
    if (!this.calculation.area || !this.calculation.surfaceType || !this.calculation.selectedProduct) {
      this.calculation.result = null;
      return;
    }

    // Calculate coverage rate based on surface type
    let coverageRate = this.calculation.selectedProduct.coverage;
    
    switch (this.calculation.surfaceType) {
      case 'smooth':
        coverageRate = coverageRate * 1.2; // Smooth surfaces have better coverage
        break;
      case 'textured':
        coverageRate = coverageRate * 0.8; // Textured surfaces need more paint
        break;
      case 'ceiling':
        coverageRate = coverageRate * 0.9; // Ceilings are slightly less efficient
        break;
      case 'exterior':
        coverageRate = coverageRate * 0.85; // Exterior surfaces need more paint
        break;
    }

    const paintNeeded = (this.calculation.area / coverageRate) * this.calculation.coatsRequired;
    const productPrice = this.calculation.selectedProduct.price;
    const totalCost = paintNeeded * productPrice;

    this.calculation.result = {
      coverageRate: Math.round(coverageRate * 10) / 10,
      paintNeeded: Math.round(paintNeeded * 10) / 10,
      productPrice: productPrice,
      totalCost: Math.round(totalCost)
    };
  }

  getSurfaceTypeLabel(surfaceType: string): string {
    const labels: { [key: string]: string } = {
      'smooth': 'Smooth Walls',
      'textured': 'Textured Walls',
      'ceiling': 'Ceiling',
      'exterior': 'Exterior Surfaces'
    };
    return labels[surfaceType] || surfaceType;
  }

  resetCalculator(): void {
    this.calculation = {
      area: 0,
      surfaceType: '',
      coatsRequired: 2,
      selectedProduct: null,
      result: null
    };
  }

  saveCalculation(): void {
    if (this.calculation.result) {
      // Save calculation to localStorage or send to API
      const savedCalculations = JSON.parse(localStorage.getItem('savedCalculations') || '[]');
      savedCalculations.push({
        ...this.calculation,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations));
      alert('Calculation saved successfully!');
    }
  }
}
