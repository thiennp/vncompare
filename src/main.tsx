import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Check if we're in SSR mode (no hydration needed) or client-side mode
const isSSR = document.getElementById('root')?.hasAttribute('data-ssr');

if (isSSR) {
  // SSR mode - hydrate the existing content
  import('./entry-client');
} else {
  // Client-side only mode
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
