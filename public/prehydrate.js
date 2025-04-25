/**
 * Hide the page until:
 *   1. Every custom element present in the initial HTML is defined.
 *   2. Every Lit-based element present in the initial HTML has resolved its
 *      first `updateComplete`.
 *
 * Needs to be inserted early in the <head> section of the html file.
 */

(async () => {
  /* Insert a visibility gate that preserves layout but prevents paint */
  const style = document.createElement("style");
  style.textContent = "html.__prehydrate__ > body { visibility: hidden }";
  document.head.prepend(style);
  document.documentElement.classList.add("__prehydrate__");

  try {
    /* Step 1: wait until all custom-element tags in the initial DOM are defined */
    const initialCustomTags = [
      ...new Set(
        Array.from(document.querySelectorAll("*"))
          .map((el) => el.tagName.toLowerCase())
          .filter((name) => name.includes("-")),
      ),
    ];

    await Promise.all(initialCustomTags.map((tag) => customElements.whenDefined(tag)));

    /* Step 2: wait for first render of Lit elements present at this point */
    const initialLitElements = Array.from(
      document.querySelectorAll("*"),
    ).filter((el) => typeof el.updateComplete === "object");

    if (initialLitElements.length) {
      await Promise.allSettled(initialLitElements.map((el) => el.updateComplete));
    }
  } finally {
    /* Always reveal the page, even if a component throws */
    document.documentElement.classList.remove("__prehydrate__");
    style.remove();
  }
})();

export {};
