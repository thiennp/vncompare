import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  status: string;
  productsCount: number;
  totalRevenue: number;
  rating: number;
  joinedAt: string;
  lastActiveAt: string;
  documents: any[];
}

@Component({
  selector: 'app-suppliers',
  imports: [CommonModule],
  template: `
    <div class="suppliers-container">
      <div class="page-header">
        <h1>Suppliers Management</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="addSupplier()">
            ➕ Add Supplier
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Suppliers</div>
          <div class="stat-value">{{ suppliers.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Verified</div>
          <div class="stat-value">{{ verifiedSuppliers }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending</div>
          <div class="stat-value">{{ pendingSuppliers }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Revenue</div>
          <div class="stat-value">₫{{ totalRevenue | number }}</div>
        </div>
      </div>

      <div class="suppliers-table">
        <div class="table-header">
          <h2>Suppliers List</h2>
        </div>
        
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Products</th>
                <th>Revenue</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let supplier of suppliers">
                <td>{{ supplier.name }}</td>
                <td>{{ supplier.email }}</td>
                <td>{{ supplier.phone }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + supplier.status">
                    {{ supplier.status }}
                  </span>
                </td>
                <td>{{ supplier.productsCount }}</td>
                <td>₫{{ supplier.totalRevenue | number }}</td>
                <td>{{ supplier.rating }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="viewSupplier(supplier)" title="View">
                      👁️
                    </button>
                    <button class="btn-icon" (click)="editSupplier(supplier)" title="Edit">
                      ✏️
                    </button>
                    <button class="btn-icon" (click)="verifySupplier(supplier)" title="Verify">
                      ✅
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .suppliers-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      color: #2c3e50;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }

    .suppliers-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .table-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .table-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .data-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-verified {
      background: #d4edda;
      color: #155724;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-suspended {
      background: #f8d7da;
      color: #721c24;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      font-size: 16px;
    }

    .btn-icon:hover {
      background: #f8f9fa;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }
  `]
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [
    {
      id: 'SUP-001',
      name: 'Dulux Vietnam',
      email: 'contact@dulux.vn',
      phone: '+84901234567',
      address: '123 Nguyen Hue Street',
      city: 'Ho Chi Minh City',
      province: 'Ho Chi Minh',
      status: 'verified',
      productsCount: 25,
      totalRevenue: 50000000,
      rating: 4.8,
      joinedAt: '2024-01-01T00:00:00Z',
      lastActiveAt: '2024-01-15T10:30:00Z',
      documents: []
    },
    {
      id: 'SUP-002',
      name: 'Jotun Vietnam',
      email: 'info@jotun.vn',
      phone: '+84901234568',
      address: '456 Le Loi Street',
      city: 'Ho Chi Minh City',
      province: 'Ho Chi Minh',
      status: 'pending',
      productsCount: 18,
      totalRevenue: 25000000,
      rating: 4.5,
      joinedAt: '2024-01-05T00:00:00Z',
      lastActiveAt: '2024-01-14T14:20:00Z',
      documents: []
    },
    {
      id: 'SUP-003',
      name: 'Kova Paint',
      email: 'sales@kova.vn',
      phone: '+84901234569',
      address: '789 Tran Hung Dao',
      city: 'Hanoi',
      province: 'Hanoi',
      status: 'verified',
      productsCount: 32,
      totalRevenue: 75000000,
      rating: 4.9,
      joinedAt: '2024-01-10T00:00:00Z',
      lastActiveAt: '2024-01-15T09:15:00Z',
      documents: []
    }
  ];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook - initializes the component
   */
  ngOnInit(): void {
    this.loadSuppliers();
  }

  /**
   * Loads suppliers data from the API or mock data
   */
  loadSuppliers(): void {
    // Mock data loaded in constructor
    console.log('Suppliers loaded:', this.suppliers.length);
  }

  /**
   * Navigates to the add supplier page
   */
  addSupplier(): void {
    this.router.navigate(['/suppliers/add']);
  }

  /**
   * Navigates to the supplier detail view
   * @param supplier - The supplier to view
   */
  viewSupplier(supplier: Supplier): void {
    this.router.navigate(['/suppliers', supplier.id]);
  }

  /**
   * Navigates to the edit supplier page
   * @param supplier - The supplier to edit
   */
  editSupplier(supplier: Supplier): void {
    this.router.navigate(['/suppliers', supplier.id, 'edit']);
  }

  /**
   * Verifies a supplier by updating their status
   * @param supplier - The supplier to verify
   */
  verifySupplier(supplier: Supplier): void {
    if (confirm(`Are you sure you want to verify "${supplier.name}"?`)) {
      this.apiService.verifySupplier(supplier.id, true).subscribe({
        next: (updatedSupplier) => {
          // Update supplier in local array
          const index = this.suppliers.findIndex(s => s.id === supplier.id);
          if (index !== -1) {
            this.suppliers[index] = updatedSupplier;
          }
          console.log('Supplier verified successfully');
        },
        error: (error) => {
          console.error('Error verifying supplier:', error);
          alert('Failed to verify supplier: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  /**
   * Deletes a supplier
   * @param supplier - The supplier to delete
   */
  deleteSupplier(supplier: Supplier): void {
    if (confirm(`Are you sure you want to delete "${supplier.name}"? This action cannot be undone.`)) {
      this.apiService.deleteSupplier(supplier.id).subscribe({
        next: () => {
          // Remove supplier from local array
          this.suppliers = this.suppliers.filter(s => s.id !== supplier.id);
          console.log('Supplier deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting supplier:', error);
          alert('Failed to delete supplier: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  /**
   * Toggles supplier status between active and inactive
   * @param supplier - The supplier to toggle
   */
  toggleSupplierStatus(supplier: Supplier): void {
    const action = supplier.status === 'verified' ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} this supplier?`)) {
      this.apiService.updateSupplierStatus(supplier.id, supplier.status === 'verified' ? 'inactive' : 'verified').subscribe({
        next: (updatedSupplier) => {
          // Update supplier in local array
          const index = this.suppliers.findIndex(s => s.id === supplier.id);
          if (index !== -1) {
            this.suppliers[index] = updatedSupplier;
          }
          console.log('Supplier status updated successfully');
        },
        error: (error) => {
          console.error('Error updating supplier status:', error);
          alert('Failed to update supplier status: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  /**
   * Gets the count of verified suppliers
   * @returns The number of verified suppliers
   */
  get verifiedSuppliers(): number {
    return this.suppliers.filter(supplier => supplier.status === 'verified').length;
  }

  /**
   * Gets the count of pending suppliers
   * @returns The number of pending suppliers
   */
  get pendingSuppliers(): number {
    return this.suppliers.filter(supplier => supplier.status === 'pending').length;
  }

  /**
   * Gets the total revenue from all suppliers
   * @returns The total revenue amount
   */
  get totalRevenue(): number {
    return this.suppliers.reduce((sum, supplier) => sum + supplier.totalRevenue, 0);
  }
}