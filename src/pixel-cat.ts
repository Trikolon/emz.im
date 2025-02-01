import { LitElement, html, css } from "lit";
import { customElement, eventOptions, property } from "lit/decorators.js";

// Import GIF assets
import catCrouch from "./assets/pixel-cat/cat05_crouch_8fps.gif";
import catIdle from "./assets/pixel-cat/cat05_idle_8fps.gif";
import catIdleBlink from "./assets/pixel-cat/cat05_idle_blink_8fps.gif";
import catLieDown from "./assets/pixel-cat/cat05_liedown_8fps.gif";
import catSit from "./assets/pixel-cat/cat05_sit_8fps.gif";
import catSleep from "./assets/pixel-cat/cat05_sleep_8fps.gif";
import catSneak from "./assets/pixel-cat/cat05_sneak_8fps.gif";
import catWalk from "./assets/pixel-cat/cat05_walk_8fps.gif";

@customElement("pixel-cat")
export class PixelCat extends LitElement {
  @property({ type: Boolean, reflect: true }) hidden = false;
  @property({ type: Boolean, reflect: true }) sleeping = false;
  @property({ type: String, reflect: true }) currentAnimation = catSleep;

  private readonly ANIMATIONS: string[] = [
    catCrouch,
    catIdle,
    catIdleBlink,
    catLieDown,
    catSit,
    catSleep,
    catSneak,
    catWalk,
  ];

  private initialTimeout: number | null = null;
  private wakeUpTimeout: number | null = null;
  private animationInterval: number | null = null;

  // Cache for cat animations.
  private preloadedAnimations: HTMLImageElement[] = [];

  static readonly styles = css`
    :host {
      cursor: pointer;
    }

    :host([hidden]) {
      display: none;
    }

    img {
      display: block;
      width: 128px;
      height: auto;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      /* cursor: pointer; */
    }
  `;

  constructor() {
    super();
    this.sleeping = false;
    this.initialTimeout = null;
    this.wakeUpTimeout = null;
    this.animationInterval = null;
    this.currentAnimation = catSleep;
    this.hidden = false;
  }

  protected firstUpdated(): void {
    this.preloadAnimations();
    this.startAnimation();
  }

  render() {
    return html`
      <img
        src="${this.currentAnimation}"
        alt="Charlie the Cat"
        title="Dismiss Charlie the cat"
        @click=${this.dismiss}
        @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this.dismiss()}
        tabindex="0"
        role="button"
      />
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearAllTimers();

    // Clean up preloaded images
    this.preloadedAnimations.forEach((img) => {
      img.src = ""; // Clear the source
      img.remove(); // Remove from DOM if it was somehow added
    });
    this.preloadedAnimations = [];
  }

  private clearAllTimers(): void {
    if (this.initialTimeout) clearTimeout(this.initialTimeout);
    if (this.wakeUpTimeout) clearTimeout(this.wakeUpTimeout);
    if (this.animationInterval) clearInterval(this.animationInterval);
  }

  private preloadAnimations(): void {
    this.preloadedAnimations = this.ANIMATIONS.map((url) => {
      const img = new Image();
      img.src = url;
      return img;
    });
  }

  private updateCatAnimation(): void {
    const randomIndex = Math.floor(Math.random() * this.ANIMATIONS.length);
    // Use the preloaded image's src instead of the direct URL
    this.currentAnimation = this.preloadedAnimations[randomIndex].src;
  }

  @eventOptions({ passive: true })
  private dismiss(): void {
    this.hidden = true;
    this.clearAllTimers();
  }

  private get getRandomAnimationInterval(): number {
    return Math.random() * 12000 + 8000;
  }

  private get getRandomWakeTime(): number {
    return Math.random() * 2000 + 3000;
  }

  private startAnimation(): void {
    // Wake up after 3-5 seconds
    this.initialTimeout = window.setTimeout(() => {
      if (this.sleeping) {
        // If sleeping, just stay in sleep animation
        this.currentAnimation = catSleep;
        return;
      }

      // Show waking up animation
      this.currentAnimation = catLieDown;

      // Start random animations after a short delay
      this.wakeUpTimeout = window.setTimeout(() => {
        if (!this.sleeping) {
          this.updateCatAnimation();

          // Then change periodically (every 8-20 seconds)
          this.animationInterval = window.setInterval(() => {
            if (!this.sleeping) {
              this.updateCatAnimation();
            }
          }, this.getRandomAnimationInterval);
        }
      }, 3000);
    }, this.getRandomWakeTime);
  }
}
