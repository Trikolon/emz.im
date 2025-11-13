import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
import "./lightbox-dialog";
import { photos } from "./assets/photos";
import { buildPhotoRoute, extractPhotoIdFromPath } from "./photo-route";
import type { GalleryImage, LightboxImageChangeEvent } from "./types";
import type { LightboxDialog } from "./lightbox-dialog";

const APP_BASE_PATH = (import.meta.env.BASE_URL ?? "/") as string;

@customElement("photo-gallery")
export class PhotoGallery extends LitElement {
  @query("lightbox-dialog")
  private lightbox!: LightboxDialog;

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
    const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return html`<span class="date">${monthYear}</span>`;
  }

  /**
   * Handles opening the lightbox when an image is clicked.
   */
  private handleImageClick(e: Event, imageIndex: number) {
    e.preventDefault();
    this.lightbox.currentIndex = imageIndex;
    this.lightbox.show(true);
  }

  private setImageRoute(image: GalleryImage | null) {
    const targetPath = image ? this.buildPhotoHref(image.id) : this.buildPhotoHref();
    this.replaceHistoryPath(targetPath);
  }

  /**
   * Retrieves the image based on the current path (or legacy query parameter).
   * Side effect: If the image ID is invalid, resets the route.
   * @returns The image and its index, or null if not found.
   */
  private getImageFromRoute(): { image: GalleryImage; index: number } | null {
    const imageIdFromPath = extractPhotoIdFromPath(window.location.pathname, APP_BASE_PATH);
    const legacyImageId = this.getLegacyImageId();
    const imageId = imageIdFromPath ?? legacyImageId;
    if (!imageId) {
      return null;
    }

    const image = this.imageMap.get(imageId);
    if (!image) {
      // Invalid image id, reset route and return null.
      this.setImageRoute(null);
      return null;
    }

    // If the user visited an old query parameter link, rewrite it to the path
    // based format to keep URLs consistent.
    if (!imageIdFromPath && legacyImageId) {
      this.setImageRoute(image.image);
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

    // In the background scroll image into view in the gallery. Don't scroll if
    // the user clicked the image to open the lightbox as that can be confusing.
    if (image && !e.detail.fromGalleryClick) {
      this.scrollImageIntoView(image, true);
    }
  }

  /**
   * On first update init the lightbox dialog and show it if the URL has a photo
   * parameter.
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
        <a
          href="${this.buildPhotoHref(image.id)}"
          @click="${(e: Event) => this.handleImageClick(e, index)}"
        >
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

  private buildPhotoHref(imageId?: string) {
    return buildPhotoRoute(APP_BASE_PATH, imageId);
  }

  private getLegacyImageId(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  private replaceHistoryPath(targetPath: string) {
    const url = new URL(window.location.href);
    if (url.pathname === targetPath && !url.searchParams.has("id")) {
      return;
    }
    url.pathname = targetPath;
    url.searchParams.delete("id");
    window.history.replaceState({}, "", url.toString());
  }
}
