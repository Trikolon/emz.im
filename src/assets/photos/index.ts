import type { GalleryImage } from "../../types";
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
  /** Caption (a description field used for alt text) */
  Caption?: string;
}

// Import all full-size images, thumbnails, and metadata using glob imports
const fullSizeAvifImages: Record<string, { default: string }> = import.meta.glob(
  "./full-size/*.avif",
  {
    eager: true,
  },
);
const fullSizeWebpImages: Record<string, { default: string }> = import.meta.glob(
  "./full-size/*.webp",
  {
    eager: true,
  },
);
const thumbnailsAvif: Record<string, { default: string }> = import.meta.glob(
  "./thumbnails/*.avif",
  {
    eager: true,
  },
);
const thumbnailsWebp: Record<string, { default: string }> = import.meta.glob(
  "./thumbnails/*.webp",
  {
    eager: true,
  },
);
const metadata: Record<string, { default: PhotoMetadataGenerated }> = import.meta.glob(
  "./meta/*.json",
  { eager: true },
);

/**
 * Collection of all gallery photos with their metadata
 */
export const photos: GalleryImage[] = Object.keys(fullSizeAvifImages).map((path) => {
  const name = path.split("/").pop()?.replace(".avif", "") ?? "";
  const metaGenerated = metadata[`./meta/${name}.json`]?.default as
    | PhotoMetadataGenerated
    | undefined;
  const metaCustom = photoMetadata[name] ?? {};
  const fullSizeWebp = fullSizeWebpImages[`./full-size/${name}.webp`]?.default;
  const thumbnailWebp = thumbnailsWebp[`./thumbnails/${name}.webp`]?.default;

  if (!metaGenerated) {
    console.error(`Missing metadata for photo ${name}`, {
      metaCustom,
      metaGenerated,
    });
    throw new Error(`Missing metadata for photo ${name}`);
  }

  if (!fullSizeWebp || !thumbnailWebp) {
    console.error(`Missing WebP assets for photo ${name}`, {
      fullSizeWebp,
      thumbnailWebp,
    });
    throw new Error(`Missing WebP assets for photo ${name}`);
  }

  // Construct gallery image object combining custom metadata and generated metadata.
  return {
    id: name,
    src: {
      avif: fullSizeAvifImages[path].default,
      webp: fullSizeWebp,
    },
    thumbnail: {
      avif: thumbnailsAvif[`./thumbnails/${name}.avif`].default,
      webp: thumbnailWebp,
    },
    // For alt text use the "Caption" field of the metadata. This isn't ideal
    // but it's the field most suitable for an image description.
    // The alt text can also be overridden by setting "alt" in custom metadata.
    // If no caption is available, fall back to the title.
    alt: metaCustom.alt ?? metaGenerated.Caption ?? metaGenerated.ObjectName,
    title: metaGenerated.ObjectName,
    date: new Date(metaGenerated.DateTimeOriginal),
    advancedMeta: {
      exposureTime: metaGenerated.ExposureTime,
      aperture: metaGenerated.FNumber,
      iso: metaGenerated.ISO,
      focalLength: metaGenerated.FocalLength,
      lensModel: metaGenerated.LensModel,
    },
  };
});
