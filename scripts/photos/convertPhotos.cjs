#!/usr/bin/env node

const sharp = require('sharp');
const path = require('path');
const fs = require('fs/promises');
const exifr = require('exifr');

// Configuration
const QUALITY = 70;
const DEST_FORMAT = 'avif';

// Get the repository root directory (parent of scripts directory)
const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.join(SCRIPT_DIR, '../..');
const SOURCE_DIR = path.join(SCRIPT_DIR, 'src');
const DEST_DIR = path.join(REPO_ROOT, 'src/assets/photos');

// Only extract the metadata fields we use in the photo gallery.
const METADATA_FIELDS = [
    'DateTimeOriginal',
    'ExposureTime',
    'FNumber',
    'ISO',
    'FocalLength',
    'LensModel'
];

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

async function convertImage(sourcePath, outputPath) {
    console.info(`Converting to ${outputPath}`);
    await sharp(sourcePath)
        .avif({
            quality: QUALITY,
        })
        .toFile(outputPath);
}

async function processFile(file) {
    const newname = file
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\.[^/.]+$/, '');

    const sourcePath = path.join(SOURCE_DIR, file);
    const outputPath = path.join(DEST_DIR, `${newname}.${DEST_FORMAT}`);
    const metadataPath = path.join(DEST_DIR, `${newname}.json`);

    console.info(`Processing ${sourcePath}`);

    // Run metadata extraction and conversion in parallel
    await Promise.all([
        extractMetadata(sourcePath, metadataPath, file),
        convertImage(sourcePath, outputPath)
    ]);
}

async function convertPhotos() {
    try {
        // Create output directory if it doesn't exist
        await fs.mkdir(DEST_DIR, { recursive: true });

        console.info(`Converting images to ${DEST_FORMAT} with quality ${QUALITY}`);

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