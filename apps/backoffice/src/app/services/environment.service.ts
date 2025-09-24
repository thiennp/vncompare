import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly API_BASE_URLS = {
    localhost: 'http://localhost:8000/api/v1',
    production: 'https://api.vncompare.com/api/v1'
  };

  constructor() {}

  /**
   * Get the appropriate API base URL based on the current environment
   * @returns The API base URL for the current environment
   */
  getApiBaseUrl(): string {
    const hostname = window.location.hostname;
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.0.');
    const apiUrl = isDev ? this.API_BASE_URLS.localhost : this.API_BASE_URLS.production;
    
    // Log the environment detection for debugging
    console.log(`🌍 Environment Detection:`, {
      hostname,
      isDevelopment: isDev,
      apiUrl,
      environment: isDev ? 'development' : 'production'
    });
    
    return apiUrl;
  }

  /**
   * Check if the app is running in development mode
   * @returns True if running locally, false otherwise
   */
  isDevelopment(): boolean {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.0.');
  }

  /**
   * Check if the app is running in production mode
   * @returns True if running on production domain, false otherwise
   */
  isProduction(): boolean {
    return !this.isDevelopment();
  }

  /**
   * Get the current environment name
   * @returns 'development' or 'production'
   */
  getEnvironment(): string {
    return this.isDevelopment() ? 'development' : 'production';
  }
}
