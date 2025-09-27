// Authentication feature exports
export { AuthProvider, useAuth } from './AuthContext';
export { default as LoginPage } from './pages/LoginPage';
export { default as RegisterPage } from './pages/RegisterPage';
export { default as ProfilePage } from './pages/ProfilePage';
export { AuthService } from './services/auth.client';
export { CookieAuthService } from './services/cookie-auth.client';

// Services
export * from './services/auth-logic.service';

// Hooks
export * from './hooks/useAuthLogic';
