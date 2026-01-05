import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',            // Mobile se access ke liye zaruri
    port: 5173,  
    strictPort: true,               // Default Vite port
    proxy: {
      '/api': {
        target: 'http://192.168.43.1:5000', // Laptop ka local IP, 127.0.0.1 nahi!
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
