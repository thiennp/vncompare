import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface Address {
  id: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  postalCode: string;
  isServiceArea: boolean;
  deliveryFee: number;
  estimatedDays: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-address-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="address-detail-page">
      <div class="page-header">
        <div class="header-content">
          <button class="btn btn-outline" (click)="goBack()">
            ← Back to Addresses
          </button>
          <h1>Address Details</h1>
          <p>Address ID: {{ address?.id }}</p>
        </div>
      </div>

      <div class="address-content" *ngIf="address">
        <div class="address-info">
          <div class="info-section">
            <h3>Address Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Street:</label>
                <span>{{ address.street }}</span>
              </div>
              <div class="info-item">
                <label>Ward:</label>
                <span>{{ address.ward }}</span>
              </div>
              <div class="info-item">
                <label>District:</label>
                <span>{{ address.district }}</span>
              </div>
              <div class="info-item">
                <label>Province:</label>
                <span>{{ address.province }}</span>
              </div>
              <div class="info-item">
                <label>Postal Code:</label>
                <span>{{ address.postalCode }}</span>
              </div>
              <div class="info-item">
                <label>Service Area:</label>
                <span class="status-badge" [class]="address.isServiceArea ? 'active' : 'inactive'">
                  {{ address.isServiceArea ? 'Yes' : 'No' }}
                </span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Delivery Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Delivery Fee:</label>
                <span>₫{{ address.deliveryFee | number }}</span>
              </div>
              <div class="info-item">
                <label>Estimated Days:</label>
                <span>{{ address.estimatedDays }} days</span>
              </div>
              <div class="info-item">
                <label>Created:</label>
                <span>{{ formatDate(address.createdAt) }}</span>
              </div>
              <div class="info-item">
                <label>Last Updated:</label>
                <span>{{ formatDate(address.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Address Statistics</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ addressStats.totalOrders }}</div>
                <div class="stat-label">Total Orders</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">₫{{ addressStats.totalRevenue | number }}</div>
                <div class="stat-label">Total Revenue</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ addressStats.avgDeliveryTime }}</div>
                <div class="stat-label">Avg Delivery Time</div>
              </div>
            </div>
          </div>
        </div>

        <div class="address-actions">
          <h3>Address Actions</h3>
          <div class="actions-grid">
            <button class="btn btn-outline" (click)="editAddress()">
              Edit Address
            </button>
            <button 
              class="btn btn-success" 
              (click)="toggleServiceArea()"
              *ngIf="!address.isServiceArea">
              Enable Service Area
            </button>
            <button 
              class="btn btn-warning" 
              (click)="toggleServiceArea()"
              *ngIf="address.isServiceArea">
              Disable Service Area
            </button>
            <button class="btn btn-info" (click)="viewOrders()">
              View Orders
            </button>
            <button class="btn btn-danger" (click)="deleteAddress()">
              Delete Address
            </button>
          </div>
        </div>

        <div class="address-orders" *ngIf="addressOrders.length > 0">
          <h3>Recent Orders</h3>
          <div class="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of addressOrders">
                  <td>{{ order.id }}</td>
                  <td>{{ order.customerName }}</td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                  <td>
                    <span class="status-badge" [class]="order.status">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>₫{{ order.totalAmount | number }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline" (click)="viewOrder(order.id)">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading address details...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadAddress()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .address-detail-page {
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

    .address-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .address-info {
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

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.confirmed {
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

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
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

    .address-actions {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .address-actions h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .address-orders {
      grid-column: 1 / -1;
    }

    .address-orders h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .orders-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .orders-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .orders-table th,
    .orders-table td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid #f1f5f9;
    }

    .orders-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
    }

    .orders-table td {
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

    .btn-sm {
      padding: 8px 16px;
      font-size: 14px;
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

    .btn-warning {
      background-color: #f59e0b;
      color: white;
      border-color: #f59e0b;
    }

    .btn-warning:hover {
      background-color: #d97706;
      border-color: #d97706;
    }

    .btn-success {
      background-color: #10b981;
      color: white;
      border-color: #10b981;
    }

    .btn-success:hover {
      background-color: #059669;
      border-color: #059669;
    }

    .btn-info {
      background-color: #06b6d4;
      color: white;
      border-color: #06b6d4;
    }

    .btn-info:hover {
      background-color: #0891b2;
      border-color: #0891b2;
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
      .address-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .info-grid,
      .stats-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AddressDetailComponent implements OnInit {
  address: Address | null = null;
  addressStats: any = {};
  addressOrders: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadAddress();
  }

  loadAddress(): void {
    const addressId = this.route.snapshot.paramMap.get('id');
    if (!addressId) {
      this.error = 'Address ID not provided';
      return;
    }

    this.loading = true;
    this.error = null;

    this.apiService.getAddress(addressId).subscribe({
      next: (response: any) => {
        this.address = response;
        this.loadAddressStats(addressId);
        this.loadAddressOrders(addressId);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading address:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
      }
    });
  }


  loadAddressStats(addressId: string): void {
    // Load address statistics
    this.addressStats = {
      totalOrders: 25,
      totalRevenue: 15000000,
      avgDeliveryTime: 2.5
    };
  }

  loadAddressOrders(addressId: string): void {
    // Load orders for this address
    this.addressOrders = [
      {
        id: 'ORD-001',
        customerName: 'Nguyen Van A',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'delivered',
        totalAmount: 3350000
      },
      {
        id: 'ORD-002',
        customerName: 'Tran Thi B',
        createdAt: '2024-01-14T14:20:00Z',
        status: 'shipped',
        totalAmount: 2100000
      },
      {
        id: 'ORD-003',
        customerName: 'Le Van C',
        createdAt: '2024-01-13T09:15:00Z',
        status: 'delivered',
        totalAmount: 1800000
      }
    ];
  }

  editAddress(): void {
    if (this.address) {
      this.router.navigate(['/addresses', this.address.id, 'edit']);
    }
  }

  toggleServiceArea(): void {
    if (!this.address) return;

    const action = this.address.isServiceArea ? 'disable' : 'enable';
    if (confirm(`Are you sure you want to ${action} service area for this address?`)) {
      // Note: This would need to be implemented in the API service
      this.address.isServiceArea = !this.address.isServiceArea;
      console.log('Service area status updated successfully');
    }
  }

  viewOrders(): void {
    this.router.navigate(['/orders'], { queryParams: { address: this.address?.id } });
  }

  deleteAddress(): void {
    if (!this.address) return;

    if (confirm('Are you sure you want to delete this address? This action cannot be undone.')) {
      // Note: This would need to be implemented in the API service
      console.log('Delete address not yet implemented in API');
      alert('Delete functionality not yet implemented');
    }
  }

  viewOrder(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  goBack(): void {
    this.router.navigate(['/addresses']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
