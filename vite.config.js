import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({ 
      exportAsDefault: false,
      svgrOptions: {
        ref: true,
        svgo: false,
      }
    })
  ],
  base: '/kanban/',
})