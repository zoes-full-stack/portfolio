/* assets/js/scroll-top.js
   Scroll-to-top button (Hydejack/PJAX safe)
   - Builds button once
   - Shows only near bottom
   - Smooth scroll to top
*/
(() => {
  const SELECTOR = ".scroll-top";
  const NEAR_BOTTOM_PX = 600;

  function buildButton() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scroll-top";
    btn.setAttribute("aria-label", "Scroll to top");

    // Note: no dependency on IDs inside — safer if multiple instances exist
    btn.innerHTML = `
      <div class="scroll-top-center">
        <div class="scroll-top-round">
          <div class="scroll-top-arrow" aria-hidden="true">
            <span class="arrow primera"></span>
          </div>
        </div>
      </div>
    `.trim();

    document.body.appendChild(btn);
    return btn;
  }

  function getButton() {
    return document.querySelector(SELECTOR) || buildButton();
  }

  function isNearBottom(px = NEAR_BOTTOM_PX) {
    const y = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight || 0;
    const h = document.documentElement.scrollHeight || 0;
    return y + vh >= h - px;
  }

  let btn = null;
  let ticking = false;

  function update() {
    ticking = false;
    if (!btn || !btn.isConnected) return;

    const y = window.scrollY || window.pageYOffset || 0;
    const atTop = y <= 2;
    const nearBottom = isNearBottom(NEAR_BOTTOM_PX);

    // Visible ONLY near bottom and not at top
    btn.classList.toggle("is-visible", nearBottom && !atTop);

    // Optional state classes (keep if you use them in CSS)
    btn.classList.toggle("is-full", atTop);
    btn.classList.toggle("is-half", nearBottom);
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function bindOnce() {
    if (!btn || btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  function init() {
    btn = getButton();
    bindOnce();
    requestUpdate();
  }

  // ---------- Boot hooks (first load + PJAX) ----------
  function hookAllLoads(cb) {
    document.addEventListener("DOMContentLoaded", cb, { passive: true });
    window.addEventListener("load", cb, { passive: true });
    window.addEventListener("pageshow", cb, { passive: true });

    // Hydejack PJAX (most reliable)
    const ps = document.getElementById("_pushState");
    if (ps) ps.addEventListener("hy-push-state-load", cb, { passive: true });

    // Some Hydejack builds also dispatch on document
    document.addEventListener("hy-push-state-load", cb, { passive: true });

    // Turbo (if present)
    document.addEventListener("turbo:load", cb, { passive: true });

    // legacy fallbacks (harmless if never fired)
    window.addEventListener("pjax:end", cb, { passive: true });
    window.addEventListener("turbolinks:load", cb, { passive: true });
  }

  hookAllLoads(init);

  // One global listener (passive + RAF throttled)
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
})();
