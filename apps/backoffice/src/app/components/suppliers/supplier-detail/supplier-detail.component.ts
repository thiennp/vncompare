import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Supplier as ApiSupplier } from '../../../services/api.service';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="supplier-detail-page">
      <div class="page-header">
        <div class="header-content">
          <button class="btn btn-outline" (click)="goBack()">
            ← Back to Suppliers
          </button>
          <h1>Supplier Details</h1>
          <p>Supplier ID: {{ supplier?.id }}</p>
        </div>
      </div>

      <div class="supplier-content" *ngIf="supplier">
        <div class="supplier-info">
          <div class="info-section">
            <h3>Company Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Company Name:</label>
                <span>{{ supplier.name }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ supplier.email }}</span>
              </div>
              <div class="info-item">
                <label>Phone:</label>
                <span>{{ supplier.phone }}</span>
              </div>
              <div class="info-item">
                <label>Address:</label>
                <span>{{ supplier.address }}</span>
              </div>
              <div class="info-item">
                <label>City:</label>
                <span>{{ supplier.city }}</span>
              </div>
              <div class="info-item">
                <label>Province:</label>
                <span>{{ supplier.province }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Business Status</h3>
            <div class="status-grid">
              <div class="status-item">
                <label>Status:</label>
                <span class="status-badge" [class]="supplier.status">
                  {{ supplier.status }}
                </span>
              </div>
              <div class="status-item">
                <label>Rating:</label>
                <span class="rating">{{ supplier.rating }}/5.0</span>
              </div>
              <div class="status-item">
                <label>Products Count:</label>
                <span>{{ supplier.productsCount }}</span>
              </div>
              <div class="status-item">
                <label>Total Revenue:</label>
                <span>₫{{ supplier.totalRevenue | number }}</span>
              </div>
              <div class="status-item">
                <label>Joined:</label>
                <span>{{ formatDate(supplier.joinedAt) }}</span>
              </div>
              <div class="status-item">
                <label>Last Active:</label>
                <span>{{ formatDate(supplier.lastActiveAt) }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Documents</h3>
            <div class="documents-list" *ngIf="supplierDocuments.length > 0; else noDocuments">
              <div 
                *ngFor="let doc of supplierDocuments" 
                class="document-item">
                <div class="document-info">
                  <div class="document-type">{{ getDocumentTypeLabel(doc.type) }}</div>
                  <div class="document-name">{{ doc.fileName }}</div>
                  <div class="document-status">
                    <span class="status-badge" [class]="doc.status">
                      {{ doc.status }}
                    </span>
                  </div>
                </div>
                <div class="document-actions">
                  <button class="btn btn-sm btn-outline" (click)="viewDocument(doc)">
                    View
                  </button>
                  <button 
                    class="btn btn-sm btn-success" 
                    (click)="approveDocument(doc)"
                    *ngIf="doc.status === 'pending'">
                    Approve
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    (click)="rejectDocument(doc)"
                    *ngIf="doc.status === 'pending'">
                    Reject
                  </button>
                </div>
              </div>
            </div>
            <ng-template #noDocuments>
              <p class="no-documents">No documents uploaded yet.</p>
            </ng-template>
          </div>
        </div>

        <div class="supplier-actions">
          <h3>Supplier Actions</h3>
          <div class="actions-grid">
            <button class="btn btn-outline" (click)="editSupplier()">
              Edit Supplier
            </button>
            <button 
              class="btn btn-success" 
              (click)="verifySupplier()"
              *ngIf="supplier.status === 'pending'">
              Verify Supplier
            </button>
            <button 
              class="btn btn-warning" 
              (click)="suspendSupplier()"
              *ngIf="supplier.status === 'verified'">
              Suspend Supplier
            </button>
            <button 
              class="btn btn-success" 
              (click)="activateSupplier()"
              *ngIf="supplier.status === 'suspended'">
              Activate Supplier
            </button>
            <button class="btn btn-info" (click)="viewProducts()">
              View Products
            </button>
            <button class="btn btn-danger" (click)="deleteSupplier()">
              Delete Supplier
            </button>
          </div>
        </div>

        <div class="supplier-products" *ngIf="supplierProducts.length > 0">
          <h3>Supplier Products</h3>
          <div class="products-table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let product of supplierProducts">
                  <td>{{ product.name }}</td>
                  <td>{{ product.brand }}</td>
                  <td>₫{{ product.price | number }}</td>
                  <td>
                    <span class="status-badge" [class]="product.isActive ? 'active' : 'inactive'">
                      {{ product.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline" (click)="viewProduct(product.id)">
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
        <p>Loading supplier details...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadSupplier()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .supplier-detail-page {
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

    .supplier-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .supplier-info {
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

    .info-grid,
    .status-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-item,
    .status-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item label,
    .status-item label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .info-item span,
    .status-item span {
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
      color: #991b1b;
    }

    .status-badge.rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge.approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .rating {
      color: #f59e0b;
      font-weight: 600;
    }

    .documents-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .document-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .document-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .document-type {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
    }

    .document-name {
      color: #64748b;
      font-size: 0.875rem;
    }

    .document-actions {
      display: flex;
      gap: 8px;
    }

    .no-documents {
      color: #64748b;
      font-style: italic;
      text-align: center;
      padding: 32px;
    }

    .supplier-actions {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .supplier-actions h3 {
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

    .supplier-products {
      grid-column: 1 / -1;
    }

    .supplier-products h3 {
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
      .supplier-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .info-grid,
      .status-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }

      .document-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .document-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class SupplierDetailComponent implements OnInit {
  supplier: ApiSupplier | null = null;
  supplierDocuments: any[] = [];
  supplierProducts: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadSupplier();
  }

  loadSupplier(): void {
    const supplierId = this.route.snapshot.paramMap.get('id');
    if (!supplierId) {
      this.error = 'Supplier ID not provided';
      return;
    }

    this.loading = true;
    this.error = null;

    this.apiService.getSupplier(supplierId).subscribe({
      next: (supplier) => {
        this.supplier = supplier;
        this.loadSupplierDocuments(supplierId);
        this.loadSupplierProducts(supplierId);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading supplier:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
      }
    });
  }

  loadSupplierDocuments(supplierId: string): void {
    // Load supplier documents
    this.apiService.getSupplierDocuments(supplierId).subscribe({
      next: (documents) => {
        this.supplierDocuments = documents;
      },
      error: (error) => {
        console.error('Error loading supplier documents:', error);
        // Load mock data as fallback
        this.loadMockDocuments();
      }
    });
  }

  loadSupplierProducts(supplierId: string): void {
    // Load supplier products
    this.apiService.getProducts({ limit: 50, page: 1 }).subscribe({
      next: (response) => {
        // Filter products by supplier ID
        this.supplierProducts = response.products.filter((product: any) => 
          product.supplier.id === supplierId
        );
      },
      error: (error) => {
        console.error('Error loading supplier products:', error);
        // Load mock data as fallback
        this.loadMockProducts();
      }
    });
  }

  loadMockDocuments(): void {
    this.supplierDocuments = [
      {
        id: 'DOC-001',
        type: 'business_license',
        fileName: 'business_license.pdf',
        fileUrl: 'https://example.com/business_license.pdf',
        uploadedAt: '2024-01-01T00:00:00Z',
        status: 'approved'
      },
      {
        id: 'DOC-002',
        type: 'tax_certificate',
        fileName: 'tax_certificate.pdf',
        fileUrl: 'https://example.com/tax_certificate.pdf',
        uploadedAt: '2024-01-02T00:00:00Z',
        status: 'pending'
      }
    ];
  }

  loadMockProducts(): void {
    this.supplierProducts = [
      {
        id: 'PROD-001',
        name: 'Dulux Weathershield Exterior Paint',
        brand: 'Dulux',
        price: 1250000,
        isActive: true
      },
      {
        id: 'PROD-002',
        name: 'Dulux Interior Paint',
        brand: 'Dulux',
        price: 950000,
        isActive: true
      }
    ];
  }

  getDocumentTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'business_license': 'Business License',
      'tax_certificate': 'Tax Certificate',
      'quality_certificate': 'Quality Certificate',
      'other': 'Other Document'
    };
    return labels[type] || type;
  }

  editSupplier(): void {
    if (this.supplier) {
      this.router.navigate(['/suppliers', this.supplier.id, 'edit']);
    }
  }

  verifySupplier(): void {
    if (!this.supplier) return;

    if (confirm('Are you sure you want to verify this supplier?')) {
      this.apiService.updateSupplierStatus(this.supplier.id, 'verified').subscribe({
        next: (updatedSupplier) => {
          this.supplier = updatedSupplier;
          console.log('Supplier verified successfully');
        },
        error: (error) => {
          console.error('Error verifying supplier:', error);
          alert('Failed to verify supplier: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  suspendSupplier(): void {
    if (!this.supplier) return;

    if (confirm('Are you sure you want to suspend this supplier?')) {
      this.apiService.updateSupplierStatus(this.supplier.id, 'suspended').subscribe({
        next: (updatedSupplier) => {
          this.supplier = updatedSupplier;
          console.log('Supplier suspended successfully');
        },
        error: (error) => {
          console.error('Error suspending supplier:', error);
          alert('Failed to suspend supplier: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  activateSupplier(): void {
    if (!this.supplier) return;

    if (confirm('Are you sure you want to activate this supplier?')) {
      this.apiService.updateSupplierStatus(this.supplier.id, 'verified').subscribe({
        next: (updatedSupplier) => {
          this.supplier = updatedSupplier;
          console.log('Supplier activated successfully');
        },
        error: (error) => {
          console.error('Error activating supplier:', error);
          alert('Failed to activate supplier: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  viewProducts(): void {
    this.router.navigate(['/products'], { queryParams: { supplier: this.supplier?.id } });
  }

  deleteSupplier(): void {
    if (!this.supplier) return;

    if (confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
      this.apiService.deleteSupplier(this.supplier.id).subscribe({
        next: () => {
          console.log('Supplier deleted successfully');
          this.router.navigate(['/suppliers']);
        },
        error: (error) => {
          console.error('Error deleting supplier:', error);
          alert('Failed to delete supplier: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  viewDocument(doc: any): void {
    window.open(doc.fileUrl, '_blank');
  }

  approveDocument(doc: any): void {
    if (confirm('Are you sure you want to approve this document?')) {
      // Note: This would need to be implemented in the API service
      console.log('Document approval not yet implemented in API');
      alert('Document approval functionality not yet implemented');
    }
  }

  rejectDocument(doc: any): void {
    if (confirm('Are you sure you want to reject this document?')) {
      // Note: This would need to be implemented in the API service
      console.log('Document rejection not yet implemented in API');
      alert('Document rejection functionality not yet implemented');
    }
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  goBack(): void {
    this.router.navigate(['/suppliers']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
