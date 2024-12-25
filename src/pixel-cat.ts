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
  @property({ type: Number }) x = 0;
  @property({ type: Number }) y = 0;
  private movementInterval: number | null = null;
  private direction = 1; // 1 for right, -1 for left

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

  static readonly styles = css`
    :host([hidden]) {
      display: none;
    }

    :host {
      position: fixed;
      pointer-events: auto;
      z-index: 1000;
      transform: translate(var(--cat-x, 0), var(--cat-y, 0));
    }

    img {
      display: block;
      width: 128px;
      height: auto;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      cursor: pointer;
      transform: scaleX(var(--cat-direction, 1));
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
        @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this.dismiss()}
        tabindex="0"
        role="button"
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
    if (this.movementInterval) clearInterval(this.movementInterval);
  }

  private updateCatAnimation(): void {
    const selectedAnimation = this.ANIMATIONS[Math.floor(Math.random() * this.ANIMATIONS.length)];
    this.currentAnimation = selectedAnimation;
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

  private getRandomRestingAnimation(): string {
    const restingAnimations = [catSit, catLieDown, catIdle, catIdleBlink];
    return restingAnimations[Math.floor(Math.random() * restingAnimations.length)];
  }

  private startWalking(): void {
    if (this.sleeping || this.movementInterval) return;

    // Start with walking animation
    this.currentAnimation = catWalk;

    // Start movement
    this.movementInterval = window.setInterval(() => {
      if (!this.sleeping) {
        this.moveAround();
      }
    }, 50);

    // Walk for a short time (1-3 seconds)
    const walkDuration = Math.random() * 2000 + 1000;
    setTimeout(() => {
      // Stop movement first
      if (this.movementInterval) {
        clearInterval(this.movementInterval);
        this.movementInterval = null;
      }

      // Show transition animation (crouch) before resting
      this.currentAnimation = catCrouch;

      // Switch to resting animation after a short delay
      setTimeout(() => {
        this.currentAnimation = this.getRandomRestingAnimation();
      }, 500);
    }, walkDuration);
  }

  private moveAround(): void {
    if (this.sleeping) return;

    // Change position based on direction
    this.x += 2 * this.direction;

    // Check window boundaries and change direction if needed
    if (this.x > window.innerWidth - 128) {
      this.direction = -1;
      this.x = window.innerWidth - 128;
    } else if (this.x < 0) {
      this.direction = 1;
      this.x = 0;
    }

    // Update element position using CSS custom properties
    this.style.setProperty("--cat-x", `${this.x}px`);
    this.style.setProperty("--cat-y", `${this.y}px`);
    this.style.setProperty("--cat-direction", `${this.direction}`);
  }

  private startAnimation(): void {
    // Set initial position
    this.x = Math.random() * (window.innerWidth - 128);
    this.y = Math.random() * (window.innerHeight - 128);
    this.style.setProperty("--cat-x", `${this.x}px`);
    this.style.setProperty("--cat-y", `${this.y}px`);
    this.style.setProperty("--cat-direction", "1");

    // Wake up after 3-5 seconds
    this.initialTimeout = window.setTimeout(() => {
      if (this.sleeping) {
        this.currentAnimation = catSleep;
        return;
      }

      // Show waking up animation
      this.currentAnimation = catLieDown;

      // Start idle behavior after waking up
      this.wakeUpTimeout = window.setTimeout(() => {
        if (!this.sleeping) {
          this.currentAnimation = this.getRandomRestingAnimation();

          // Periodically decide what to do (every 4-10 seconds)
          this.animationInterval = window.setInterval(
            () => {
              if (!this.sleeping) {
                // 15% chance to start walking
                if (Math.random() < 0.15) {
                  this.startWalking();
                } else {
                  // Otherwise just change resting position
                  this.currentAnimation = this.getRandomRestingAnimation();
                }
              }
            },
            Math.random() * 6000 + 4000,
          );
        }
      }, 3000);
    }, this.getRandomWakeTime);
  }
}
