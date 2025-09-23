import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, PaginatedResponse } from '../../services/api.service';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  status: 'pending' | 'verified' | 'suspended' | 'rejected';
  productsCount: number;
  totalRevenue: number;
  rating: number;
  joinedAt: string;
  lastActiveAt: string;
  documents: SupplierDocument[];
}

interface SupplierDocument {
  id: string;
  type: 'business_license' | 'tax_certificate' | 'quality_certificate' | 'other';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="suppliers-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Supplier Management</h1>
          <p>Manage suppliers, verification, and performance</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="exportSuppliers()">
            📤 Export
          </button>
          <button class="btn btn-primary" (click)="addSupplier()">
            ➕ Add Supplier
          </button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search suppliers..." 
            [(ngModel)]="searchTerm"
            (input)="filterSuppliers()"
            class="search-input">
        </div>
        <div class="filter-controls">
          <select [(ngModel)]="statusFilter" (change)="filterSuppliers()" class="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
          <select [(ngModel)]="ratingFilter" (change)="filterSuppliers()" class="filter-select">
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
          <button class="btn btn-outline" (click)="clearFilters()">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Suppliers Table -->
      <div class="suppliers-table-container">
        <table class="suppliers-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Status</th>
              <th>Products</th>
              <th>Revenue</th>
              <th>Rating</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let supplier of filteredSuppliers">
              <td class="supplier-cell">
                <div class="supplier-info">
                  <div class="supplier-avatar">
                    {{ supplier.name.charAt(0) }}
                  </div>
                  <div class="supplier-details">
                    <div class="supplier-name">{{ supplier.name }}</div>
                    <div class="supplier-id">ID: {{ supplier.id }}</div>
                  </div>
                </div>
              </td>
              <td class="contact-cell">
                <div class="contact-info">
                  <div class="email">{{ supplier.email }}</div>
                  <div class="phone">{{ supplier.phone }}</div>
                </div>
              </td>
              <td class="location-cell">
                <div class="location-info">
                  <div class="address">{{ supplier.address }}</div>
                  <div class="city">{{ supplier.city }}, {{ supplier.province }}</div>
                </div>
              </td>
              <td>
                <span class="status-badge" [class]="supplier.status">
                  {{ supplier.status | titlecase }}
                </span>
              </td>
              <td class="products-cell">{{ supplier.productsCount }}</td>
              <td class="revenue-cell">₫{{ supplier.totalRevenue | number }}</td>
              <td class="rating-cell">
                <div class="rating">
                  <span class="stars">{{ getStars(supplier.rating) }}</span>
                  <span class="rating-value">{{ supplier.rating }}/5</span>
                </div>
              </td>
              <td class="joined-cell">{{ supplier.joinedAt | date:'short' }}</td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="btn-icon" (click)="viewSupplier(supplier)" title="View">
                    👁️
                  </button>
                  <button class="btn-icon" (click)="editSupplier(supplier)" title="Edit">
                    ✏️
                  </button>
                  <button class="btn-icon" (click)="verifySupplier(supplier)" title="Verify" *ngIf="supplier.status === 'pending'">
                    ✅
                  </button>
                  <button class="btn-icon" (click)="suspendSupplier(supplier)" title="Suspend" *ngIf="supplier.status === 'verified'">
                    ⏸️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Supplier Statistics -->
      <div class="supplier-stats">
        <div class="stat-card">
          <div class="stat-icon">🏢</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalSuppliers }}</div>
            <div class="stat-label">Total Suppliers</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ verifiedSuppliers }}</div>
            <div class="stat-label">Verified</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingSuppliers }}</div>
            <div class="stat-label">Pending</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-value">₫{{ totalRevenue | number }}</div>
            <div class="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .suppliers-page {
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
      background: var(--ios-system-background);
      border-radius: var(--ios-radius-2xl);
      border: 0.5px solid var(--ios-opaque-separator);
      box-shadow: var(--ios-shadow-sm);
    }

    .search-box {
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 0.5px solid var(--ios-opaque-separator);
      border-radius: var(--ios-radius-lg);
      font-size: 15px;
      font-family: var(--ios-font-family);
      background-color: var(--ios-system-background);
      color: var(--ios-label);
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--ios-system-blue);
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }

    .search-input::placeholder {
      color: var(--ios-placeholder-text);
    }

    .filter-controls {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .filter-select {
      padding: 12px 16px;
      border: 0.5px solid var(--ios-opaque-separator);
      border-radius: var(--ios-radius-lg);
      background: var(--ios-system-background);
      font-size: 15px;
      font-family: var(--ios-font-family);
      color: var(--ios-label);
      min-width: 150px;
      transition: all 0.2s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--ios-system-blue);
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }

    .suppliers-table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 24px;
    }

    .suppliers-table {
      width: 100%;
      border-collapse: collapse;
    }

    .suppliers-table th {
      background: #f8fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e2e8f0;
    }

    .suppliers-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .suppliers-table tr:hover {
      background: #f8fafc;
    }

    .supplier-cell {
      min-width: 200px;
    }

    .supplier-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .supplier-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1rem;
    }

    .supplier-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .supplier-name {
      font-weight: 600;
      color: #1e293b;
    }

    .supplier-id {
      font-size: 0.75rem;
      color: #64748b;
    }

    .contact-cell {
      min-width: 180px;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .email, .phone {
      font-size: 0.875rem;
      color: #64748b;
    }

    .location-cell {
      min-width: 200px;
    }

    .location-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .address {
      font-size: 0.875rem;
      color: #1e293b;
    }

    .city {
      font-size: 0.75rem;
      color: #64748b;
    }

    .status-badge {
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

    .status-badge.verified {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.suspended {
      background: #fee2e2;
      color: #dc2626;
    }

    .status-badge.rejected {
      background: #f3f4f6;
      color: #6b7280;
    }

    .products-cell, .revenue-cell {
      text-align: right;
      font-weight: 600;
    }

    .revenue-cell {
      color: #059669;
    }

    .rating-cell {
      min-width: 100px;
    }

    .rating {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .stars {
      color: #fbbf24;
      font-size: 0.875rem;
    }

    .rating-value {
      font-size: 0.75rem;
      color: #64748b;
    }

    .joined-cell {
      font-size: 0.875rem;
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

    .supplier-stats {
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

      .suppliers-table-container {
        overflow-x: auto;
      }

      .supplier-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SuppliersComponent implements OnInit {
  searchTerm = '';
  statusFilter = '';
  ratingFilter = '';

  loading = false;
  error: string | null = null;
  suppliers: any[] = [];

  filteredSuppliers: Supplier[] = [];

  constructor(private api: ApiService, private router: Router) {}

  get totalSuppliers(): number {
    return this.suppliers.length;
  }

  get verifiedSuppliers(): number {
    return this.normalizeList(this.suppliers).filter(supplier => supplier.status === 'verified').length;
  }

  get pendingSuppliers(): number {
    return this.normalizeList(this.suppliers).filter(supplier => supplier.status === 'pending').length;
  }

  get totalRevenue(): number {
    return this.normalizeList(this.suppliers).reduce((sum, supplier) => sum + supplier.totalRevenue, 0);
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.error = null;
    this.api.getSuppliers({ limit: 50, page: 1 }).subscribe({
      next: (res: PaginatedResponse<any> | any) => {
        const list = (res && (res as any).data) ? (res as any).data : ((res && (res as any).suppliers) ? (res as any).suppliers : []);
        this.suppliers = Array.isArray(list) ? list : [];
        this.filterSuppliers();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load suppliers', err);
        this.error = 'Failed to load suppliers';
        this.loading = false;
      }
    });
  }

  private normalizeList(list: any[]): Supplier[] {
    return list.map((s: any) => ({
      id: s.id,
      name: s.name ?? s.companyName ?? '—',
      email: s.email ?? '',
      phone: s.phone ?? '',
      address: s.address ?? '',
      city: s.city ?? '',
      province: s.province ?? '',
      status: s.status ?? (s.isVerified ? 'verified' : 'pending'),
      productsCount: s.productsCount ?? s.totalProducts ?? 0,
      totalRevenue: s.totalRevenue ?? 0,
      rating: s.rating ?? 0,
      joinedAt: s.joinedAt ?? s.createdAt ?? '',
      lastActiveAt: s.lastActiveAt ?? '',
      documents: []
    }));
  }

  filterSuppliers(): void {
    const normalized = this.normalizeList(this.suppliers);
    this.filteredSuppliers = normalized.filter(supplier => {
      const matchesSearch = !this.searchTerm || 
        supplier.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || supplier.status === this.statusFilter as any;
      const matchesRating = !this.ratingFilter || supplier.rating >= parseFloat(this.ratingFilter);
      
      return matchesSearch && matchesStatus && matchesRating;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.ratingFilter = '';
    this.filteredSuppliers = [...this.normalizeList(this.suppliers)];
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) {
      stars += '☆';
    }
    return stars;
  }

  viewSupplier(supplier: Supplier): void {
    console.log('View supplier:', supplier);
  }

  editSupplier(supplier: Supplier): void {
    console.log('Edit supplier:', supplier);
  }

  verifySupplier(supplier: Supplier): void {
    this.api.verifySupplier(supplier.id, true).subscribe({
      next: () => {
        supplier.status = 'verified';
      },
      error: (err) => {
        console.error('Verify supplier failed', err);
      }
    });
  }

  suspendSupplier(supplier: Supplier): void {
    this.api.verifySupplier(supplier.id, false).subscribe({
      next: () => {
        supplier.status = 'suspended';
      },
      error: (err) => {
        console.error('Suspend supplier failed', err);
      }
    });
  }

  addSupplier(): void {
    this.router.navigate(['/suppliers/add']);
  }

  exportSuppliers(): void {
    const headers = ['ID','Name','Email','Phone','Address','City','Province','Status','Products','Revenue','Rating','Joined'];
    const rows = this.filteredSuppliers.map(s => [
      s.id,
      s.name,
      s.email,
      s.phone,
      s.address,
      s.city,
      s.province,
      s.status,
      s.productsCount,
      s.totalRevenue,
      s.rating,
      s.joinedAt
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suppliers.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
