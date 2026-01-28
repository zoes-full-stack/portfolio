/* assets/js/skills-cards-tilt.js
   Skills cards tilt (GSAP quickSetter)
   - Mouse-follow tilt on desktop hover
   - Smooth easing + gentle parallax
   - Hydejack PJAX-safe (binds to #_pushState)
*/

(function () {
  function canTilt() {
    if (!window.gsap) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (!window.matchMedia("(hover: hover)").matches) return false;
    if (!window.matchMedia("(pointer: fine)").matches) return false;
    return true;
  }

  function initSkillCardTilt(root = document) {
    if (!canTilt()) return false;

    const cards = Array.from(root.querySelectorAll(".skill-card"));
    if (!cards.length) return false;

    cards.forEach((card) => {
      // prevent double-binding on the same element
      if (card.dataset.tiltBound === "1") return;
      card.dataset.tiltBound = "1";

      // Tunables
      const strength = 7;     // tilt degrees
      const parallax = 10;    // px shift
      const smoothing = 0.12; // 0..1 (higher = snappier)

      let r = null;
      let center = { x: 0, y: 0 };
      let target = { x: 0, y: 0 };
      let current = { x: 0, y: 0 };
      let rafId = null;

      const setRX = gsap.quickSetter(card, "rotateX", "deg");
      const setRY = gsap.quickSetter(card, "rotateY", "deg");
      const setX  = gsap.quickSetter(card, "x", "px");
      const setY  = gsap.quickSetter(card, "y", "px");

      function updateRect() {
        r = card.getBoundingClientRect();
        center.x = r.left + r.width / 2;
        center.y = r.top + r.height / 2;
      }

      function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
      }

      function setTargetFromEvent(e) {
        if (!r) updateRect();
        const dx = (e.clientX - center.x) / (r.width / 2);
        const dy = (e.clientY - center.y) / (r.height / 2);
        target.x = clamp(dx, -1, 1);
        target.y = clamp(dy, -1, 1);
      }

      function tick() {
        current.x += (target.x - current.x) * smoothing;
        current.y += (target.y - current.y) * smoothing;

        setRX(current.y * -strength);
        setRY(current.x *  strength);
        setX(current.x * parallax);
        setY(current.y * parallax);

        rafId = requestAnimationFrame(tick);
      }

      function enter(e) {
        updateRect();

        gsap.set(card, {
          willChange: "transform",
          transformPerspective: 900,
          transformStyle: "preserve-3d"
        });

        setTargetFromEvent(e);
        if (!rafId) rafId = requestAnimationFrame(tick);
      }

      function move(e) {
        setTargetFromEvent(e);
      }

      function leave() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;

        r = null;
        target.x = target.y = 0;
        current.x = current.y = 0;

        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          overwrite: true,
          onComplete: () => gsap.set(card, { willChange: "auto" })
        });
      }

      card.addEventListener("pointerenter", enter, { passive: true });
      card.addEventListener("pointermove", move, { passive: true });
      card.addEventListener("pointerleave", leave, { passive: true });

      window.addEventListener(
        "resize",
        () => { if (rafId) updateRect(); },
        { passive: true }
      );
    });

    return true;
  }

  // Boot that waits for:
  // 1) GSAP to exist
  // 2) skill cards to be present (PJAX inserts content after events sometimes)
  function boot(retries = 40) {
    if (!window.gsap) {
      if (retries <= 0) return;
      return setTimeout(() => boot(retries - 1), 60);
    }

    // Let layout settle for a frame or two (helps with PJAX injection timing)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ok = initSkillCardTilt(document);
        if (!ok && retries > 0) setTimeout(() => boot(retries - 1), 90);
      });
    });
  }

  function hookAllLoads(cb) {
    document.addEventListener("DOMContentLoaded", cb, { passive: true });
    window.addEventListener("load", cb, { passive: true });
    window.addEventListener("pageshow", cb, { passive: true });

    // Hydejack PJAX: bind to the element AND document (covers theme versions)
    const ps = document.getElementById("_pushState");
    if (ps) ps.addEventListener("hy-push-state-load", cb, { passive: true });
    document.addEventListener("hy-push-state-load", cb, { passive: true });

    // Turbo (if present)
    document.addEventListener("turbo:load", cb, { passive: true });
  }

  hookAllLoads(() => boot());
})();
