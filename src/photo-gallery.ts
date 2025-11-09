import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
import "./lightbox-dialog";
import { photos } from "./assets/photos";
import { GalleryImage } from "./types";
import type { LightboxDialog } from "./lightbox-dialog";

// URL parameter name for deep linking to specific images.
const IMAGE_URL_PARAM = "id";

@customElement("photo-gallery")
export class PhotoGallery extends LitElement {
  @query("lightbox-dialog")
  private lightbox!: LightboxDialog;

  // Sort images by date in descending order (newest first).
  private imagesSorted: GalleryImage[] = [...photos].sort(
    (a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0),
  );

  // Map of image ID to {image, index} for quick lookup. Derived from sorted
  // array to maintain consistency with the order used for lightbox indices.
  private imageMap: Map<string, { image: GalleryImage; index: number }> = new Map(
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
    this.lightbox.show();
  }

  /**
   * Sets the image ID in the URL parameters for deep linking.
   * @param image - The gallery image to set in the URL, or null to clear.
   */
  private setImageRoute(image: GalleryImage | null) {
    const url = new URL(window.location.href);
    if (image) {
      url.searchParams.set(IMAGE_URL_PARAM, image.id);
    } else {
      url.searchParams.delete(IMAGE_URL_PARAM);
    }
    window.history.replaceState({}, "", url.toString());
  }

  /**
   * Retrieves the image from the URL parameters.
   * Side effect: If the image ID is invalid, resets image param in the URL.
   * @returns The image and its index, or null if not found.
   */
  private getImageFromRoute(): { image: GalleryImage; index: number } | null {
    const urlParams = new URLSearchParams(window.location.search);
    const imageId = urlParams.get(IMAGE_URL_PARAM);
    if (!imageId) {
      return null;
    }
    // Found an image id. Look it up in the map.
    let image = this.imageMap.get(imageId);
    if (!image) {
      // Invalid image id, reset route and return null.
      this.setImageRoute(null);
      return null;
    }
    return image;
  }

  /**
   * Handles updates to the lightbox image and updates the URL accordingly.
   * @param e
   */
  private handleLightboxImageChanged(e: CustomEvent) {
    const image = e.detail.image as GalleryImage | null;
    this.setImageRoute(image);
  }

  /**
   * On first update init the lightbox dialog and show it if the URL has a photo
   * parameter.
   */
  async firstUpdated(): Promise<void> {
    // Ensure lightbox has the full image list.
    this.lightbox.images = this.imagesSorted;

    // Check if URL has an image parameter to open lightbox on load with a
    // specific image.
    const imageData = this.getImageFromRoute();
    if (!imageData) {
      return;
    }

    // Open lightbox at the specified image.
    this.lightbox.currentIndex = imageData.index;
    // The lightbox may not be ready yet. Wait for it to finish rendering
    // before calling show().
    await this.lightbox.updateComplete;
    this.lightbox.show();
  }

  /**
   * Renders a single gallery item with image and title
   */
  private renderGalleryItem(image: GalleryImage, index: number) {
    return html`
      <div class="gallery-item">
        <a href="${image.src}" @click="${(e: Event) => this.handleImageClick(e, index)}">
          <img
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
      <lightbox-dialog @image-changed="${this.handleLightboxImageChanged}"></lightbox-dialog>
    `;
  }
}
