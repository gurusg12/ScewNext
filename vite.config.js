import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.webp', 'logo.webp', 'logo.webp'],
      manifest: {
        name: 'Scewnext',
        short_name: 'Scewnext',
        description: 'Building a stable ',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'logo.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      },
      devOptions: {
        enabled: true 
      }
    })
  ]
})