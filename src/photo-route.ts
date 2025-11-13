/**
 * Shared helpers for building and parsing photo routes.
 * These utilities are intentionally free of browser / DOM dependencies so they
 * can be reused in build tooling.
 */

export const PHOTO_ROUTE_SEGMENT = "photos";

/**
 * Builds the absolute path for the photo gallery or a specific photo.
 *
 * @param basePath - The application base path (e.g. Vite's BASE_URL).
 * @param photoId - Optional photo identifier.
 * @returns Absolute path beginning with a slash.
 */
export function buildPhotoRoute(basePath: string, photoId?: string): string {
  const normalizedBase = normalizeBasePath(basePath);
  const segments: string[] = [];

  if (normalizedBase) {
    segments.push(trimSlashes(normalizedBase));
  }

  segments.push(PHOTO_ROUTE_SEGMENT);

  if (photoId) {
    segments.push(encodeURIComponent(photoId));
  }

  return `/${segments.filter(Boolean).join("/")}`;
}

/**
 * Extracts the photo identifier from the current path if it matches the photo
 * route (`/photos/:id`).
 *
 * @param pathname - Current location pathname.
 * @param basePath - Application base path.
 * @returns The decoded photo id or null if not present.
 */
export function extractPhotoIdFromPath(pathname: string, basePath: string): string | null {
  let normalizedPath = removeBasePath(pathname, basePath);
  normalizedPath = normalizedPath.replace(/\/+$/, "");

  if (normalizedPath === `/${PHOTO_ROUTE_SEGMENT}`) {
    return null;
  }

  const parts = normalizedPath.split("/").filter(Boolean);
  if (parts[0] !== PHOTO_ROUTE_SEGMENT || parts.length < 2) {
    return null;
  }

  return decodeURIComponent(parts[1]);
}

/**
 * Determines whether a pathname should render the gallery entry page.
 * Matches `/photos` and `/photos/:id`.
 *
 * @param pathname - Incoming request pathname.
 * @param basePath - Application base path.
 */
export function isPhotoRoute(pathname: string, basePath: string): boolean {
  let normalizedPath = removeBasePath(pathname, basePath);
  normalizedPath = normalizedPath.replace(/\/+$/, "");

  if (normalizedPath === `/${PHOTO_ROUTE_SEGMENT}`) {
    return true;
  }

  const segments = normalizedPath.split("/").filter(Boolean);
  return segments.length === 2 && segments[0] === PHOTO_ROUTE_SEGMENT;
}

function normalizeBasePath(basePath: string): string {
  if (!basePath || basePath === "/") {
    return "";
  }
  let value = basePath;
  if (!value.startsWith("/")) {
    value = `/${value}`;
  }
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function removeBasePath(pathname: string, basePath: string): string {
  const normalizedBase = normalizeBasePath(basePath);
  if (normalizedBase && pathname.startsWith(normalizedBase)) {
    const remainder = pathname.slice(normalizedBase.length);
    return remainder.startsWith("/") ? remainder : `/${remainder}`;
  }
  return pathname;
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}
