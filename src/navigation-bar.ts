import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Represents an item in the navigation bar.
 */
interface NavItem {
  path: string;
  label: string;
}

@customElement("navigation-bar")
export class NavigationBar extends LitElement {
  private readonly navItems: NavItem[] = [
    { path: "/", label: "Home" },
    { path: "/blog", label: "Blog" },
    { path: "/photos", label: "Photos" },
  ];

  static readonly styles = css`
    :host {
      background: var(--background-color);
    }

    nav {
      display: flex;
      justify-content: flex-start;
      gap: 0.5rem;
    }

    a {
      color: var(--text-color);
      text-decoration: none;
      font-weight: bold;
    }

    a:hover {
      text-decoration: underline;
    }

    a[aria-current="page"] {
      color: var(--text-secondary);
    }
  `;

  /**
   * Checks if the current path matches the given path.
   * @param path The path to check against.
   * @returns {boolean} True if the current path matches the given path, false otherwise.
   */
  private isCurrentPath(path: string): boolean {
    const currentPath = window.location.pathname;
    if (path === "/") {
      return currentPath === "/" || currentPath === "/index.html";
    }
    return currentPath === path || currentPath === `${path}.html`;
  }

  render() {
    return html`
      <nav aria-label="Main navigation">
        ${this.navItems.map(
          (item) => html`
            <a href="${item.path}" aria-current=${this.isCurrentPath(item.path) ? "page" : "false"}>
              [ ${item.label} ]
            </a>
          `,
        )}
      </nav>
    `;
  }
}
