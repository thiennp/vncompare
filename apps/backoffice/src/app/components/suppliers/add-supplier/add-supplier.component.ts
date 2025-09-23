import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-supplier-page">
      <div class="page-header">
        <div>
          <h1>Add Supplier</h1>
          <p>Create a new supplier profile</p>
        </div>
        <div class="actions">
          <button class="btn btn-outline" (click)="cancel()">Cancel</button>
          <button class="btn btn-primary" [disabled]="submitting" (click)="submit()">
            {{ submitting ? 'Saving...' : 'Save Supplier' }}
          </button>
        </div>
      </div>

      <form (ngSubmit)="submit()" #form="ngForm" class="form-grid">
        <div class="form-card">
          <h2>Company Information</h2>
          <div class="field">
            <label>Company Name</label>
            <input type="text" [(ngModel)]="formData.companyName" name="companyName" required />
          </div>
          <div class="field">
            <label>Description</label>
            <textarea [(ngModel)]="formData.description" name="description" rows="4"></textarea>
          </div>
          <div class="field">
            <label>Website</label>
            <input type="url" [(ngModel)]="formData.website" name="website" />
          </div>
        </div>

        <div class="form-card">
          <h2>Contact</h2>
          <div class="grid-2">
            <div class="field">
              <label>Email</label>
              <input type="email" [(ngModel)]="formData.email" name="email" required />
            </div>
            <div class="field">
              <label>Phone</label>
              <input type="tel" [(ngModel)]="formData.phone" name="phone" required />
            </div>
          </div>
          <div class="field">
            <label>Address</label>
            <input type="text" [(ngModel)]="formData.address" name="address" required />
          </div>
          <div class="grid-2">
            <div class="field">
              <label>City</label>
              <input type="text" [(ngModel)]="formData.city" name="city" required />
            </div>
            <div class="field">
              <label>Province</label>
              <input type="text" [(ngModel)]="formData.province" name="province" required />
            </div>
          </div>
        </div>

        <div class="form-card">
          <h2>Business</h2>
          <div class="grid-2">
            <div class="field">
              <label>Business License</label>
              <input type="text" [(ngModel)]="formData.businessLicense" name="businessLicense" />
            </div>
            <div class="field">
              <label>Tax Code</label>
              <input type="text" [(ngModel)]="formData.taxCode" name="taxCode" />
            </div>
          </div>
        </div>
      </form>

      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="success" class="success">{{ success }}</div>
    </div>
  `,
  styles: [`
    .add-supplier-page { max-width: 900px; margin: 0 auto; padding: 24px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .actions { display: flex; gap: 8px; }
    .form-grid { display: grid; gap: 16px; }
    .form-card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .field input, .field textarea { padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; }
    .btn { padding: 8px 16px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; font-weight: 500; }
    .btn-outline { background: transparent; border-color: #d1d5db; }
    .btn-primary { background: #3730a3; color: #fff; }
    .error { margin-top: 12px; color: #b91c1c; }
    .success { margin-top: 12px; color: #065f46; }
    @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }
  `]
})
export class AddSupplierComponent {
  submitting = false;
  error: string | null = null;
  success: string | null = null;

  formData: any = {
    companyName: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    businessLicense: '',
    taxCode: ''
  };

  constructor(private api: ApiService, private router: Router) {}

  cancel(): void {
    this.router.navigate(['/suppliers']);
  }

  submit(): void {
    if (this.submitting) { return; }
    this.submitting = true;
    this.error = null;
    this.success = null;

    // The backend expects supplier registration payload fields like companyName, contact, etc.
    const payload = { ...this.formData };
    // We'll call a new API method implemented below.
    (this.api as any).createSupplier(payload).subscribe({
      next: () => {
        this.success = 'Supplier created successfully';
        this.submitting = false;
        this.router.navigate(['/suppliers']);
      },
      error: (err: any) => {
        console.error('Create supplier error', err);
        this.error = 'Failed to create supplier';
        this.submitting = false;
      }
    });
  }
}


