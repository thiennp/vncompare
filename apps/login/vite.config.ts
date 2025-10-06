import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(path.dirname(fileURLToPath(import.meta.url))),
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../app'),
    },
  },
  server: {
    port: 3101,
    host: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});


