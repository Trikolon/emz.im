import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import "./photo-info-panel";
import { classMap } from "lit/directives/class-map.js";
import { GalleryImage, LightboxImageChangeDetail } from "./types";

@customElement("lightbox-dialog")
export class LightboxDialog extends LitElement {
  @query("dialog")
  private dialog!: HTMLDialogElement;

  @property({ type: Array })
  images: GalleryImage[] = [];

  @property({ type: Number })
  currentIndex: number | null = null;

  @state()
  private showInfo = false;

  @state()
  private isLoading = true;

  @state()
  private showLoadingSpinner = false;

  // Gets the currently selected image based on currentIndex. This is the image
  // that will be displayed.
  private get currentImage(): GalleryImage | null {
    if (this.currentIndex == null) {
      return null;
    }
    return this.images[this.currentIndex];
  }

  static readonly styles = css`
    dialog {
      padding: 0;
      border: none;
      max-width: 95vw;
      max-height: 95vh;
      color: white;
      background: transparent;
    }

    dialog[open] {
      /* Keep dialog centered and sized consistently to avoid repositioning flash */
      width: 95vw;
      height: 95vh;
      /* Only apply this when the dialog is open, otherwise it will *always*
      render the dialog as we override the display property that's used for
      hiding it initially. */
      display: flex;
      align-items: center;
      justify-content: center;
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.8);
    }

    img {
      display: block;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      opacity: 0;
      transition: opacity 0.3s ease-out;
    }

    @media (prefers-reduced-motion: reduce) {
      img {
        transition: none;
      }
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
      display: none;
    }

    .loading-container.visible {
      display: block;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
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

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  private toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  private onCloseButtonClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this.dialog.close();
    }
  }

  private disablePageScroll() {
    document.body.style.overflow = "hidden";
  }

  private enablePageScroll() {
    document.body.style.overflow = "";
  }

  private onImageLoad() {
    this.isLoading = false;
    this.showLoadingSpinner = false;
  }

  /**
   * Handles keyboard navigation for the lightbox.
   * @param event - The keyboard event.
   */
  private handleKeydown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.showPreviousImage();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      this.showNextImage();
    }
  }

  /**
   * Shows the previous image in the lightbox.
   * Wraps around to the last image if at the beginning.
   */
  private showPreviousImage() {
    if (this.images.length === 0 || this.currentIndex == null) return;

    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImageFromIndex();
  }

  /**
   * Shows the next image in the lightbox.
   * Wraps around to the first image if at the end.
   */
  private showNextImage() {
    if (this.images.length === 0 || this.currentIndex == null) return;

    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImageFromIndex();
  }

  /**
   * Updates the displayed image based on the current index.
   */
  private updateImageFromIndex() {
    if (this.currentImage) {
      this.isLoading = true;
      this.showLoadingSpinner = false;

      // Only show loading spinner if loading takes more than 100ms
      setTimeout(() => {
        if (this.isLoading) {
          this.showLoadingSpinner = true;
        }
      }, 100);

      // Emit event when image changes
      this.dispatchEvent(
        new CustomEvent<LightboxImageChangeDetail>("image-changed", {
          detail: { image: this.currentImage, fromGalleryClick: false },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  show(fromGalleryClick: boolean = false) {
    this.isLoading = true;
    this.showLoadingSpinner = false;

    // Disable page scroll while the dialog is open.
    this.disablePageScroll();
    this.dialog.showModal();

    // Only show loading spinner if loading takes more than 100ms
    setTimeout(() => {
      if (this.isLoading) {
        this.showLoadingSpinner = true;
      }
    }, 100);

    // Emit event for initial image
    if (this.currentImage) {
      this.dispatchEvent(
        new CustomEvent<LightboxImageChangeDetail>("image-changed", {
          detail: { image: this.currentImage, fromGalleryClick },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /**
   * Renders the content of the currently displayed image.
   * @returns The HTML content for the image or null if no image is present.
   */
  private renderImageContent() {
    const image = this.currentImage;

    if (!image) {
      return null;
    }

    return html`
      <img
        src="${image.src}"
        alt="${image.alt}"
        title="${image.title}"
        @load="${this.onImageLoad}"
        class=${classMap({
          loaded: !this.isLoading,
        })}
      />
      <photo-info-panel
        .date="${image.date}"
        .advancedMeta="${image.advancedMeta}"
        ?show="${this.showInfo}"
      ></photo-info-panel>
    `;
  }

  render() {
    const image = this.currentImage;

    return html`
      <dialog
        @click="${this.onCloseButtonClick}"
        @close="${this.onDialogClose}"
        @keydown="${this.handleKeydown}"
        aria-label="Photo Lightbox: ${image?.title ?? "Photo"}"
      >
        <div class="controls">
          <button @click="${this.onCloseButtonClick}" title="Close">close</button>
          <button @click="${this.toggleInfo}" title="Show photo info">info</button>
        </div>
        <div
          class=${classMap({
            "loading-container": true,
            visible: !image || this.showLoadingSpinner,
          })}
        >
          <div class="loading-spinner"></div>
        </div>
        ${this.renderImageContent()}
      </dialog>
    `;
  }

  private onDialogClose() {
    this.showInfo = false;
    this.isLoading = false;
    this.showLoadingSpinner = false;
    this.enablePageScroll();

    // Clear src when closing so on next open we don't see the previous image.
    this.currentIndex = null;

    // When dialog is closed emit event with null image so that consumers know
    // we don't display anything.
    this.dispatchEvent(
      new CustomEvent<LightboxImageChangeDetail>("image-changed", {
        detail: { image: null, fromGalleryClick: false },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lightbox-dialog": LightboxDialog;
  }
}
