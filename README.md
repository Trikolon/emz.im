
# [emz.im](https://emz.im)

Personal website built with [Vite](https://vite.dev) and [Lit](https://lit.dev).

## Development

### Getting Started

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Linting

You can auto format code via:

```bash
npm run prettier
```

You can lint code via:

```bash
npm run lint
```

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.


### Adding New Photos

1. Place your image files in the `scripts/photos/src` directory

2. TIF is the recommended source format for images exported from Apple Photos.
   Make sure that every image has a title set. You can do this in Apple Photos
   in the "Info" window. This will be used as the title in the UI.
   Also set "Caption" which will be used for the image alt text.

3. Run the script: `npm run convert-photos`. This converts your images to AVIF
   and compresses them. It also extracts metadata from the images (e.g. EXIF)
   which will be displayed in the photo lightbox.
   The script deletes each source file after a successful conversion, so only copy
   images into `scripts/photos/src` when you're ready to add them and keep a backup
   elsewhere if you need the originals.

4. If your image does not set a "Caption" or you don't want to use it add alt
   text in `src/assets/photos/photo-metadata`. The object key is the file name
   without extension.

   Optionally you can also add `position` which defines which part of the image
   the thumbnails in the photo gallery show.

### Adding New Blog Posts

Add a new `<blog-post>` element to `blog.html`.

