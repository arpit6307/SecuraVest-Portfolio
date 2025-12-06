import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // FIX APPLIED: Added server fallback for Single Page Application (SPA) routing
  server: {
    historyApiFallback: true,
  }
})
