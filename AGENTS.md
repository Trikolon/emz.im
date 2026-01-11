# AGENTS.md

## Project Summary
- Personal website (home, blog, photos) built with Vite + Lit.
- Static HTML entry points with Lit web components and TypeScript.
- Photo gallery pipeline generates AVIF/WebP assets and EXIF metadata.

## Tech Stack
- Frontend: TypeScript, Lit web components, vanilla HTML/CSS.
- Build: Vite with custom plugins in `vite.config.ts`.
- Tooling: ESLint, Prettier, TypeScript.
- Photo processing: Node.js scripts using `sharp`, `exifr`, worker threads.

## Key Entry Points
- `index.html`: Home page.
- `blog.html`: Blog page (uses `<blog-post>`).
- `photos.html`: Photo gallery page (uses `<photo-gallery>`).
- `404.html`: Not found page.
- `src/index.css`: Global styles and theme variables.

## Main Components (src)
- `navigation-bar.ts`: Main nav with active route styling.
- `blog-post.ts`: Blog post component and external link handling.
- `photo-gallery.ts`: Gallery grid, deep-link routing, lightbox wiring.
- `lightbox-dialog.ts`: Fullscreen photo viewer, keyboard navigation.
- `photo-info-panel.ts`: EXIF metadata panel for photos.
- `pixel-cat.ts`: Animated mascot.
- `text-expand.ts`: Inline expandable text.
- `types.ts`: Shared types for photos and lightbox events.

## Photo Data Flow
- Source images: `scripts/photos/src`.
- Conversion script: `npm run convert-photos`.
  - Generates AVIF/WebP full-size + thumbnails and metadata JSON.
  - Writes to `src/assets/photos/{full-size,thumbnails,meta}`.
  - Deletes source files after successful conversion.
- Gallery data: `src/assets/photos/index.ts` loads images + metadata via `import.meta.glob`.
- Optional overrides: `src/assets/photos/photo-metadata.ts` (alt text, etc.).

## Vite Build Behavior
- Multi-page input defined in `vite.config.ts`.
- Dev/preview rewrite: `/photos/<slug>` routes to `photos.html` for local deep links.
- Build plugin emits per-photo OG pages at `photos/<id>/index.html`.
- Canonical URL and author name come from `package.json` `site` metadata.

## Scripts
- `npm run dev`: Vite dev server.
- `npm run build`: Typecheck and build production assets into `dist`.
- `npm run lint`: Prettier + ESLint + TS typecheck.
- `npm run convert-photos`: Generate photo assets + metadata (destructive to source files).

## Agent Workflow
- Run `npm run lint` after making changes to confirm Prettier, ESLint, and TypeScript pass.

## Hosting Notes
- Security headers live in `public/_headers`.
- `dist` is build output; do not edit directly.

## Common Tasks
- Add a blog post: insert a new `<blog-post>` in `blog.html`.
- Add photos: place originals in `scripts/photos/src` and run `npm run convert-photos`.

## Gotchas
- Photo conversion deletes source files; keep originals elsewhere.
- Photo deep links rely on Vite rewrites and the OG page generator.
