#!/usr/bin/env node

/**
 * This script converts photos from a source directory to an optimized format.
 * It processes images in parallel using worker threads for better performance.
 *
 * For each source image, it:
 * - Creates a full-size optimized version
 * - Creates a thumbnail version
 * - Extracts relevant EXIF metadata and saves it as JSON
 *
 * The script uses a configurable number of worker threads based on CPU cores,
 * with each worker handling the conversion and metadata extraction for assigned images.
 *
 * Configuration includes:
 * - Quality settings for full-size and thumbnail images
 * - Output format
 * - Thumbnail dimensions
 * - Which EXIF metadata fields to extract
 *
 * Output files are organized in separate directories for:
 * - Full-size converted images
 * - Thumbnails
 * - Metadata JSON files
 */

const path = require("path");
const fs = require("fs/promises");
const { Worker } = require("worker_threads");
const os = require("os");

// Configuration
const QUALITY = 70;
const THUMBNAIL_QUALITY = 60;
const DEST_FORMAT = "avif";
const THUMBNAIL_WIDTH = 600;

// Get the repository root directory (parent of scripts directory)
const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.join(SCRIPT_DIR, "../..");
// Where to find the source photos to convert.
const SOURCE_DIR = path.join(SCRIPT_DIR, "src");
// Where to save the converted photos.
const DEST_DIR = path.join(REPO_ROOT, "src/assets/photos");
// Where to save the full-size photos.
const FULL_SIZE_DIR = path.join(DEST_DIR, "full-size");
// Where to save the thumbnails
const THUMBNAIL_DIR = path.join(DEST_DIR, "thumbnails");
// Where to save the metadata
const META_DIR = path.join(DEST_DIR, "meta");

// Only extract the metadata fields we use in the photo gallery.
const METADATA_FIELDS = [
  "DateTimeOriginal",
  "ExposureTime",
  "FNumber",
  "ISO",
  "FocalLength",
  "LensModel",
  "ObjectName",
];

// Number of worker threads to use (leave some cores free for system)
const WORKER_COUNT = Math.max(1, os.cpus().length - 1);

/**
 * Creates and initializes a new worker thread
 * @returns {Promise<Worker>} A promise that resolves to an initialized worker
 */
async function createWorker() {
  const worker = new Worker(path.join(__dirname, "convertWorker.cjs"));

  worker.postMessage({
    type: "init",
    config: {
      QUALITY,
      THUMBNAIL_QUALITY,
      DEST_FORMAT,
      THUMBNAIL_WIDTH,
      SOURCE_DIR,
      FULL_SIZE_DIR,
      THUMBNAIL_DIR,
      META_DIR,
      METADATA_FIELDS,
    },
  });

  return new Promise((resolve) => {
    worker.once("message", (message) => {
      if (message.type === "ready") resolve(worker);
    });
  });
}

/**
 * Processes image files using a pool of worker threads
 * @param {string[]} files - Array of image file names to process
 * @returns {Promise<void>}
 */
async function processWithWorkers(files) {
  console.info(`Processing with ${WORKER_COUNT} workers`);

  // Create worker pool
  const workers = await Promise.all(
    Array(WORKER_COUNT)
      .fill()
      .map(() => createWorker()),
  );

  const results = [];
  let nextFileIndex = 0;
  let completedFiles = 0;

  // Process files using available workers
  await new Promise((resolve, reject) => {
    workers.forEach((worker) => {
      worker.on("message", (message) => {
        if (message.type === "done") {
          results.push(message);
          completedFiles++;

          // Log progress
          const percent = Math.round((completedFiles / files.length) * 100);
          console.info(`Progress: ${completedFiles}/${files.length} (${percent}%)`);

          // Process next file if available
          if (nextFileIndex < files.length) {
            worker.postMessage({ type: "process", file: files[nextFileIndex++] });
          } else if (completedFiles === files.length) {
            resolve();
          }
        }
      });

      worker.on("error", reject);

      // Start initial file processing
      if (nextFileIndex < files.length) {
        worker.postMessage({ type: "process", file: files[nextFileIndex++] });
      }
    });
  });

  // Clean up workers
  await Promise.all(workers.map((worker) => worker.terminate()));

  // Report failures
  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.warn(`\nFailed to process ${failed.length} files:`);
    failed.forEach((f) => console.warn(`- ${f.file}: ${f.error}`));
  }
}

/**
 * Main function to convert photos from source directory to destination formats
 * Creates full-size images, thumbnails, and extracts metadata
 * @returns {Promise<void>}
 */
async function convertPhotos() {
  try {
    // Create output directories if they don't exist
    await fs.mkdir(FULL_SIZE_DIR, { recursive: true });
    await fs.mkdir(THUMBNAIL_DIR, { recursive: true });
    await fs.mkdir(META_DIR, { recursive: true });

    console.info(`Converting images to ${DEST_FORMAT}`);
    console.info(`Using ${WORKER_COUNT} worker threads`);
    console.info(`Full size quality: ${QUALITY}`);
    console.info(`Thumbnail quality: ${THUMBNAIL_QUALITY}`);
    console.info(`Thumbnail width: ${THUMBNAIL_WIDTH}px`);

    // Get all files from source directory
    const files = await fs.readdir(SOURCE_DIR);
    const imageFiles = files.filter((file) => !file.startsWith("."));

    await processWithWorkers(imageFiles);

    console.info("\nConversion completed successfully");
  } catch (error) {
    console.error("Error during conversion:", error);
    process.exit(1);
  }
}

convertPhotos();
