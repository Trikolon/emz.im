#!/bin/bash
# Helper script to convert and compress photos for the photos page.

# Get the repository root directory (parent of scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Configuration
SOURCE_DIR="${SCRIPT_DIR}/src"
DEST_DIR="${REPO_ROOT}/src/assets/photos"
SOURCE_FORMAT="heic"
DEST_FORMAT="avif"
QUALITY="75%"

# Create output directory if it doesn't exist
mkdir -p "${DEST_DIR}"

echo "Converting HEIC files to ${DEST_FORMAT} with quality ${QUALITY}"

# Process files from src directory
for file in "${SOURCE_DIR}"/*.${SOURCE_FORMAT}; do
    # Create lowercase filename with hyphens instead of spaces
    newname=$(echo "${file##*/}" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed "s/\.${SOURCE_FORMAT}$//")

    # Convert to avif
    output_path="${DEST_DIR}/${newname}.${DEST_FORMAT}"

    echo "Converting ${file} to ${output_path}"
    magick "${file}" -quality "${QUALITY}" "${output_path}"
done