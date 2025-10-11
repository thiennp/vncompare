// API configuration utility
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (import.meta as any).env?.MODE === 'production'
    ? '/api'
    : 'http://localhost:3001/api';
