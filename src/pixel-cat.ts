import { LitElement, html, css } from "lit";

// Import GIF assets
import catCrouch from "./assets/pixel-cat/cat05_crouch_8fps.gif";
import catIdle from "./assets/pixel-cat/cat05_idle_8fps.gif";
import catIdleBlink from "./assets/pixel-cat/cat05_idle_blink_8fps.gif";
import catLieDown from "./assets/pixel-cat/cat05_liedown_8fps.gif";
import catSit from "./assets/pixel-cat/cat05_sit_8fps.gif";
import catSleep from "./assets/pixel-cat/cat05_sleep_8fps.gif";
import catSneak from "./assets/pixel-cat/cat05_sneak_8fps.gif";
import catWalk from "./assets/pixel-cat/cat05_walk_8fps.gif";

export class PixelCat extends LitElement {
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

  private sleeping: boolean;
  private initialTimeout: ReturnType<typeof setTimeout> | null = null;
  private wakeUpTimeout: ReturnType<typeof setTimeout> | null = null;
  private animationInterval: ReturnType<typeof setInterval> | null = null;
  private currentAnimation: string;
  public hidden: boolean;

  static properties = {
    hidden: { type: Boolean, reflect: true },
    sleeping: { type: Boolean, reflect: true },
    currentAnimation: { state: true },
  };

  static styles = css`
    :host([hidden]) {
      display: none;
    }

    img {
      display: block;
      width: 128px;
      height: auto;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      cursor: pointer;
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
    this.startAnimation();
  }

  render() {
    return html`
      <img
        src="${this.currentAnimation}"
        alt="Charlie the Cat"
        title="Dismiss Charlie the cat"
        @click=${this.dismiss}
      />
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearAllTimers();
  }

  private clearAllTimers(): void {
    if (this.initialTimeout) clearTimeout(this.initialTimeout);
    if (this.wakeUpTimeout) clearTimeout(this.wakeUpTimeout);
    if (this.animationInterval) clearInterval(this.animationInterval);
  }

  private updateCatAnimation(): void {
    const selectedAnimation = this.ANIMATIONS[Math.floor(Math.random() * this.ANIMATIONS.length)];
    this.currentAnimation = selectedAnimation;
  }

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

customElements.define("pixel-cat", PixelCat);
