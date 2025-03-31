import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { html as helloWorldPost } from "./posts/hello-world.md";
import { html as anotherPost } from "./posts/another-post.md";

@customElement("blog-posts")
export class BlogPosts extends LitElement {
  static readonly styles = css``;

  render() {
    return html`
      <article> ${unsafeHTML(helloWorldPost)} </article>
      <hr />
      <article> ${unsafeHTML(anotherPost)} </article>
    `;
  }
}
