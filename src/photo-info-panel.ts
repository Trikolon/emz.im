import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AdvancedPhotoMetadata } from "./types";

@customElement("photo-info-panel")
export class PhotoInfoPanel extends LitElement {
  @property({ type: Object })
  date: Date | null = null;

  @property({ type: Object })
  advancedMeta: AdvancedPhotoMetadata = {};

  @property({ type: Boolean })
  show = false;

  static readonly styles = css`
    .info-panel {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.8);
      padding: 1rem;
      font-size: 0.875rem;
      transform: translateY(100%);
    }

    .info-panel.show {
      transform: translateY(0);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      color: #999;
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    .info-value {
      color: white;
    }
  `;

  private formatExposureTime(time?: number): string {
    if (!time) return "—";
    if (time >= 1) return `${time}s`;
    return `1/${Math.round(1 / time)}s`;
  }

  private formatFocalLength(length?: number): string {
    if (!length) return "—";
    return `${Math.round(length)}mm`;
  }

  private formatAperture(fNumber?: number): string {
    if (!fNumber) return "—";
    return `ƒ/${fNumber.toFixed(1)}`;
  }

  private formatDate(date: Date | null): string {
    if (!date) return "—";
    return date.toLocaleDateString();
  }

  render() {
    return html`
      <div class="info-panel ${this.show ? "show" : ""}">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Date</span>
            <span class="info-value"> ${this.formatDate(this.date)} </span>
          </div>
          <div class="info-item">
            <span class="info-label">Exposure</span>
            <span class="info-value">
              ${this.formatExposureTime(this.advancedMeta.exposureTime)}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Aperture</span>
            <span class="info-value">${this.formatAperture(this.advancedMeta.aperture)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">ISO</span>
            <span class="info-value">${this.advancedMeta.iso ?? "—"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Focal Length</span>
            <span class="info-value">
              ${this.formatFocalLength(this.advancedMeta.focalLength)}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Lens</span>
            <span class="info-value">${this.advancedMeta.lensModel ?? "—"}</span>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "photo-info-panel": PhotoInfoPanel;
  }
}
