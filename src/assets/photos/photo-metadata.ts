/**
 * Custom metadata for photos that isn't part of the EXIF data we extract using
 * the script.
 */
export const photoMetadata: Record<string, { alt?: string; position?: string }> = {
  teufelsberg: {
    position: "left center",
  },
  "muted-sky": {
    position: "center bottom",
  },
};
