(() => {
  if (window.__LabsComingSoon) window.__LabsComingSoon.cleanup?.();

  const state = {
    tl: null,
    bubbles: [],
    cleanup: () => {},
    scheduled: false
  };

  function getViewport() {
    return { W: window.innerWidth, H: window.innerHeight };
  }

  function clearScene(canvas) {
    if (!canvas) return;
    canvas.querySelectorAll(".bubble").forEach((b) => b.remove());
    state.bubbles = [];
  }

  function resetScene(canvas) {
    if (!canvas) return;
    const beanSpeaker = canvas.querySelector("#beanSpeaker");
    if (beanSpeaker) {
      beanSpeaker.style.opacity = "";
      beanSpeaker.style.transform = "";
    }
    if (window.gsap) {
      try { gsap.set(beanSpeaker, { clearProps: "opacity,transform" }); } catch (_) {}
    }
  }

  function killTweens(canvas) {
    if (!window.gsap) return;
    if (state.tl) state.tl.kill();
    state.tl = null;
    
    const beanSpeaker = canvas?.querySelector("#beanSpeaker");
    if (beanSpeaker) gsap.killTweensOf(beanSpeaker);

    state.bubbles.forEach((b) => gsap.killTweensOf(b));
    resetScene(canvas);
  }

  function init() {
    const canvas = document.getElementById("oceanCanvas");
    if (!canvas) {
      state.cleanup?.();
      state.cleanup = () => {};
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const beanSpeaker = canvas.querySelector("#beanSpeaker");

    killTweens(canvas);
    clearScene(canvas);

    const hasGSAP = !!window.gsap && gsap.utils && gsap.timeline;
    if (!hasGSAP || reduceMotion) {
      resetScene(canvas);
      const { W, H } = getViewport();
      for (let i = 0; i < 60; i++) {
        const b = document.createElement("div");
        b.className = "bubble";
        const size = Math.random() * 6 + 2;
        b.style.width = `${size}px`;
        b.style.height = `${size}px`;
        b.style.left = `${Math.random() * W}px`;
        b.style.top = `${Math.random() * H}px`;
        b.style.opacity = (Math.random() * 0.45 + 0.25).toFixed(2);
        canvas.appendChild(b);
        state.bubbles.push(b);
      }
      state.cleanup = () => clearScene(canvas);
      return;
    }

    function makeBubbles(count = 150) {
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
      }
    }

    makeBubbles(150);
    resetScene(canvas);

    // 1. One-time entrance animation
    state.tl = gsap.timeline();
    state.tl.from(beanSpeaker, {
      duration: 1.2,
      opacity: 0,
      scale: 0.6,
      y: 25,
      ease: "back.out(1.5)",
      onComplete: () => {
        // 2. Start continuous floating loop seamlessly after entrance finishes
        gsap.to(beanSpeaker, {
          y: "-=10",
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });
      }
    });

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

  function scheduleInit() {
    if (state.scheduled) return;
    state.scheduled = true;

    requestAnimationFrame(() => {
      state.scheduled = false;
      if (!document.getElementById("oceanCanvas")) return;
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
