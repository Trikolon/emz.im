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
  date?: Date;
  /** Optional CSS object-position value */
  position?: string;
  /** EXIF and other metadata */
  metadata?: PhotoMetadata;
}

/**
 * EXIF and other metadata
 */
export interface PhotoMetadata {
  /** Date and time the photo was taken */
  DateTimeOriginal: string;
  /** Exposure time in seconds */
  ExposureTime?: number;
  /** Aperture value */
  FNumber?: number;
  /** ISO speed */
  ISO?: number;
  /** Focal length in millimeters */
  FocalLength?: number;
  /** Lens model */
  LensModel?: string;
}
