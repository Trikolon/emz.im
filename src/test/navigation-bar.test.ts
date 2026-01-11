import { fixture, html } from "@open-wc/testing";
import { describe, it, expect, beforeEach } from "vitest";
import { NavigationBar } from "../navigation-bar";

describe("navigation-bar", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/blog");
  });

  it("registers the custom element", () => {
    expect(customElements.get("navigation-bar")).toBe(NavigationBar);
  });

  it("renders navigation items", async () => {
    const element = await fixture<NavigationBar>(html`<navigation-bar></navigation-bar>`);
    const links = element.shadowRoot?.querySelectorAll("a");
    expect(links?.length).toBe(3);

    const labels = Array.from(links ?? []).map((link) =>
      (link.textContent ?? "").replace(/\s+/g, " ").trim(),
    );
    expect(labels).toEqual(["[ Home ]", "[ Blog ]", "[ Photos ]"]);
  });

  it("marks the current path with aria-current", async () => {
    const element = await fixture<NavigationBar>(html`<navigation-bar></navigation-bar>`);
    const current = element.shadowRoot?.querySelector('a[href="/blog"]');
    const other = element.shadowRoot?.querySelector('a[href="/photos"]');

    expect(current?.getAttribute("aria-current")).toBe("page");
    expect(other?.getAttribute("aria-current")).toBe("false");
  });
});
