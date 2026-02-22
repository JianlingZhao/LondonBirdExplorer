import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],

  base: '/',
  server: {
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    force: true
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        console.log("ROLLUP WARNING:", warning);
        warn(warning);
      }
    }
  }
});