(() => {
  const SELECTOR = ".scroll-top";
  const NEAR_BOTTOM_PX = 40;

  function buildButton() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scroll-top";
    btn.setAttribute("aria-label", "Scroll to top");

    btn.innerHTML = `
      <span class="scroll-top__arrow"></span>
      <span class="scroll-top__fill">
        <span class="scroll-wave delay"><span class="scroll-wave"></span></span>
      </span>
    `.trim();

    document.body.appendChild(btn);
    return btn;
  }

  function getButton() {
    return document.querySelector(SELECTOR) || buildButton();
  }

  function isNearBottom(px = NEAR_BOTTOM_PX) {
    const y = window.scrollY || window.pageYOffset;
    const vh = window.innerHeight;
    const h = document.documentElement.scrollHeight;
    return y + vh >= h - px;
  }

  let btn;
  let ticking = false;

  function update() {
    ticking = false;
    if (!btn) return;

    const atTop = (window.scrollY || window.pageYOffset) <= 2;
    const nearBottom = isNearBottom(NEAR_BOTTOM_PX);

    // visible ONLY near bottom and not at top
    btn.classList.toggle("is-visible", nearBottom && !atTop);

    // full at top (won't matter visually since hidden, but keeps state correct)
    btn.classList.toggle("is-full", atTop);

    // half at bottom
    btn.classList.toggle("is-half", nearBottom);
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function init() {
    btn = getButton();

    // avoid double-binding if init runs multiple times (PJAX)
    if (!btn.dataset.bound) {
      btn.dataset.bound = "true";

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    requestUpdate();
  }

  // Initial load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  // One global listener (passive + RAF throttled)
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });

  // Hydejack/PJAX safety: re-init after navigation swaps
  // - Works if Hydejack triggers these events; harmless otherwise.
  window.addEventListener("pjax:end", init);
  window.addEventListener("turbolinks:load", init);
})();
