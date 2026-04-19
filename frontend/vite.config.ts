import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// All VITE_ prefixed env vars are automatically exposed by Vite.
// Do NOT manually inject secrets here — use import.meta.env.VITE_* in code.

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mapbox: ['mapbox-gl', 'react-map-gl'],
          motion: ['motion'],
        },
      },
    },
  },
  server: {
    port: 5173,
    // Proxy API calls to backend in local development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
