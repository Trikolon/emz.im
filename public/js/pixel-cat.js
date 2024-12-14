class PixelCat extends HTMLElement {
  static get observedAttributes() {
    return ["hidden", "sleeping"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create the template
    this.shadowRoot.innerHTML = `
        <style>
          :host[hidden] img {
            display: none !important;
          }

          img {
            display: block;
            width: 128px;
            height: auto;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
            cursor: pointer;
          }
  
          @media (prefers-reduced-motion: reduce) {
            :host {
              display: none;
            }
          }
        </style>
        <img alt="Charlie the Cat" title="Dismiss Charlie the cat">
      `;

    this.CAT_ASSETS_PATH = "img/cat";
    this.ANIMATIONS = [
      "cat05_crouch_8fps.gif",
      "cat05_idle_8fps.gif",
      "cat05_idle_blink_8fps.gif",
      "cat05_liedown_8fps.gif",
      "cat05_sit_8fps.gif",
      "cat05_sleep_8fps.gif",
      "cat05_sneak_8fps.gif",
      "cat05_walk_8fps.gif",
    ];

    this.img = this.shadowRoot.querySelector("img");
    this.initialTimeout = null;
    this.wakeUpTimeout = null;
    this.animationInterval = null;
  }

  get sleeping() {
    return this.hasAttribute("sleeping");
  }

  set sleeping(value) {
    if (value) {
      this.setAttribute("sleeping", "");
    } else {
      this.removeAttribute("sleeping");
    }
  }

  connectedCallback() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    this.img.addEventListener("click", () => this.dismiss());
    this.img.src = `${this.CAT_ASSETS_PATH}/cat05_sleep_8fps.gif`;

    if (!this.sleeping) {
      this.startAnimation();
    }
  }

  disconnectedCallback() {
    this.clearAllTimers();
  }

  clearAllTimers() {
    clearTimeout(this.initialTimeout);
    clearTimeout(this.wakeUpTimeout);
    clearInterval(this.animationInterval);
  }

  updateCatAnimation() {
    const selectedAnimation = this.ANIMATIONS[Math.floor(Math.random() * this.ANIMATIONS.length)];
    this.img.src = `${this.CAT_ASSETS_PATH}/${selectedAnimation}`;
  }

  dismiss() {
    this.hidden = true;
    this.clearAllTimers();
  }

  startAnimation() {
    // Wake up after 3-5 seconds
    this.initialTimeout = setTimeout(
      () => {
        // Show waking up animation
        this.img.src = `${this.CAT_ASSETS_PATH}/cat05_liedown_8fps.gif`;

        // Start random animations after a short delay
        this.wakeUpTimeout = setTimeout(() => {
          this.updateCatAnimation();

          // Then change periodically (every 8-20 seconds)
          this.animationInterval = setInterval(
            () => {
              this.updateCatAnimation();
            },
            Math.random() * 12000 + 8000,
          );
        }, 3000); // Wait 3 seconds after waking up before starting random animations
      },
      Math.random() * 2000 + 3000,
    );
  }
}

customElements.define("pixel-cat", PixelCat);
