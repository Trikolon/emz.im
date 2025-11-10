/**
 * Photo gallery image information
 */
export interface GalleryImage {
  /** Unique identifier for the image */
  id: string;
  /** Full size image source */
  src: string;
  /** Thumbnail image source */
  thumbnail: string;
  /** Alt text describing the image */
  alt: string;
  /** Short title for the image */
  title: string;
  /** When the photo was taken */
  date: Date;
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

/**
 * Event detail for lightbox image change events
 */
export interface LightboxImageChangeDetail {
  /** The image that is now displayed, or null if lightbox is closed */
  image: GalleryImage | null;
  /** Whether the change was initiated by a user click on a gallery tile */
  fromGalleryClick: boolean;
}

/**
 * Custom event dispatched when the lightbox image changes
 */
export type LightboxImageChangeEvent = CustomEvent<LightboxImageChangeDetail>;
