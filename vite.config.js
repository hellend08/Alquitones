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
    allowedHosts: ["alquitonesfront-production.up.railway.app"]
  }
});
