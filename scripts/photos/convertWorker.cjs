const sharp = require("sharp");
const { parentPort } = require("worker_threads");
const path = require("path");
const fs = require("fs/promises");
const exifr = require("exifr");

// Configuration will be passed from the main thread
let config;

// Handle messages from the main thread
parentPort.on("message", async (message) => {
  if (message.type === "init") {
    config = message.config;
    parentPort.postMessage({ type: "ready" });
  } else if (message.type === "process") {
    try {
      await processFile(message.file);
      parentPort.postMessage({ type: "done", file: message.file, success: true });
    } catch (error) {
      parentPort.postMessage({
        type: "done",
        file: message.file,
        success: false,
        error: error.message,
      });
    }
  }
});

/**
 * Extracts metadata from an image file and saves it to JSON
 * @param {string} sourcePath - Path to the source image file
 * @param {string} metadataPath - Path where metadata JSON should be saved
 * @param {string} filename - Original filename for logging purposes
 * @returns {Promise<void>}
 */
async function extractMetadata(sourcePath, metadataPath, filename) {
  try {
    const metadata = await exifr.parse(sourcePath, {
      iptc: true,
    });

    if (metadata) {
      // Workaround for "pick" property not working for exifr parse when
      // including iptc fields.
      // See https://github.com/MikeKovarik/exifr/issues/79
      // Instead of letting exifr filter the metadata, we filter it manually.
      // This makes parsing a bit slower, but that's acceptable for the input
      // size.
      const allowedFields = new Set(config.METADATA_FIELDS);
      const filteredMetadata = Object.fromEntries(
        Object.entries(metadata).filter(([key]) => allowedFields.has(key)),
      );
      await fs.writeFile(metadataPath, JSON.stringify(filteredMetadata, null, 2));
    }
  } catch (exifError) {
    console.warn(`Warning: Could not extract metadata from ${filename}:`, exifError.message);
  }
}

/**
 * Converts an image to the destination format with specified options
 * @param {string} sourcePath - Path to the source image file
 * @param {string} outputPath - Path where converted image should be saved
 * @param {Object} options - Conversion options
 * @param {number} [options.width] - Target width for resizing
 * @param {number} [options.quality] - Image quality (1-100)
 * @returns {Promise<void>}
 */
async function convertImage(sourcePath, outputPath, options = {}) {
  let pipeline = sharp(sourcePath);

  if (options.width) {
    pipeline = pipeline.resize(options.width, null, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  await pipeline
    .avif({
      quality: options.quality || config.QUALITY,
    })
    .toFile(outputPath);
}

/**
 * Processes a single image file, creating full-size and thumbnail versions
 * and extracting metadata
 * @param {string} file - Name of the file to process
 * @returns {Promise<void>}
 */
async function processFile(file) {
  const newname = file
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\.[^/.]+$/, "");

  const sourcePath = path.join(config.SOURCE_DIR, file);
  const fullSizePath = path.join(config.FULL_SIZE_DIR, `${newname}.${config.DEST_FORMAT}`);
  const thumbnailPath = path.join(config.THUMBNAIL_DIR, `${newname}.${config.DEST_FORMAT}`);
  const metadataPath = path.join(config.META_DIR, `${newname}.json`);

  await Promise.all([
    extractMetadata(sourcePath, metadataPath, file),
    convertImage(sourcePath, fullSizePath),
    convertImage(sourcePath, thumbnailPath, {
      width: config.THUMBNAIL_WIDTH,
      quality: config.THUMBNAIL_QUALITY,
    }),
  ]);
}
