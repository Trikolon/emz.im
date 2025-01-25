import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        photos: 'photos.html',
        404: '404.html'
      }
    }
  }
})