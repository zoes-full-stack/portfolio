(() => {
  // Avoid multiple active instances across PJAX loads
  if (window.__LabsComingSoon) window.__LabsComingSoon.cleanup?.();

  const state = {
    tl: null,
    bubbles: [],
    cleanup: () => {},
    scheduled: false
  };

  function getViewport() {
    return {
      W: window.innerWidth,
      H: window.innerHeight
    };
}

  // --- tiny SplitText replacement (wrap each character) ---
  function splitToSpans(el) {
    if (!el) return [];
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

  function clearScene(canvas) {
    if (!canvas) return;
    canvas.querySelectorAll(".bubble").forEach((b) => b.remove());
    canvas.querySelectorAll(".lume").forEach((n) => n.remove());
    state.bubbles = [];
  }

  function resetText(canvas) {
    if (!canvas) return;

    const reefLetters = canvas.querySelectorAll(".reef-letter");
    const brandLine = canvas.querySelector("#brandLine");
    const soonLine = canvas.querySelector("#soonLine");

    // Ensure baseline visibility even if GSAP got killed mid-"from"
    reefLetters.forEach((el) => {
      el.style.opacity = "";
      el.style.transform = "";
      el.style.letterSpacing = "";
    });

    if (brandLine) {
      brandLine.style.opacity = "";
      brandLine.style.transform = "";
      brandLine.style.letterSpacing = "";
      brandLine.querySelectorAll(".char").forEach((c) => {
        c.style.opacity = "";
        c.style.transform = "";
        c.style.letterSpacing = "";
      });
    }

    if (soonLine) {
      soonLine.style.opacity = "";
      soonLine.style.transform = "";
      soonLine.style.letterSpacing = "";
      soonLine.querySelectorAll(".char").forEach((c) => {
        c.style.opacity = "";
        c.style.transform = "";
        c.style.letterSpacing = "";
      });
    }

    // If GSAP exists, also clear inline props it may have set
    if (window.gsap) {
      try {
        gsap.set([reefLetters, brandLine?.querySelectorAll(".char"), soonLine?.querySelectorAll(".char")], {
          clearProps: "opacity,transform,letterSpacing"
        });
      } catch (_) {}
    }
  }

  function killTweens(canvas) {
    if (!window.gsap) return;

    // Kill timeline
    if (state.tl) state.tl.kill();
    state.tl = null;

    // Kill bubble tweens
    state.bubbles.forEach((b) => gsap.killTweensOf(b));

    // Important: if we killed mid-animation, restore visibility
    resetText(canvas);
  }

  function init() {
    const canvas = document.getElementById("oceanCanvas");

    const canvasRect = canvas.getBoundingClientRect();

    if (!canvas) {
      state.cleanup = () => {};
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const streak = canvas.querySelector(".bubble-streak");
    const reefLetters = Array.from(canvas.querySelectorAll(".reef-letter"));
    const brandLine = canvas.querySelector("#brandLine");
    const soonLine = canvas.querySelector("#soonLine");

    const brandChars = splitToSpans(brandLine);
    const soonChars = splitToSpans(soonLine);

    // Cleanup any previous run
    killTweens(canvas);
    clearScene(canvas);

    // If GSAP isn't present OR reduced motion, render a static scene and exit
    const hasGSAP = !!window.gsap && gsap.utils && gsap.timeline;
    if (!hasGSAP || reduceMotion) {
      // Make sure text is visible in static mode
      resetText(canvas);

      // Static sprinkle
      // const rect = canvas.getBoundingClientRect();
      // const W = rect.width || 800;
      // const H = rect.height || 600;

      const { W, H } = getViewport();

      const bubbleCount = reduceMotion ? 60 : 90;
      for (let i = 0; i < bubbleCount; i++) {
        const b = document.createElement("div");
        b.className = "bubble";
        const size = Math.random() * 6 + 2;
        b.style.width = `${size}px`;
        b.style.height = `${size}px`;
        b.style.left = `${gsap.utils.random(-canvasRect.left, W - canvasRect.left)}px`;
        b.style.top  = `${gsap.utils.random(-canvasRect.top, H - canvasRect.top)}px`;
        b.style.opacity = (Math.random() * 0.45 + 0.25).toFixed(2);
        canvas.appendChild(b);
        state.bubbles.push(b);
      }

      // A few static “lumes”
      for (let i = 0; i < 10; i++) {
        const n = document.createElement("div");
        n.className = "lume";
        n.style.left = `${Math.random() * W}px`;
        n.style.top = `${(Math.random() * 0.8 + 0.15) * H}px`;
        n.style.opacity = (Math.random() * 0.4 + 0.25).toFixed(2);
        canvas.appendChild(n);
      }

      state.cleanup = () => clearScene(canvas);
      return;
    }

    // --- bubble field ---
    function makeBubbles(count = 200) {
      // const rect = canvas.getBoundingClientRect();
      // const W = rect.width || 800;
      // const H = rect.height || 600;

      const { W, H } = getViewport();

      for (let i = 0; i < count; i++) {
        const b = document.createElement("div");
        b.className = "bubble";

        const size = gsap.utils.random(2, 7);
        b.style.width = `${size}px`;
        b.style.height = `${size}px`;
        b.style.left = `${gsap.utils.random(0, W)}px`;
        b.style.top = `${gsap.utils.random(0, H)}px`;
        b.style.opacity = gsap.utils.random(0.18, 0.75);

        canvas.appendChild(b);
        state.bubbles.push(b);

        const dur = gsap.utils.random(7, 18);
        const drift = gsap.utils.random(-60, 60);

        gsap.to(b, {
          y: `-=${H + 140}`,
          x: `+=${drift}`,
          opacity: gsap.utils.random(0.06, 0.45),
          duration: dur,
          ease: "none",
          repeat: -1,
          delay: gsap.utils.random(0, dur),
          modifiers: {
            y: gsap.utils.unitize((v) => {
              const n = parseFloat(v);
              return n < -H ? n + H + 240 : n;
            })
          }
        });

        gsap.to(b, {
          scale: gsap.utils.random(0.25, 1.15),
          duration: gsap.utils.random(0.7, 1.6),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: gsap.utils.random(0, 2)
        });
      }
    }

    // --- biolume critters (few, transform-only) ---
    function makeLumes(count = 14) {
      const rect = canvas.getBoundingClientRect();
      const W = rect.width || 800;
      const H = rect.height || 600;

      for (let i = 0; i < count; i++) {
        const n = document.createElement("div");
        n.className = "lume";
        n.style.left = `${gsap.utils.random(0, W)}px`;
        n.style.top = `${gsap.utils.random(H * 0.15, H * 0.92)}px`;
        canvas.appendChild(n);

        const dur = gsap.utils.random(10, 18);

        gsap.to(n, { opacity: gsap.utils.random(0.35, 0.75), duration: 1.1, ease: "sine.out" });

        gsap.to(n, {
          x: `+=${gsap.utils.random(-90, 90)}`,
          y: `+=${gsap.utils.random(-60, 60)}`,
          rotation: `+=${gsap.utils.random(-35, 35)}`,
          duration: dur,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });

        gsap.to(n, {
          scale: gsap.utils.random(0.75, 1.25),
          duration: gsap.utils.random(1.4, 2.6),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      }
    }

    // --- shooting streak ---
    function shootingBubble() {
      if (!streak) return gsap.timeline();

      const rect = canvas.getBoundingClientRect();
      const W = rect.width || 800;

      gsap.set(streak, { x: W * 0.75, y: -180, scale: 0, opacity: 0 });

      return gsap.timeline()
        .to(streak, { duration: 0.9, opacity: 1, scale: 1, ease: "power2.out" })
        .to(streak, {
          duration: 1.2,
          x: `-=${W + 520}`,
          y: "+=820",
          opacity: 0,
          scale: 0,
          ease: "power2.in"
        }, "<");
    }

    // Build scene
    makeBubbles(200);
    makeLumes(14);

    // Ensure text is visible before animating "from"
    resetText(canvas);

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

    // Resize: rebuild scene cleanly
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => scheduleInit(), 200);
    };

    window.addEventListener("resize", onResize, { passive: true });

    state.cleanup = () => {
      window.removeEventListener("resize", onResize);
      killTweens(canvas);
      clearScene(canvas);
    };
  }

  // ✅ Batch multiple load events into a single init
  function scheduleInit() {
    if (state.scheduled) return;
    state.scheduled = true;

    requestAnimationFrame(() => {
      state.scheduled = false;
      init();
    });
  }

  function hookAllLoads(cb) {
    document.addEventListener("DOMContentLoaded", cb, { passive: true });
    window.addEventListener("load", cb, { passive: true });
    window.addEventListener("pageshow", cb, { passive: true });

    const ps = document.getElementById("_pushState");
    if (ps) ps.addEventListener("hy-push-state-load", cb, { passive: true });
    document.addEventListener("hy-push-state-load", cb, { passive: true });

    document.addEventListener("turbo:load", cb, { passive: true });
  }

  hookAllLoads(scheduleInit);

  window.__LabsComingSoon = {
    cleanup: () => state.cleanup()
  };
})();
