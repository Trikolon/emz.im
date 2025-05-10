/**
 * Photo gallery image information
 */
export interface GalleryImage {
  /** Full size image source */
  src: string;
  /** Thumbnail image source */
  thumbnail: string;
  /** Alt text describing the image */
  alt: string;
  /** Short caption for the image */
  caption: string;
  /** When the photo was taken */
  date: Date;
  /** Optional CSS object-position value to position the thumbnail cutout */
  position?: string;
  /** Advanced metadata used by the photo info panel. */
  advancedMeta: AdvancedPhotoMetadata;
}

/**
 * Advanced metadata used by the photo info panel.
 */
export interface AdvancedPhotoMetadata {
  /** Exposure time in seconds */
  exposureTime?: number;
  /** Aperture value */
  aperture?: number;
  /** ISO speed */
  iso?: number;
  /** Focal length in millimeters */
  focalLength?: number;
  /** Lens model */
  lensModel?: string;
}
