import { GalleryImage } from "../../types";
import { photoMetadata } from "./photo-metadata";

/**
 * EXIF and other metadata from the import script.
 */
export interface PhotoMetadataGenerated {
  /** Photo Title */
  ObjectName: string;
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

// Import all full-size images, thumbnails, and metadata using glob imports
const fullSizeImages = import.meta.glob("./full-size/*.avif", { eager: true }) as Record<
  string,
  { default: string }
>;
const thumbnails = import.meta.glob("./thumbnails/*.avif", { eager: true }) as Record<
  string,
  { default: string }
>;
const metadata = import.meta.glob("./meta/*.json", { eager: true }) as Record<
  string,
  { default: PhotoMetadataGenerated }
>;

/**
 * Collection of all gallery photos with their metadata
 */
export const photos: GalleryImage[] = Object.keys(fullSizeImages).map((path) => {
  const name = path.split("/").pop()?.replace(".avif", "") || "";
  const metaGenerated = metadata[`./meta/${name}.json`]?.default;
  const metaCustom = photoMetadata[name];

  if (!metaCustom || !metaGenerated) {
    console.error(`Missing metadata for photo ${name}`, {
      metaCustom,
      metaGenerated,
    });
    throw new Error(`Missing metadata for photo ${name}`);
  }

  // Construct gallery image object combining custom metadata and generated metadata.
  return {
    src: fullSizeImages[path].default,
    thumbnail: thumbnails[`./thumbnails/${name}.avif`].default,
    alt: metaCustom.alt,
    caption: metaGenerated.ObjectName,
    date: new Date(metaGenerated.DateTimeOriginal),
    position: metaCustom.position,
    advancedMeta: {
      exposureTime: metaGenerated.ExposureTime,
      aperture: metaGenerated.FNumber,
      iso: metaGenerated.ISO,
      focalLength: metaGenerated.FocalLength,
      lensModel: metaGenerated.LensModel,
    },
  };
});
