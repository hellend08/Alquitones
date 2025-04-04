import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',  // Expone la app públicamente
    port: 5173, // Usa el puerto asignado por Railway
    strictPort: true
  },
  preview: {
    host: '0.0.0.0',  // Expone el preview públicamente
    port:  4173,
    strictPort: true,
    allowedHosts: process.env.VITE_ALLOWED_ORIGINS 
      ? process.env.VITE_ALLOWED_ORIGINS.split(',') 
      : ["alquitonesfront-production.up.railway.app", "http://localhost:5173","alquitonesfront-dev.up.railway.app"]
  }
});
