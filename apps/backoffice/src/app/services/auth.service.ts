import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    roles: string[];
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    lastLoginAt?: string;
  };
  token: string;
  expiresAt: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: string[];
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  responseType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = 'https://api.vncompare.com/api/v1';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // OAuth Configuration
  private readonly oauthConfig: OAuthConfig = {
    clientId: 'baBSjc9FRYLO09U5b7nSURc3yfxoPrdYdf_CHU7XLT0',
    redirectUri: 'http://admin.vncompare.com',
    scope: 'openid profile email',
    responseType: 'code'
  };

  constructor(private http: HttpClient) {
    // Check for stored token on service initialization
    this.loadStoredUser();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Store token and user data
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_data', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  private loadStoredUser(): void {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  // OAuth Methods
  initiateOAuthLogin(): void {
    const authUrl = `${this.API_BASE_URL}/auth/oauth/authorize?` +
      `client_id=${this.oauthConfig.clientId}&` +
      `redirect_uri=${encodeURIComponent(this.oauthConfig.redirectUri)}&` +
      `scope=${encodeURIComponent(this.oauthConfig.scope)}&` +
      `response_type=${this.oauthConfig.responseType}&` +
      `state=${this.generateState()}`;
    
    window.location.href = authUrl;
  }

  handleOAuthCallback(code: string, state: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/oauth/token`, {
      code,
      state,
      client_id: this.oauthConfig.clientId,
      redirect_uri: this.oauthConfig.redirectUri
    }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  getOAuthConfig(): OAuthConfig {
    return { ...this.oauthConfig };
  }
}
