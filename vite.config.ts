import { defineConfig } from 'vite'
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        photos: 'photos.html',
        blog: 'blog.html',
        404: '404.html'
      }
    }
  },
  plugins: [mdPlugin({ mode: [Mode.HTML] })]
})