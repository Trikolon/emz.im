/**
 * Custom thumbnail crop positions for specific photos.
 *
 * Sharp supports the following position values:
 * - center, top, bottom, left, right
 * - left top, right top, left bottom, right bottom
 *
 * By default, thumbnails are cropped from the center.
 * Use this configuration to override the crop position for specific photos.
 */
module.exports = {
  // Crop from the left to keep the main subject in frame
  teufelsberg: "left",

  // Crop from the bottom to preserve the horizon
  "muted-sky": "bottom",

  // Center the "hotel" sign in the frame
  hotel: "top",
};
