import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("lightbox-dialog")
export class LightboxDialog extends LitElement {
  @property({ type: String })
  src: string = "";

  @property({ type: String })
  alt: string = "";

  @property({ type: String })
  title: string = "";

  static readonly styles = css`
    dialog {
      padding: 0;
      border: none;
      background: rgba(0, 0, 0, 0.9);
      max-width: 95vw;
      max-height: 95vh;
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

    button {
      position: fixed;
      top: 1rem;
      right: 1rem;
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

  private handleClose() {
    const dialog = this.renderRoot.querySelector("dialog");
    if (dialog) {
      dialog.close();
    }
  }

  private handleDialogClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      const dialog = e.currentTarget as HTMLDialogElement;
      dialog.close();
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
        <button @click="${this.handleClose}">&times;</button>
        <img src="${this.src}" alt="${this.alt}" title="${this.title}" />
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lightbox-dialog": LightboxDialog;
  }
}
