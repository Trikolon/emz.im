import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "./lightbox-dialog";

import reflections from "./assets/photos/reflections.avif";
import reflectionsMeta from "./assets/photos/reflections.json";
import montreal from "./assets/photos/montreal.avif";
import montrealMeta from "./assets/photos/montreal.json";
import asiaWok from "./assets/photos/asia-wok.avif";
import asiaWokMeta from "./assets/photos/asia-wok.json";
import shadesOfBlue from "./assets/photos/shades-of-blue.avif";
import shadesOfBlueMeta from "./assets/photos/shades-of-blue.json";
import surveillance from "./assets/photos/surveillance.avif";
import surveillanceMeta from "./assets/photos/surveillance.json";
import tempelhof from "./assets/photos/tempelhof.avif";
import tempelhofMeta from "./assets/photos/tempelhof.json";
import teufelsberg from "./assets/photos/teufelsberg.avif";
import teufelsbergMeta from "./assets/photos/teufelsberg.json";
import vancouver from "./assets/photos/vancouver.avif";
import vancouverMeta from "./assets/photos/vancouver.json";
import windows from "./assets/photos/windows.avif";
import windowsMeta from "./assets/photos/windows.json";
import vienna from "./assets/photos/vienna.avif";
import viennaMeta from "./assets/photos/vienna.json";
import mutedSky from "./assets/photos/muted-sky.avif";
import mutedSkyMeta from "./assets/photos/muted-sky.json";
import oulu from "./assets/photos/oulu.avif";
import ouluMeta from "./assets/photos/oulu.json";

interface PhotoMetadata {
  DateTimeOriginal: string;
  ExposureTime: number;
  FNumber: number;
  ISO: number;
  FocalLength: number;
  LensModel?: string;
}

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  date?: Date;
  position?: string;
  metadata?: PhotoMetadata;
}

@customElement("photo-gallery")
export class PhotoGallery extends LitElement {
  private images: GalleryImage[] = [
    {
      src: reflections,
      alt: "Reflection of bare trees on a calm water surface, with patches of snow visible along the edge.",
      caption: "Reflections",
      date: new Date(reflectionsMeta.DateTimeOriginal),
      metadata: reflectionsMeta,
    },
    {
      src: asiaWok,
      alt: 'A small Asian restaurant named "Asia Wok" with an illuminated sign, located on a dimly lit street corner at night.',
      caption: "Asia Wok",
      date: new Date(asiaWokMeta.DateTimeOriginal),
      metadata: asiaWokMeta,
    },
    {
      src: surveillance,
      alt: "Surveillance camera mounted on a structure, lit by a bright light. Bird spikes are visible near the camera. A dark screen is partially visible in the foreground. Ceiling with grid pattern overhead.",
      caption: "Surveillance",
      date: new Date(surveillanceMeta.DateTimeOriginal),
      metadata: surveillanceMeta,
    },
    {
      src: montreal,
      alt: "Foggy cityscape with modern high-rise buildings partially obscured by mist.",
      caption: "Montreal",
      date: new Date(montrealMeta.DateTimeOriginal),
      metadata: montrealMeta,
    },
    {
      src: shadesOfBlue,
      alt: "A vast ocean view with shades of turquoise water under a bright blue sky. A small sailboat is visible on the right horizon, and a few wispy clouds stretch across the sky.",
      caption: "Shades of Blue",
      date: new Date(shadesOfBlueMeta.DateTimeOriginal),
      metadata: shadesOfBlueMeta,
    },
    {
      src: vienna,
      alt: "A street view of a building featuring a shop with a metal shutter painted with a cartoonish bear-like creature. The sign above reads Juwelen, and the door and windows are adorned with graffiti. The sidewalk is made of stone tiles.",
      caption: "Vienna",
      date: new Date(viennaMeta.DateTimeOriginal),
      metadata: viennaMeta,
    },
    {
      src: vancouver,
      alt: "A cityscape featuring a tower with a circular observation deck displaying a Canadian flag. The tower is framed by modern high-rise buildings with reflective glass windows under a clear blue sky.",
      caption: "Vancouver",
      date: new Date(vancouverMeta.DateTimeOriginal),
      metadata: vancouverMeta,
    },
    {
      src: windows,
      alt: "A modern building with large reflective windows is angled against a bright blue sky with a few white clouds. The structure appears to be made of concrete or a similar material, showcasing a geometric design.",
      caption: "Windows",
      date: new Date(windowsMeta.DateTimeOriginal),
      metadata: windowsMeta,
    },
    {
      src: teufelsberg,
      alt: "Aerial view of a vast green forest under a partly cloudy sky. Sunlight streams through clouds, illuminating patches of the forest. Two geodesic dome structures are visible on a hill to the left. A distant body of water is seen on the horizon.",
      caption: "Teufelsberg",
      position: "left center",
      date: new Date(teufelsbergMeta.DateTimeOriginal),
      metadata: teufelsbergMeta,
    },
    {
      src: mutedSky,
      alt: "Dark gray storm clouds loom over a landscape with trees and a field. The trees are lush and green, contrasting with the dramatic sky, suggesting an impending storm.",
      caption: "Muted Sky",
      position: "center bottom",
      date: new Date(mutedSkyMeta.DateTimeOriginal),
      metadata: mutedSkyMeta,
    },
    {
      src: tempelhof,
      alt: "A vast field of golden grass under a clear blue sky as the sun sets. In the distance, a citys skyline is visible with various buildings and towers. The scene is peaceful and illuminated by warm, golden light.",
      caption: "Tempelhof",
      date: new Date(tempelhofMeta.DateTimeOriginal),
      metadata: tempelhofMeta,
    },
    {
      src: oulu,
      alt: "Upward view of a staircase leading to a small structure with a flagpole on top. The sky is clear and blue, and the perspective highlights the symmetry and linearity of the stairs and railings.",
      caption: "Oulu",
      date: new Date(ouluMeta.DateTimeOriginal),
      metadata: ouluMeta,
    },
  ];

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
            src="${image.src}"
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
