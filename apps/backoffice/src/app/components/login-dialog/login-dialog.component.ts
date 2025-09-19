import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="login-dialog">
      <h2 mat-dialog-title>Login to VNCompare Backoffice</h2>
      
      <mat-dialog-content>
        <!-- OAuth Login Section -->
        <div class="oauth-section">
          <button mat-raised-button 
                  color="primary" 
                  class="oauth-button"
                  (click)="onOAuthLogin()"
                  [disabled]="isLoading">
            <mat-icon>account_circle</mat-icon>
            Login with OAuth
          </button>
        </div>

        <div class="divider">
          <span>or</span>
        </div>

        <!-- Traditional Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput 
                   type="email" 
                   formControlName="email" 
                   placeholder="Enter your email"
                   autocomplete="email">
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput 
                   [type]="hidePassword ? 'password' : 'text'" 
                   formControlName="password" 
                   placeholder="Enter your password"
                   autocomplete="current-password">
            <button mat-icon-button 
                    matSuffix 
                    type="button"
                    (click)="hidePassword = !hidePassword"
                    [attr.aria-label]="'Hide password'"
                    [attr.aria-pressed]="hidePassword">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button 
                type="button" 
                (click)="onCancel()"
                [disabled]="isLoading">
          Cancel
        </button>
        <button mat-raised-button 
                color="accent" 
                type="submit"
                (click)="onSubmit()"
                [disabled]="loginForm.invalid || isLoading">
          <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
          <span *ngIf="!isLoading">Login with Email</span>
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    :host {
      --ios-blue: #007AFF;
      --ios-green: #34C759;
      --ios-red: #FF3B30;
      --ios-gray: #8E8E93;
      --ios-gray2: #AEAEB2;
      --ios-gray3: #C7C7CC;
      --ios-gray4: #D1D1D6;
      --ios-gray5: #E5E5EA;
      --ios-gray6: #F2F2F7;
      --ios-label: #000000;
      --ios-secondary-label: #3C3C43;
      --ios-separator: #3C3C43;
      --ios-opaque-separator: #C6C6C8;
      --ios-system-background: #FFFFFF;
      --ios-grouped-background: #F2F2F7;
    }

    .login-dialog {
      min-width: 400px;
      max-width: 500px;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px 0;
    }

    .full-width {
      width: 100%;
    }

    .error-message {
      color: var(--ios-red);
      font-size: 15px;
      margin-top: 8px;
      padding: 12px 16px;
      background-color: #FFEBEE;
      border-radius: 10px;
      border: 0.5px solid #FFCDD2;
      font-weight: 500;
    }

    mat-dialog-actions {
      padding: 20px 0 0 0;
      margin: 0;
      gap: 12px;
      justify-content: flex-end;
    }

    mat-dialog-actions button {
      margin: 0;
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      min-height: 36px;
      padding: 10px 20px;
      letter-spacing: -0.2px;
    }

    mat-dialog-actions button[mat-button] {
      color: var(--ios-blue);
      background-color: transparent;
    }

    mat-dialog-actions button[mat-raised-button] {
      background-color: var(--ios-blue);
      color: white;
    }

    mat-dialog-actions button[mat-raised-button]:hover {
      background-color: #0056CC;
    }

    mat-dialog-actions button:active {
      transform: scale(0.96);
    }

    mat-spinner {
      margin-right: 8px;
    }

    h2 {
      margin: 0 0 20px 0;
      color: var(--ios-label);
      font-weight: 700;
      font-size: 22px;
      letter-spacing: -0.4px;
    }

    .oauth-section {
      margin-bottom: 20px;
    }

    .oauth-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      background-color: var(--ios-blue);
      color: white;
      border: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .oauth-button:hover {
      background-color: #0056CC;
    }

    .oauth-button:active {
      transform: scale(0.96);
      background-color: #004BB5;
    }

    .divider {
      text-align: center;
      margin: 20px 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 0.5px;
      background-color: var(--ios-opaque-separator);
    }

    .divider span {
      background-color: var(--ios-system-background);
      padding: 0 16px;
      color: var(--ios-secondary-label);
      font-size: 15px;
      font-weight: 500;
    }

    ::ng-deep .mat-mdc-form-field {
      .mat-mdc-text-field-wrapper {
        border-radius: 10px;
        background-color: var(--ios-system-background);
      }

      .mat-mdc-form-field-focus-overlay {
        background-color: transparent;
      }

      .mat-mdc-form-field-outline {
        color: var(--ios-opaque-separator);
      }

      .mat-mdc-form-field-outline-thick {
        color: var(--ios-blue);
      }

      .mat-mdc-input-element {
        font-size: 15px;
        color: var(--ios-label);
        padding: 16px 12px;
      }

      .mat-mdc-form-field-label {
        color: var(--ios-secondary-label);
        font-size: 15px;
        font-weight: 500;
      }

      .mat-mdc-form-field-label.mdc-floating-label--float-above {
        color: var(--ios-blue);
      }

      .mat-mdc-form-field-hint {
        color: var(--ios-secondary-label);
        font-size: 13px;
      }

      .mat-mdc-form-field-error {
        color: var(--ios-red);
        font-size: 13px;
        font-weight: 500;
      }
    }

    ::ng-deep .mat-mdc-dialog-container {
      .mdc-dialog__surface {
        border-radius: 16px;
        background-color: var(--ios-system-background);
      }
    }
  `]
})
export class LoginDialogComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.dialogRef.close({ success: true, user: response.user });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
          console.error('Login error:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }

  onOAuthLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      this.authService.initiateOAuthLogin();
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = 'OAuth login failed. Please try again.';
      console.error('OAuth login error:', error);
    }
  }
}
