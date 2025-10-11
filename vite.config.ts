import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    rollupOptions: {
      external: [
        'mongodb',
        'bcryptjs',
        'jsonwebtoken',
        'util',
        'crypto',
        'fs',
        'path',
        'os',
        'stream',
        'buffer',
        'events',
        'url',
        'querystring',
        'http',
        'https',
        'net',
        'tls',
        'zlib',
        'child_process',
        'cluster',
        'worker_threads',
        'perf_hooks',
        'async_hooks',
        'timers',
        'tty',
        'readline',
        'repl',
        'vm',
        'v8',
        'inspector',
        'trace_events',
        'diagnostics_channel',
        'wasi',
      ],
    },
  },
  optimizeDeps: {
    exclude: ['mongodb', 'bcryptjs', 'jsonwebtoken'],
  },
});
