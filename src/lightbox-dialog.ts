import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./photo-info-panel";

interface PhotoMetadata {
  DateTimeOriginal: string;
  ExposureTime: number;
  FNumber: number;
  ISO: number;
  FocalLength: number;
  LensModel?: string;
}

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

  show() {
    const dialog = this.renderRoot.querySelector("dialog");
    if (dialog) {
      dialog.showModal();
    }
  }

  render() {
    return html`
      <dialog @click="${this.handleDialogClick}">
        <div class="controls">
          <button @click="${this.handleClose}" title="Close">close</button>
          <button @click="${this.toggleInfo}" title="Show photo info">info</button>
        </div>
        <img src="${this.src}" alt="${this.alt}" title="${this.title}" />
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
