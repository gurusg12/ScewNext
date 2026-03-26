import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Added apple-touch-icon.png to assets
      includeAssets: ['logo.webp', 'apple-touch-icon.png', 'favicon.ico'],
      manifest: {
        name: 'CIVINEST BUILDERS & DEVELOPERS LLP',
        short_name: 'CIVINEST BUILDERS & DEVELOPERS LLP', // Suggestion: keep this short so it doesn't get truncated on home screens
        description: 'CIVINEST BUILDERS & DEVELOPERS LLP is a Limited Liability Partnership company incorporated in India.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'logo-192.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'logo-512.webp',
            sizes: '512x512',
            type: 'image/webp'
          },
          // Pro Tip: Add one PNG as a fallback for maximum compatibility
          {
            src: 'logo-512.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module' // Ensures service worker works correctly in dev mode
      }
    })
  ]
})