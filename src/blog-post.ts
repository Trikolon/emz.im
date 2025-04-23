import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ReactiveController, ReactiveControllerHost } from "@lit/reactive-element";
import { TemplateResult } from "lit";

// Controller to rewrite external links to open in a new tab and apply security best practices.
class ExternalLinksController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & LitElement) {
    this.host = host;
    this.host.addController(this);
  }

  /**
   * Handle the initial slot change.
   */
  hostConnected(): void {
    this.handleSlotChange();
  }

  /**
   * Checks if a link's destination is same-origin with the current page.
   * @param href The href attribute of the link.
   * @returns {boolean} True if the link is external, false otherwise.
   */
  private isExternalLink(href: string): boolean {
    if (!href) return false;

    try {
      // Handle relative URLs that start with / or ./
      if (href.startsWith("/") || href.startsWith("./")) {
        return false;
      }

      // If it's a valid URL, check if it's external
      const url = new URL(href, window.location.origin);
      return url.origin !== window.location.origin;
    } catch {
      // If URL parsing fails, it's likely a relative path or anchor
      return false;
    }
  }

  /**
   * Rewrites external links when the slot changes.
   */
  handleSlotChange = (): void => {
    const slot = this.host.shadowRoot?.querySelector('slot[name="body"]') as HTMLSlotElement;
    if (slot) {
      slot.assignedElements().forEach((element) => {
        const links = element.querySelectorAll("a");
        Array.from(links)
          .filter((link) => {
            const href = link.getAttribute("href");
            return href && this.isExternalLink(href);
          })
          .forEach((link) => {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
          });
      });
    }
  };
}

@customElement("blog-post")
export class BlogPost extends LitElement {
  // Unique identifier for the post used for fragment links.
  @property({ type: String }) id = "";

  // Creation date of the post.
  @property({ type: String }) date = "";

  // Controller to rewrite external links to open in a new tab and apply security best practices.
  private readonly externalLinks: ExternalLinksController = new ExternalLinksController(this);

  static readonly styles = css`
    :host {
      margin-bottom: 2rem;
    }

    .blog-post {
      /* So the hash in front of the title doesn't overflow the viewport. */
      padding: 1rem;
    }

    .title {
      color: var(--heading-color);
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      position: relative;
    }

    .title a {
      color: inherit;
      text-decoration: none;
    }

    /* Add a hash in front of the title on hover to indicate that it's a
    fragment link */
    .title a::before {
      content: "#";
      position: absolute;
      left: -1em;
      color: var(--text-secondary);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    @media (prefers-reduced-motion: reduce) {
      .title a::before {
        transition: none;
      }
    }

    .title a:hover::before {
      opacity: 1;
    }

    .title a:hover {
      text-decoration: underline;
    }

    .date {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .body {
      color: var(--text-color);
      line-height: 1.6;
      text-align: justify;
      hyphens: auto;
      word-break: break-word;
    }

    .body ::slotted(a) {
      word-break: break-all;
      white-space: normal;
    }
  `;

  render(): TemplateResult {
    return html`
      <article class="blog-post">
        <h1 class="title">
          <a href="#${this.id}">
            <slot name="title"></slot>
          </a>
        </h1>
        <div class="date">${new Date(this.date).toLocaleDateString()}</div>
        <div class="body">
          <slot name="body" @slotchange=${this.externalLinks.handleSlotChange}></slot>
        </div>
      </article>
    `;
  }
}
