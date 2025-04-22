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
  // Creation date of the post.
  @property({ type: String }) date = "";

  // Controller to rewrite external links to open in a new tab and apply security best practices.
  private readonly externalLinks: ExternalLinksController = new ExternalLinksController(this);

  static readonly styles = css`
    :host {
      display: block;
      margin-bottom: 2rem;
    }

    .blog-post {
      max-width: 65ch;
      margin: 0 auto;
      padding: 1rem;
    }

    .title {
      color: var(--heading-color);
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
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
          <slot name="title"></slot>
        </h1>
        <div class="date">${new Date(this.date).toLocaleDateString()}</div>
        <div class="body">
          <slot name="body" @slotchange=${this.externalLinks.handleSlotChange}></slot>
        </div>
      </article>
    `;
  }
}
