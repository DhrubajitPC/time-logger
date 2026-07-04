import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  build: {
    // Firebase is large; split it into its own long-lived vendor chunk so app
    // code changes don't bust its cache. The chunk is expected to exceed the
    // default 500 kB warning threshold.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-180.png', 'icon-512.png'],
      manifest: {
        name: 'Time Pop',
        short_name: 'Time Pop',
        description: 'Where is your time going? A delightful time tracker.',
        display: 'standalone',
        background_color: '#FFF6EC',
        theme_color: '#FFF6EC',
        start_url: '.',
        icons: [
          { src: 'icon-180.png', sizes: '180x180', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // Firebase auth/firestore endpoints must never be cached by the SW.
        navigateFallbackDenylist: [/^\/__\/auth/, /^\/__\/firebase/],
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      },
    }),
  ],
});
