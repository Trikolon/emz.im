import { fixture, html } from "@open-wc/testing";
import { describe, it, expect } from "vitest";
import { TextExpand } from "../text-expand";

describe("text-expand", () => {
  it("registers the custom element", () => {
    expect(customElements.get("text-expand")).toBe(TextExpand);
  });

  it("sets aria attributes and renders expanded text", async () => {
    const element = await fixture<TextExpand>(html`
      <text-expand .text=${"Hello"} .expandedText=${" world"}></text-expand>
    `);

    const container = element.shadowRoot?.querySelector(".container");
    const expanded = element.shadowRoot?.querySelector(".expanded-text");

    expect(container?.getAttribute("aria-label")).toBe("Hello world");
    expect(container?.getAttribute("role")).toBe("button");
    expect(expanded?.textContent).toBe(" world");
  });
});
