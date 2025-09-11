import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="app-container">
      <div class="app-toolbar">
        <span>VNCompare Backoffice</span>
        <span class="spacer"></span>
        <button class="btn btn-primary" (click)="openLoginDialog()">
          Login
        </button>
      </div>

      <div class="main-content">
        <div class="welcome-section">
          <h2>Welcome to VNCompare Backoffice</h2>
          <p>Click the Login button to test the authentication system.</p>
          <button class="btn btn-primary" (click)="openLoginDialog()">
            Test Login Dialog
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      background-color: #1976d2;
      color: white;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .spacer {
      flex: 1 1 auto;
    }

    .main-content {
      flex: 1;
      padding: 24px;
      background-color: #f5f5f5;
    }

    .welcome-section {
      text-align: center;
      padding: 48px 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .welcome-section h2 {
      color: #333;
      margin-bottom: 16px;
      font-size: 2rem;
    }

    .welcome-section p {
      color: #666;
      margin-bottom: 24px;
      font-size: 1.1rem;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1565c0;
    }

    .btn:not(:last-child) {
      margin-right: 8px;
    }
  `]
})
export class App {
  title = 'VNCompare Backoffice';

  openLoginDialog(): void {
    alert('Login dialog will be implemented after fixing Angular Material issues.');
    console.log('Login dialog clicked');
  }
}