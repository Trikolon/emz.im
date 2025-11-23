import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
import "./lightbox-dialog";
import { photos } from "./assets/photos";
import type { GalleryImage, LightboxImageChangeEvent } from "./types";
import type { LightboxDialog } from "./lightbox-dialog";

const PHOTOS_PATH_SEGMENT = "/photos";

@customElement("photo-gallery")
export class PhotoGallery extends LitElement {
  @query("lightbox-dialog")
  private lightbox!: LightboxDialog;

  private defaultPageTitle = document.title;

  // Check user's motion preference.
  private prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sort images by date in descending order (newest first).
  private imagesSorted: GalleryImage[] = [...photos].sort(
    (a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0),
  );

  // Map of image ID to {image, index} for quick lookup. Derived from sorted
  // array to maintain consistency with the order used for lightbox indices.
  private imageMap = new Map<string, { image: GalleryImage; index: number }>(
    this.imagesSorted.map((img, index) => [img.id, { image: img, index }]),
  );

  /**
   * Determines the base URL path segment that hosts the gallery page.
   * Accounts for deployments where the site might serve under a subdirectory.
   * @returns The gallery base path.
   */
  private getGalleryBasePath(): string {
    const { pathname } = window.location;
    const photosIndex = pathname.indexOf(PHOTOS_PATH_SEGMENT);

    if (photosIndex === -1) {
      const normalized = pathname.replace(/\/+$/, "");
      return normalized || "/";
    }

    return pathname.slice(0, photosIndex + PHOTOS_PATH_SEGMENT.length);
  }

  /**
   * Builds a normalized path for an image slug relative to the gallery base path.
   * @param imageId - Optional image identifier to append to the path.
   * @returns The constructed image path.
   */
  private buildImagePath(imageId?: string | null): string {
    const basePath = this.getGalleryBasePath();
    if (!imageId) {
      return basePath.endsWith("/") && basePath !== "/" ? basePath.slice(0, -1) : basePath;
    }

    const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
    return `${normalizedBase}/${encodeURIComponent(imageId)}/`;
  }

  /**
   * Extracts a photo ID slug from the window location path if present.
   * @returns The decoded photo ID or null when none exists.
   */
  private getImageIdFromPath(): string | null {
    const { pathname } = window.location;
    const photosIndex = pathname.indexOf(PHOTOS_PATH_SEGMENT);
    if (photosIndex === -1) {
      return null;
    }

    const remainder = pathname.slice(photosIndex + PHOTOS_PATH_SEGMENT.length);
    const slug = remainder.split("/").find((segment) => Boolean(segment));
    if (!slug) {
      return null;
    }

    try {
      return decodeURIComponent(slug);
    } catch {
      return null;
    }
  }

  static readonly styles = css`
    /* Use the same link styling as the rest of the site */
    a {
      color: var(--link-color);
    }

    a:hover,
    a:focus {
      color: var(--link-color-hover);
    }

    .gallery {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      padding: 1rem;
    }

    .gallery-item {
      flex: 0 0 300px;
      height: 400px;
      display: flex;
      flex-direction: column;
    }

    .gallery-item a {
      display: block;
      height: 300px;
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

    .title {
      padding: 0.5rem;
    }

    .title h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      color: var(--heading-color);
    }

    .title .date {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    @media (prefers-reduced-motion: no-preference) {
      .gallery-item img {
        transition: transform 0.2s ease;
      }

      .gallery-item img:hover {
        transform: scale(1.03);
      }
    }
  `;

  /**
   * Generates a title string for the image tooltip
   * Combines the title with the date if available
   *
   * @param image - The gallery image object
   * @returns The formatted title string
   */
  private getImageTitle(image: GalleryImage): string {
    if (image.date) {
      return `${image.title} (${image.date.getFullYear()})`;
    }
    return image.title;
  }

  /**
   * Renders the date element if a date is provided
   *
   * @param date - Optional date object
   * @returns Date element template or null if no date
   */
  private renderDate(date?: Date) {
    if (!date) {
      return null;
    }
    // Short month and year for display.
    const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    // Date to show on hover.
    const titleDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      year: "numeric",
    });

    return html`<span title="${titleDate}" class="date">${monthYear}</span>`;
  }

  /**
   * Handles opening the lightbox when an image is clicked.
   */
  private handleImageClick(e: Event, imageIndex: number) {
    e.preventDefault();
    this.lightbox.currentIndex = imageIndex;
    this.lightbox.show(true);
  }

  /**
   * Updates the browser path to reflect the current image selection.
   * @param image - The gallery image to set in the URL, or null to clear.
   */
  private setImageRoute(image: GalleryImage | null) {
    const url = new URL(window.location.href);
    url.pathname = this.buildImagePath(image?.id);
    window.history.replaceState({}, "", url.toString());
  }

  /**
   * Updates the document title based on the active image or resets it.
   * @param image - The gallery image shown in the lightbox.
   */
  private setPageTitle(image: GalleryImage | null) {
    if (image) {
      document.title = `${image.title} – ${this.defaultPageTitle}`;
      return;
    }
    document.title = this.defaultPageTitle;
  }

  /**
   * Retrieves the image from the URL path.
   * Side effect: If the image ID is invalid, resets the path to the gallery root.
   * @returns The image and its index, or null if not found.
   */
  private getImageFromRoute(): { image: GalleryImage; index: number } | null {
    const imageId = this.getImageIdFromPath();
    if (!imageId) {
      return null;
    }
    // Found an image id. Look it up in the map.
    const image = this.imageMap.get(imageId);
    if (!image) {
      // Invalid image id, reset route and return null.
      this.setImageRoute(null);
      return null;
    }
    return image;
  }

  /**
   * Scrolls the specified image into view within the gallery.
   * @param image - The gallery image to scroll into view.
   * @param preferSmooth - Whether to prefer smooth scrolling.
   * Will ignore if prefersReducedMotion is true.
   */
  private scrollImageIntoView(image: GalleryImage, preferSmooth: boolean) {
    const imgElement = this.renderRoot.querySelector(`#${image.id}`);
    if (!imgElement) {
      return;
    }

    let behavior: ScrollBehavior;
    if (this.prefersReducedMotion) {
      behavior = "auto";
    } else {
      behavior = preferSmooth ? "smooth" : "auto";
    }

    imgElement.scrollIntoView({
      behavior,
      block: "center",
    });
  }

  /**
   * Handles updates to the lightbox image and updates the URL accordingly.
   * @param e
   */
  private handleLightboxImageChanged(e: LightboxImageChangeEvent) {
    const image = e.detail.image;
    this.setImageRoute(image);
    this.setPageTitle(image);

    // In the background scroll image into view in the gallery. Don't scroll if
    // the user clicked the image to open the lightbox as that can be confusing.
    if (image && !e.detail.fromGalleryClick) {
      this.scrollImageIntoView(image, true);
    }
  }

  /**
   * On first update init the lightbox dialog and show it if the URL has a photo
   * slug in the path.
   */
  firstUpdated(): void {
    // Ensure lightbox has the full image list.
    this.lightbox.images = this.imagesSorted;

    // Check if URL has an image parameter to open lightbox on load with a
    // specific image.
    const imageData = this.getImageFromRoute();
    if (!imageData) {
      return;
    }

    // Scroll to image in the gallery.
    this.scrollImageIntoView(imageData.image, false);

    // Open lightbox at the specified image.
    this.lightbox.currentIndex = imageData.index;
    // The lightbox may not be ready yet. Wait for it to finish rendering
    // before calling show().
    void this.lightbox.updateComplete.then(() => {
      this.lightbox.show();
    });
  }

  /**
   * Renders a single gallery item with image and title
   */
  private renderGalleryItem(image: GalleryImage, index: number) {
    return html`
      <div class="gallery-item">
        <a href="${image.src}" @click="${(e: Event) => this.handleImageClick(e, index)}">
          <img
            id="${image.id}"
            src="${image.thumbnail}"
            alt="${image.alt}"
            title="${this.getImageTitle(image)}"
            loading="lazy"
            decoding="async"
            width="300"
            height="300"
          />
        </a>
        <div class="title">
          <h3>${image.title}</h3>
          ${this.renderDate(image.date)}
        </div>
      </div>
    `;
  }

  /**
   * Renders the complete photo gallery
   * Maps through all sorted images and renders each as a gallery item
   *
   * @returns Template for the full gallery
   */
  render() {
    return html`
      <div class="gallery">
        ${this.imagesSorted.map((image, index) => this.renderGalleryItem(image, index))}
      </div>
      <lightbox-dialog
        @image-changed="${(e: LightboxImageChangeEvent) => this.handleLightboxImageChanged(e)}"
      ></lightbox-dialog>
    `;
  }
}
