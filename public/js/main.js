(() => {
  console.info(
    "%cNothing to see here, move on.",
    "font-size: 1.2em; font-style: italic; color: var(--text-color);",
  );

  // We hide the cat if reduced motion is preferred. That means we can skip the
  // whole logic.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Pixel Cat Logic

  const CAT_ASSETS_PATH = "img/cat";
  const ANIMATIONS = [
    "cat05_crouch_8fps.gif",
    "cat05_idle_8fps.gif",
    "cat05_idle_blink_8fps.gif",
    "cat05_liedown_8fps.gif",
    "cat05_sit_8fps.gif",
    "cat05_sleep_8fps.gif",
    "cat05_sneak_8fps.gif",
    "cat05_walk_8fps.gif",
  ];

  const pixelCat = document.querySelector(".pixel-cat");
  let initialTimeout;
  let wakeUpTimeout;
  let animationInterval;

  function updateCatAnimation() {
    const selectedAnimation = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
    pixelCat.src = `${CAT_ASSETS_PATH}/${selectedAnimation}`;
  }

  // Add click handler to make cat disappear
  pixelCat.addEventListener("click", () => {
    pixelCat.style.display = "none";
    // Clear all pending timeouts and intervals
    clearTimeout(initialTimeout);
    clearTimeout(wakeUpTimeout);
    clearInterval(animationInterval);
  });

  // Start with sleeping cat as specified in the HTML.
  // Wake up after 3-5 seconds
  initialTimeout = setTimeout(
    () => {
      // Show waking up animation
      pixelCat.src = `${CAT_ASSETS_PATH}/cat05_liedown_8fps.gif`;

      // Start random animations after a short delay
      wakeUpTimeout = setTimeout(() => {
        updateCatAnimation();

        // Then change periodically (every 8-20 seconds)
        animationInterval = setInterval(
          () => {
            updateCatAnimation();
          },
          Math.random() * 12000 + 8000,
        );
      }, 3000); // Wait 3 seconds after waking up before starting random animations
    },
    Math.random() * 2000 + 3000,
  );
})();
