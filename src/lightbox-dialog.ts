import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { PhotoMetadata } from "./types";
import "./photo-info-panel";

@customElement("lightbox-dialog")
export class LightboxDialog extends LitElement {
  @property({ type: String })
  src: string = "";

  @property({ type: String })
  alt: string = "";

  @property({ type: String })
  title: string = "";

  @property({ type: Object })
  metadata?: PhotoMetadata;

  @state()
  private showInfo = false;

  @state()
  private isLoading = true;

  @state()
  private showLoadingSpinner = false;

  static readonly styles = css`
    dialog {
      padding: 0;
      border: none;
      background: rgba(0, 0, 0, 0.9);
      max-width: 95vw;
      max-height: 95vh;
      color: white;
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.8);
    }

    img {
      display: block;
      max-width: 95vw;
      max-height: 95vh;
      object-fit: contain;
      opacity: 0;
      transition: opacity 0.3s ease-out;
    }

    img.loaded {
      opacity: 1;
    }

    .controls {
      position: fixed;
      flex-direction: column;
      top: 1rem;
      right: 1rem;
      display: flex;
      font-size: 1em !important;
      align-items: flex-end;
    }

    button {
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      padding: 0.5rem;
      z-index: 1000;
    }

    button:hover {
      opacity: 0.8;
    }

    .loading-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      opacity: 0;
      transition: opacity 0.2s;
    }

    @media (prefers-reduced-motion: reduce) {
      .loading-spinner {
        animation: none;
        /* Show a static indicator instead */
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-right-color: white;
      }
    }

    .loading-spinner.visible {
      opacity: 1;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  private toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  private handleClose() {
    const dialog = this.renderRoot.querySelector("dialog");
    if (dialog) {
      dialog.close();
      this.showInfo = false;
    }
  }

  private handleDialogClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      const dialog = e.currentTarget as HTMLDialogElement;
      dialog.close();
      this.showInfo = false;
    }
  }

  private handleImageLoad() {
    this.isLoading = false;
    this.showLoadingSpinner = false;
  }

  show() {
    const dialog = this.renderRoot.querySelector("dialog");
    if (dialog) {
      dialog.showModal();
      this.isLoading = true;
      this.showLoadingSpinner = false;

      // Only show loading spinner if loading takes more than 100ms
      setTimeout(() => {
        if (this.isLoading) {
          this.showLoadingSpinner = true;
        }
      }, 100);
    }
  }

  render() {
    return html`
      <dialog @click="${this.handleDialogClick}">
        <div class="controls">
          <button @click="${this.handleClose}" title="Close">close</button>
          <button @click="${this.toggleInfo}" title="Show photo info">info</button>
        </div>
        ${this.showLoadingSpinner
          ? html`
              <div class="loading-container">
                <div class="loading-spinner ${this.showLoadingSpinner ? "visible" : ""}"></div>
              </div>
            `
          : ""}
        <img
          src="${this.src}"
          alt="${this.alt}"
          title="${this.title}"
          @load="${this.handleImageLoad}"
          class="${this.isLoading ? "" : "loaded"}"
        />
        <photo-info-panel .metadata="${this.metadata}" ?show="${this.showInfo}"></photo-info-panel>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lightbox-dialog": LightboxDialog;
  }
}
