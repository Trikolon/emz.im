import { fixture, html, elementUpdated } from "@open-wc/testing";
import { describe, it, expect } from "vitest";
import { BlogPost } from "../blog-post";

describe("blog-post", () => {
  it("registers the custom element", () => {
    expect(customElements.get("blog-post")).toBe(BlogPost);
  });

  it("renders the title link and formatted date", async () => {
    const date = "2024-02-01";
    const element = await fixture<BlogPost>(html`
      <blog-post id="first-post" date="${date}">
        <span slot="title">Hello World</span>
        <div slot="body">Content</div>
      </blog-post>
    `);

    await elementUpdated(element);

    const titleLink = element.shadowRoot?.querySelector(".title a");
    const dateText = element.shadowRoot?.querySelector(".date")?.textContent?.trim();

    expect(titleLink?.getAttribute("href")).toBe("#first-post");
    expect(dateText).toBe(new Date(date).toLocaleDateString());
  });

  it("rewrites external links in the body slot", async () => {
    const element = await fixture<BlogPost>(html`
      <blog-post id="links" date="2024-02-01">
        <span slot="title">Links</span>
        <div slot="body">
          <a href="https://example.com">External</a>
          <a href="/photos">Internal</a>
        </div>
      </blog-post>
    `);

    await elementUpdated(element);

    const slot = element.shadowRoot?.querySelector('slot[name="body"]');
    if (!slot) {
      throw new Error("Missing body slot");
    }
    slot.dispatchEvent(new Event("slotchange"));

    const external = element.querySelector('a[href="https://example.com"]');
    const internal = element.querySelector('a[href="/photos"]');

    expect(external?.getAttribute("target")).toBe("_blank");
    expect(external?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(internal?.getAttribute("target")).toBeNull();
    expect(internal?.getAttribute("rel")).toBeNull();
  });
});
