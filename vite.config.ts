import { defineConfig } from 'vite'
import type { Connect, Plugin } from 'vite'

const PHOTOS_BASE_PATH = '/photos'
const PHOTOS_ENTRYPOINT = '/photos.html'

/**
 * Detects whether the provided path ends with a file extension.
 * Used to avoid rewriting asset/file requests to the SPA entry point.
 */
const hasFileExtension = (pathname: string): boolean => /\.[^/]+$/.test(pathname)

/**
 * Determines if a path should be rewritten to the photos entry point.
 * @param pathname - The request pathname to evaluate.
 * @returns True if the pathname should be rewritten to the photos entry point.
 */
const shouldRewriteToPhotosEntry = (pathname: string): boolean => {
  if (pathname === PHOTOS_ENTRYPOINT) {
    return false
  }

  if (pathname === PHOTOS_BASE_PATH || pathname === `${PHOTOS_BASE_PATH}/`) {
    return true
  }

  return pathname.startsWith(`${PHOTOS_BASE_PATH}/`) && !hasFileExtension(pathname)
}

/**
 * Creates a Vite connect middleware that rewrites nested /photos/* paths
 * to the photos entrypoint so deep links work in dev/preview servers.
 */
const createPhotosRewriteMiddleware = (): Connect.NextHandleFunction => {
  return (req, _res, next) => {
    const mutableRequest = req as { url?: string | null }
    const requestUrl = mutableRequest.url
    if (typeof requestUrl !== 'string') {
      next()
      return
    }

    try {
      const parsedUrl = new URL(requestUrl, 'http://localhost')
      if (shouldRewriteToPhotosEntry(parsedUrl.pathname)) {
        mutableRequest.url = `${PHOTOS_ENTRYPOINT}${parsedUrl.search}`
      }
    } catch {
      // Ignore parse errors and continue to the next middleware.
    }

    next()
  }
}

/**
 * Registers photo path rewrites for Vite dev/preview servers.
 */
const photosPathPlugin = (): Plugin => {
  const middleware = createPhotosRewriteMiddleware()
  return {
    name: 'photos-path-rewrite',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    }
  }
}

export default defineConfig({
  plugins: [photosPathPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        photos: 'photos.html',
        blog: 'blog.html',
        404: '404.html'
      }
    }
  }
})
