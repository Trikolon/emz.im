import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "./lightbox-dialog";
import { photos } from "./assets/photos";
import { GalleryImage } from "./types";

@customElement("photo-gallery")
export class PhotoGallery extends LitElement {
  private images: GalleryImage[] = photos;

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
      object-position: var(--image-position, center);
      border-radius: 4px;
    }

    .caption {
      padding: 0.5rem;
    }

    .caption h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      color: var(--heading-color);
    }

    .caption .date {
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
   * Combines the caption with the date if available
   *
   * @param image - The gallery image object
   * @returns The formatted title string
   */
  private getImageTitle(image: GalleryImage): string {
    if (image.date) {
      return `${image.caption} (${image.date.getFullYear()})`;
    }
    return image.caption;
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
    return html`<span class="date">${date.getFullYear()}</span>`;
  }

  /**
   * Handles opening the lightbox when an image is clicked
   */
  private handleImageClick(e: Event, image: GalleryImage) {
    e.preventDefault();
    const lightbox = this.renderRoot.querySelector("lightbox-dialog");
    if (lightbox) {
      lightbox.src = image.src;
      lightbox.alt = image.alt;
      lightbox.title = this.getImageTitle(image);
      lightbox.metadata = image.metadata;
      lightbox.show();
    }
  }

  /**
   * Renders a single gallery item with image and caption
   */
  private renderGalleryItem(image: GalleryImage) {
    return html`
      <div class="gallery-item">
        <a href="${image.src}" @click="${(e: Event) => this.handleImageClick(e, image)}">
          <img
            src="${image.thumbnail}"
            alt="${image.alt}"
            title="${this.getImageTitle(image)}"
            loading="lazy"
            decoding="async"
            width="300"
            height="300"
            style="${image.position ? `--image-position: ${image.position}` : ""}"
          />
        </a>
        <div class="caption">
          <h3>${image.caption}</h3>
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
    const sortedImages = [...this.images].sort(
      (a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0),
    );

    return html`
      <div class="gallery"> ${sortedImages.map((image) => this.renderGalleryItem(image))} </div>
      <lightbox-dialog></lightbox-dialog>
    `;
  }
}
