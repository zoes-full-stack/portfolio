(() => {
  // Avoid multiple active instances across PJAX loads
  if (window.__LabsComingSoon) window.__LabsComingSoon.cleanup?.();

  const state = {
    tl: null,
    bubbles: [],
    cleanup: () => {}
  };

  function splitToSpans(el) {
    if (!el) return [];
    // If already split, reuse
    const existing = el.querySelectorAll(".char");
    if (existing && existing.length) return Array.from(existing);

    const text = el.textContent || "";
    el.textContent = "";
    const frag = document.createDocumentFragment();

    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      frag.appendChild(span);
    });

    el.appendChild(frag);
    return Array.from(el.querySelectorAll(".char"));
  }

  function clearBubbles(canvas) {
    if (!canvas) return;
    canvas.querySelectorAll(".bubble").forEach((b) => b.remove());
    state.bubbles = [];
  }

  function killTweens() {
    if (!window.gsap) return;
    if (state.tl) state.tl.kill();
    state.tl = null;

    // kill all bubble tweens too
    state.bubbles.forEach((b) => gsap.killTweensOf(b));
  }

  function init() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = document.getElementById("oceanCanvas");
    if (!canvas) {
      // Not on this page, do nothing, no errors
      state.cleanup = () => {};
      return;
    }

    // Mark bound to prevent duplicate listeners
    if (canvas.dataset.labsBound === "1") {
      // still refresh sizes safely on PJAX (rebuild)
    }
    canvas.dataset.labsBound = "1";

    const streak = canvas.querySelector(".bubble-streak");
    const reefLetters = Array.from(canvas.querySelectorAll(".reef-letter"));
    const brandLine = document.getElementById("brandLine");
    const soonLine = document.getElementById("soonLine");

    // Always split safely (prevents double splitting)
    const brandChars = splitToSpans(brandLine);
    const soonChars = splitToSpans(soonLine);

    // Cleanup any previous run
    killTweens();
    clearBubbles(canvas);

    // If GSAP isn't present, show a static pretty scene with a few bubbles and exit
    const hasGSAP = !!window.gsap && gsap.utils && gsap.timeline;
    if (!hasGSAP || reduceMotion) {
      // Static bubble sprinkle (no animation)
      const rect = canvas.getBoundingClientRect();
      const W = rect.width || 800;
      const H = rect.height || 500;

      const count = reduceMotion ? 60 : 90;
      for (let i = 0; i < count; i++) {
        const b = document.createElement("div");
        b.className = "bubble";
        const size = Math.random() * 6 + 2;
        b.style.width = `${size}px`;
        b.style.height = `${size}px`;
        b.style.left = `${Math.random() * W}px`;
        b.style.top = `${Math.random() * H}px`;
        b.style.opacity = (Math.random() * 0.5 + 0.2).toFixed(2);
        canvas.appendChild(b);
        state.bubbles.push(b);
      }

      state.cleanup = () => {
        clearBubbles(canvas);
      };
      return;
    }

    // --- bubble field (plankton) ---
    function makeBubbles(count = 220) {
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      for (let i = 0; i < count; i++) {
        const b = document.createElement("div");
        b.className = "bubble";

        const size = gsap.utils.random(2, 8);
        const x = gsap.utils.random(0, W);
        const y = gsap.utils.random(0, H);
        const o = gsap.utils.random(0.15, 0.9);

        b.style.width = `${size}px`;
        b.style.height = `${size}px`;
        b.style.left = `${x}px`;
        b.style.top = `${y}px`;
        b.style.opacity = o;

        canvas.appendChild(b);
        state.bubbles.push(b);

        const dur = gsap.utils.random(6, 16);
        const drift = gsap.utils.random(-60, 60);

        gsap.to(b, {
          y: `-=${H + 120}`,
          x: `+=${drift}`,
          opacity: gsap.utils.random(0.05, 0.5),
          duration: dur,
          ease: "none",
          repeat: -1,
          delay: gsap.utils.random(0, dur),
          modifiers: {
            y: gsap.utils.unitize((v) => {
              const n = parseFloat(v);
              return n < -H ? n + H + 220 : n;
            })
          }
        });

        gsap.to(b, {
          scale: gsap.utils.random(0.2, 1.2),
          duration: gsap.utils.random(0.6, 1.4),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: gsap.utils.random(0, 2)
        });
      }
    }

    // --- shooting bubble streak ---
    function shootingBubble() {
      if (!streak) return gsap.timeline(); // no-op if missing

      const rect = canvas.getBoundingClientRect();
      const W = rect.width || 800;

      gsap.set(streak, { x: W * 0.75, y: -180, scale: 0.0, opacity: 0 });

      return gsap.timeline()
        .to(streak, {
          duration: 0.9,
          opacity: 1,
          scale: 1,
          ease: "power2.out"
        })
        .to(streak, {
          duration: 1.2,
          x: `-=${W + 520}`,
          y: "+=820",
          opacity: 0,
          scale: 0,
          ease: "power2.in"
        }, "<");
    }

    // Build bubbles once
    makeBubbles(220);

    // Loop timeline
    const loop = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 3 });

    loop.addLabel("start")
      .from(reefLetters, {
        duration: 1.6,
        opacity: 0,
        y: 22,
        scale: 0.7,
        stagger: 0.12,
        ease: "back.out(1.7)"
      }, "start")
      .from(brandChars, {
        duration: 1.8,
        opacity: 0,
        y: 18,
        rotateY: 180,
        stagger: 0.03,
        transformOrigin: "50% 60%",
        ease: "elastic.out(1, 0.6)"
      }, "start+=0.5")
      .add(shootingBubble(), "start+=0.7")
      .from(soonChars, {
        duration: 1.2,
        opacity: 0,
        letterSpacing: 10,
        scale: 1.8,
        stagger: 0.02,
        ease: "back.out(1.4)"
      }, "start+=1.2");

    state.tl = loop;

    // Resize: rebuild bubbles + streak path without reloading
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        killTweens();
        clearBubbles(canvas);
        init(); // re-init cleanly
      }, 200);
    };

    window.addEventListener("resize", onResize, { passive: true });

    state.cleanup = () => {
      window.removeEventListener("resize", onResize);
      killTweens();
      clearBubbles(canvas);
    };
  }

  // Hydejack-safe load hooks
  function hookAllLoads(cb) {
    document.addEventListener("DOMContentLoaded", cb, { passive: true });
    window.addEventListener("load", cb, { passive: true });
    window.addEventListener("pageshow", cb, { passive: true });

    const ps = document.getElementById("_pushState");
    if (ps) ps.addEventListener("hy-push-state-load", cb, { passive: true });
    document.addEventListener("hy-push-state-load", cb, { passive: true });

    document.addEventListener("turbo:load", cb, { passive: true });
  }

  hookAllLoads(init);

  window.__LabsComingSoon = {
    cleanup: () => state.cleanup()
  };
})();
