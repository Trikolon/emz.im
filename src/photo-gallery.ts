import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
import "./lightbox-dialog";
import { photos } from "./assets/photos";
import { GalleryImage } from "./types";
import type { LightboxDialog } from "./lightbox-dialog";

@customElement("photo-gallery")
export class PhotoGallery extends LitElement {
  @query("lightbox-dialog")
  private lightbox!: LightboxDialog;

  // Sort images by date in descending order (newest first).
  private imagesSorted: GalleryImage[] = [...photos].sort(
    (a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0),
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
    this.lightbox.images = this.imagesSorted;
    this.lightbox.currentIndex = imageIndex;
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
      <lightbox-dialog></lightbox-dialog>
    `;
  }
}
