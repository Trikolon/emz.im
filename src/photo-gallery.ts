import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import reflections from "./assets/photos/reflections.webp";
import montreal from "./assets/photos/montreal.webp";
import asiaWok from "./assets/photos/asia-wok.webp";
import shadesOfBlue from "./assets/photos/shades-of-blue.webp";
import surveillance from "./assets/photos/surveillance.webp";
import tempelhof from "./assets/photos/tempelhof.webp";
import teufelsberg from "./assets/photos/teufelsberg.webp";
import vancouver from "./assets/photos/vancouver.webp";
import windows from "./assets/photos/windows.webp";
import vienna from "./assets/photos/vienna.webp";
import mutedSky from "./assets/photos/muted-sky.webp";
import oulu from "./assets/photos/oulu.webp";

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  date?: Date;
}

@customElement("photo-gallery")
export class PhotoGallery extends LitElement {
  private images: GalleryImage[] = [
    {
      src: reflections,
      alt: "Reflection of bare trees on a calm water surface, with patches of snow visible along the edge.",
      caption: "Reflections",
      date: new Date("2025-01-01"),
    },
    {
      src: asiaWok,
      alt: 'A small Asian restaurant named "Asia Wok" with an illuminated sign, located on a dimly lit street corner at night.',
      caption: "Asia Wok",
      date: new Date("2024-01-01"),
    },
    {
      src: surveillance,
      alt: "Surveillance camera mounted on a structure, lit by a bright light. Bird spikes are visible near the camera. A dark screen is partially visible in the foreground. Ceiling with grid pattern overhead.",
      caption: "Surveillance",
      date: new Date("2024-01-01"),
    },
    {
      src: montreal,
      alt: "Foggy cityscape with modern high-rise buildings partially obscured by mist.",
      caption: "Montreal",
      date: new Date("2023-01-01"),
    },
    {
      src: shadesOfBlue,
      alt: "A vast ocean view with shades of turquoise water under a bright blue sky. A small sailboat is visible on the right horizon, and a few wispy clouds stretch across the sky.",
      caption: "Shades of Blue",
      date: new Date("2023-01-01"),
    },
    {
      src: vienna,
      alt: "A street view of a building featuring a shop with a metal shutter painted with a cartoonish bear-like creature. The sign above reads Juwelen, and the door and windows are adorned with graffiti. The sidewalk is made of stone tiles.",
      caption: "Vienna",
      date: new Date("2023-01-01"),
    },
    {
      src: vancouver,
      alt: "A cityscape featuring a tower with a circular observation deck displaying a Canadian flag. The tower is framed by modern high-rise buildings with reflective glass windows under a clear blue sky.",
      caption: "Vancouver",
      date: new Date("2022-01-01"),
    },
    {
      src: windows,
      alt: "A modern building with large reflective windows is angled against a bright blue sky with a few white clouds. The structure appears to be made of concrete or a similar material, showcasing a geometric design.",
      caption: "Windows",
      date: new Date("2022-01-01"),
    },
    {
      src: teufelsberg,
      alt: "Aerial view of a vast green forest under a partly cloudy sky. Sunlight streams through clouds, illuminating patches of the forest. Two geodesic dome structures are visible on a hill to the left. A distant body of water is seen on the horizon.",
      caption: "Teufelsberg",
      date: new Date("2021-01-01"),
    },
    {
      src: mutedSky,
      alt: "Dark gray storm clouds loom over a landscape with trees and a field. The trees are lush and green, contrasting with the dramatic sky, suggesting an impending storm.",
      caption: "Muted Sky",
      date: new Date("2021-01-01"),
    },
    {
      src: tempelhof,
      alt: "A vast field of golden grass under a clear blue sky as the sun sets. In the distance, a citys skyline is visible with various buildings and towers. The scene is peaceful and illuminated by warm, golden light.",
      caption: "Tempelhof",
      date: new Date("2019-01-01"),
    },
    {
      src: oulu,
      alt: "Upward view of a staircase leading to a small structure with a flagpole on top. The sky is clear and blue, and the perspective highlights the symmetry and linearity of the stairs and railings.",
      caption: "Oulu",
      date: new Date("2017-01-01"),
    },
  ];

  static readonly styles = css`
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

    .caption {
      padding: 0.5rem;
      color: var(--text-color);
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
   * Renders a single gallery item with image and caption
   *
   * @param image - The gallery image object to render
   * @returns Template for a gallery item
   */
  private renderGalleryItem(image: GalleryImage) {
    return html`
      <div class="gallery-item">
        <a href="${image.src}" target="_blank" rel="noopener">
          <img
            src="${image.src}"
            alt="${image.alt}"
            title="${this.getImageTitle(image)}"
            loading="lazy"
            decoding="async"
            width="300"
            height="300"
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
    `;
  }
}
