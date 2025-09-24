import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { EnvironmentService } from './services/environment.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([])),
    provideAnimations(),
    EnvironmentService,
    AuthService,
    ApiService
  ]
};