import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
        client: './src/entry-client.tsx',
        server: './src/entry-server.tsx',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'server' ? 'server/[name].js' : 'client/[name].js';
        },
      },
    },
  },
  optimizeDeps: {
    include: ['mongodb'],
  },
  ssr: {
    noExternal: ['react-router-dom'],
  },
});
