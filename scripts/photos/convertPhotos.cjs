#!/usr/bin/env node

const sharp = require('sharp');
const path = require('path');
const fs = require('fs/promises');
const exifr = require('exifr');

// Configuration
const QUALITY = 70;
const THUMBNAIL_QUALITY = 60;
const DEST_FORMAT = 'avif';
const THUMBNAIL_WIDTH = 600; // 2x the display size for high DPI

// Get the repository root directory (parent of scripts directory)
const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.join(SCRIPT_DIR, '../..');
// Where to find the source photos to convert.
const SOURCE_DIR = path.join(SCRIPT_DIR, 'src');
// Where to save the converted photos.
const DEST_DIR = path.join(REPO_ROOT, 'src/assets/photos');
// Where to save the full-size photos.
const FULL_SIZE_DIR = path.join(DEST_DIR, 'full-size');
// Where to save the thumbnails
const THUMBNAIL_DIR = path.join(DEST_DIR, 'thumbnails');
// Where to save the metadata
const META_DIR = path.join(DEST_DIR, 'meta');

// Only extract the metadata fields we use in the photo gallery.
const METADATA_FIELDS = [
    'DateTimeOriginal',
    'ExposureTime',
    'FNumber',
    'ISO',
    'FocalLength',
    'LensModel'
];

/**
 * Extracts relevant EXIF metadata from a photo and saves it to a JSON file.
 * @param {string} sourcePath - Path to the source image file
 * @param {string} metadataPath - Path where the metadata JSON should be saved
 * @param {string} filename - Original filename for logging purposes
 * @returns {Promise<void>}
 */
async function extractMetadata(sourcePath, metadataPath, filename) {
    try {
        const metadata = await exifr.parse(sourcePath, {
            pick: METADATA_FIELDS,
            // Ensure numeric values are returned as numbers
            numeric: true
        });
        
        if (metadata) {
            await fs.writeFile(
                metadataPath,
                JSON.stringify(metadata, null, 2)
            );
            console.info(`Metadata saved to ${metadataPath}`);
        }
    } catch (exifError) {
        console.warn(`Warning: Could not extract metadata from ${filename}:`, exifError.message);
    }
}

/**
 * Converts an image to the configured output format with specified options.
 * @param {string} sourcePath - Path to the source image file
 * @param {string} outputPath - Path where the converted image should be saved
 * @param {Object} options - Conversion options
 * @param {number} [options.width] - Target width for resizing
 * @param {number} [options.quality] - Quality setting (1-100)
 * @returns {Promise<void>}
 */
async function convertImage(sourcePath, outputPath, options = {}) {
    console.info(`Converting to ${outputPath}`);
    let pipeline = sharp(sourcePath);
    
    if (options.width) {
        pipeline = pipeline.resize(options.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
        });
    }

    await pipeline.avif({
        quality: options.quality || QUALITY,
    }).toFile(outputPath);
}

/**
 * Processes a single image file - creates full-size version, thumbnail, and extracts metadata.
 * @param {string} file - Name of the file to process
 * @returns {Promise<void>}
 */
async function processFile(file) {
    const newname = file
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\.[^/.]+$/, '');

    const sourcePath = path.join(SOURCE_DIR, file);
    const fullSizePath = path.join(FULL_SIZE_DIR, `${newname}.${DEST_FORMAT}`);
    const thumbnailPath = path.join(THUMBNAIL_DIR, `${newname}.${DEST_FORMAT}`);
    const metadataPath = path.join(META_DIR, `${newname}.json`);

    console.info(`Processing ${sourcePath}`);

    // Run metadata extraction and both conversions in parallel
    await Promise.all([
        extractMetadata(sourcePath, metadataPath, file),
        convertImage(sourcePath, fullSizePath),
        convertImage(sourcePath, thumbnailPath, {
            width: THUMBNAIL_WIDTH,
            quality: THUMBNAIL_QUALITY
        })
    ]);
}

/**
 * Main function that processes all photos in the source directory.
 * Creates converted versions in full size and thumbnail size, and extracts metadata.
 * @returns {Promise<void>}
 */
async function convertPhotos() {
    try {
        // Create output directories if they don't exist
        await fs.mkdir(FULL_SIZE_DIR, { recursive: true });
        await fs.mkdir(THUMBNAIL_DIR, { recursive: true });
        await fs.mkdir(META_DIR, { recursive: true });

        console.info(`Converting images to ${DEST_FORMAT}`);
        console.info(`Full size quality: ${QUALITY}`);
        console.info(`Thumbnail quality: ${THUMBNAIL_QUALITY}`);
        console.info(`Thumbnail width: ${THUMBNAIL_WIDTH}px`);

        // Get all files from source directory
        const files = await fs.readdir(SOURCE_DIR);
        const imageFiles = files.filter(file => !file.startsWith('.'));

        // Process all files in parallel
        await Promise.all(
            imageFiles.map(file => processFile(file))
        );

        console.info('Conversion completed successfully');
    } catch (error) {
        console.error('Error during conversion:', error);
        process.exit(1);
    }
}

convertPhotos();