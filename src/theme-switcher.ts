import { LitElement, html, css } from "lit";
import { customElement, property, eventOptions } from "lit/decorators.js";

const THEMES = ["rose", "blue", "teal", "amber"];
const DEFAULT_THEME = "rose";

@customElement("theme-switcher")
export class ThemeSwitcher extends LitElement {
  @property({ type: Boolean }) expanded = false;
  @property({ type: String }) currentTheme = DEFAULT_THEME;

  private boundHandleOutsideClick = this.handleOutsideClick.bind(this);
  private boundHandleKeydown = this.handleKeydown.bind(this);
  private swatchColors = new Map<string, string>();

  static readonly styles = css`
    :host {
      display: block;
      z-index: 100;
    }

    .switcher {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    button {
      display: block;
      width: 16px;
      height: 16px;
      padding: 0;
      border: 2px solid transparent;
      cursor: pointer;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      transition: transform 0.1s ease;
    }

    button:hover {
      transform: scale(1.25);
    }

    .swatch {
      display: none;
    }

    :host([expanded]) .swatch {
      display: block;
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.currentTheme = localStorage.getItem("theme") ?? DEFAULT_THEME;
    this.readSwatchColors();
    // Ensure the active theme is applied (in case readSwatchColors disturbed it)
    document.documentElement.dataset.theme = this.currentTheme;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeOutsideListeners();
  }

  private readSwatchColors(): void {
    const root = document.documentElement;
    const savedTheme = root.dataset.theme;

    for (const theme of THEMES) {
      root.dataset.theme = theme;
      const accent = getComputedStyle(root).getPropertyValue("--accent").trim();
      this.swatchColors.set(theme, accent);
    }

    // Restore the active theme
    if (savedTheme) {
      root.dataset.theme = savedTheme;
    } else {
      delete root.dataset.theme;
    }
  }

  private addOutsideListeners(): void {
    document.addEventListener("click", this.boundHandleOutsideClick);
    document.addEventListener("keydown", this.boundHandleKeydown);
  }

  private removeOutsideListeners(): void {
    document.removeEventListener("click", this.boundHandleOutsideClick);
    document.removeEventListener("keydown", this.boundHandleKeydown);
  }

  private handleOutsideClick(e: MouseEvent): void {
    if (!this.contains(e.target as Node)) {
      this.collapse();
    }
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Escape") {
      this.collapse();
    }
  }

  @eventOptions({ passive: true })
  private toggleExpanded(): void {
    if (this.expanded) {
      this.collapse();
    } else {
      this.expanded = true;
      this.addOutsideListeners();
    }
  }

  private collapse(): void {
    this.expanded = false;
    this.removeOutsideListeners();
  }

  @eventOptions({ passive: true })
  private selectTheme(name: string): void {
    this.currentTheme = name;
    document.documentElement.dataset.theme = name;
    localStorage.setItem("theme", name);
    this.collapse();
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("expanded")) {
      if (this.expanded) {
        this.setAttribute("expanded", "");
      } else {
        this.removeAttribute("expanded");
      }
    }
  }

  render() {
    return html`
      <div class="switcher" role="group" aria-label="Theme color">
        <button
          @click=${() => this.toggleExpanded()}
          style="background-color: var(--accent)"
          aria-label="Change theme color"
          aria-expanded=${this.expanded}
        ></button>
        ${THEMES.filter((name) => name !== this.currentTheme).map(
          (name) => html`
            <button
              class="swatch"
              @click=${() => this.selectTheme(name)}
              style="background-color: ${this.swatchColors.get(name)}"
              aria-label="${name}"
            ></button>
          `,
        )}
      </div>
    `;
  }
}
