import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, User as ApiUser } from '../../../services/api.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-user-page">
      <div class="page-header">
        <div>
          <h1>Add User</h1>
          <p>Create a new user account</p>
        </div>
        <div class="actions">
          <button class="btn btn-outline" (click)="cancel()">Cancel</button>
          <button class="btn btn-primary" [disabled]="submitting" (click)="submit()">
            {{ submitting ? 'Saving...' : 'Save User' }}
          </button>
        </div>
      </div>

      <form (ngSubmit)="submit()" #form="ngForm" class="form-grid">
        <div class="form-card">
          <h2>Personal Information</h2>
          <div class="grid-2">
            <div class="field">
              <label>First Name</label>
              <input type="text" [(ngModel)]="formData.firstName" name="firstName" required />
            </div>
            <div class="field">
              <label>Last Name</label>
              <input type="text" [(ngModel)]="formData.lastName" name="lastName" required />
            </div>
          </div>
          <div class="grid-2">
            <div class="field">
              <label>Email</label>
              <input type="email" [(ngModel)]="formData.email" name="email" required />
            </div>
            <div class="field">
              <label>Phone</label>
              <input type="tel" [(ngModel)]="formData.phone" name="phone" />
            </div>
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" [(ngModel)]="formData.password" name="password" required />
          </div>
        </div>

        <div class="form-card">
          <h2>Account Settings</h2>
          <div class="field">
            <label>Role</label>
            <select [(ngModel)]="formData.role" name="role" required>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPPLIER">Supplier</option>
            </select>
          </div>
          <div class="field">
            <label>
              <input type="checkbox" [(ngModel)]="formData.isActive" name="isActive" />
              Active Account
            </label>
          </div>
          <div class="field">
            <label>
              <input type="checkbox" [(ngModel)]="formData.emailVerified" name="emailVerified" />
              Email Verified
            </label>
          </div>
        </div>
      </form>

      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="success" class="success">{{ success }}</div>
    </div>
  `,
  styles: [`
    .add-user-page { 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 24px; 
    }
    
    .page-header { 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      margin-bottom: 24px; 
    }
    
    .actions { 
      display: flex; 
      gap: 8px; 
    }
    
    .form-grid { 
      display: grid; 
      gap: 16px; 
    }
    
    .form-card { 
      background: #fff; 
      border-radius: 12px; 
      padding: 16px; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.08); 
    }
    
    .form-card h2 {
      margin: 0 0 16px 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }
    
    .grid-2 { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 12px; 
    }
    
    .field { 
      display: flex; 
      flex-direction: column; 
      gap: 6px; 
      margin-bottom: 12px; 
    }
    
    .field label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }
    
    .field input, 
    .field textarea, 
    .field select { 
      padding: 10px 12px; 
      border: 1px solid #e5e7eb; 
      border-radius: 8px; 
      font-size: 14px; 
    }
    
    .field input[type="checkbox"] {
      width: auto;
      margin-right: 8px;
    }
    
    .btn { 
      padding: 8px 16px; 
      border-radius: 6px; 
      cursor: pointer; 
      border: 1px solid transparent; 
      font-weight: 500; 
    }
    
    .btn-outline { 
      background: transparent; 
      border-color: #d1d5db; 
    }
    
    .btn-primary { 
      background: #3730a3; 
      color: #fff; 
    }
    
    .error { 
      margin-top: 12px; 
      color: #b91c1c; 
      background: #fee2e2;
      padding: 12px;
      border-radius: 8px;
    }
    
    .success { 
      margin-top: 12px; 
      color: #065f46; 
      background: #d1fae5;
      padding: 12px;
      border-radius: 8px;
    }
    
    @media (max-width: 768px) { 
      .grid-2 { 
        grid-template-columns: 1fr; 
      } 
    }
  `]
})
export class AddUserComponent {
  submitting = false;
  error: string | null = null;
  success: string | null = null;

  formData: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'USER',
    isActive: true,
    emailVerified: false
  };

  constructor(private api: ApiService, private router: Router) {}

  cancel(): void {
    this.router.navigate(['/users']);
  }

  submit(): void {
    if (this.submitting) { return; }
    this.submitting = true;
    this.error = null;
    this.success = null;

    this.api.createUser(this.formData).subscribe({
      next: () => {
        this.success = 'User created successfully';
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 1500);
      },
      error: (err: any) => {
        console.error('Create user error', err);
        this.error = 'Failed to create user: ' + (err.error?.message || err.message || 'Unknown error');
        this.submitting = false;
      }
    });
  }
}
