import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("blog-post")
export class BlogPost extends LitElement {
  // Creation date of the post.
  @property({ type: String }) date = "";

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

  render() {
    return html`
      <article class="blog-post">
        <h1 class="title">
          <slot name="title"></slot>
        </h1>
        <div class="date">${new Date(this.date).toLocaleDateString()}</div>
        <div class="body">
          <slot name="body"></slot>
        </div>
      </article>
    `;
  }
}
