/**
 * About Bean Scrollytelling (Pinned Deck Window)
 * - Pins the whole #aboutStory while you scroll through cards
 * - Left side behaves like a deck (one card visible at a time)
 * - Bean reacts per card
 * - Hydejack-safe: re-init on hy-push-state-load (PJAX)
 *
 * REQUIREMENTS (load BEFORE this file):
 *   gsap.min.js
 *   ScrollTrigger.min.js
 */

(() => {
  const DEBUG = false;
  let _cleanup = () => {};

  function initAboutDeck() {
    const story = document.querySelector("#aboutStory");
    if (!story) return;

    // Only for deck variant
    if (!story.classList.contains("about-story--deck")) return;

    // Mobile: keep normal scroll layout (CSS should de-stack cards)
    if (window.matchMedia("(max-width: 900px)").matches) {
      story.classList.remove("deck-ready");
      _cleanup();
      return;
    }

    // Avoid double init (Hydejack PJAX)
    _cleanup();

    if (!window.gsap || !window.ScrollTrigger) {
      console.warn("[about] Missing GSAP or ScrollTrigger. Add ScrollTrigger.min.js before this file.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const bean = document.querySelector("#magical-about-bean");
    const bg = document.querySelector("#magical-about-bean-container");
    const content = story.querySelector(".about-story__content");
    const steps = Array.from(story.querySelectorAll(".about-step"));

    if (!bean || !bg || !content || !steps.length) {
      if (DEBUG) console.warn("[about] Missing required elements", { bean, bg, content, steps: steps.length });
      return;
    }

    // -----------------------------------------
    // Helpers
    // -----------------------------------------
    const smile = bean.querySelector("#smile");
    const bubbles = bean.querySelectorAll(".about-bean-bubbles .bb");
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Blush hook style (only once)
    if (!document.querySelector("style[data-about-bean-blush]")) {
      const style = document.createElement("style");
      style.setAttribute("data-about-bean-blush", "true");
      style.textContent = `
        #magical-about-bean #smile.is-blush::before,
        #magical-about-bean #smile.is-blush::after{
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `;
      document.head.appendChild(style);
    }

    const setBlush = (on) => smile && smile.classList.toggle("is-blush", !!on);

    const killTweens = () => {
      gsap.killTweensOf(bean);
      gsap.killTweensOf(bg);
      bubbles.forEach((b) => gsap.killTweensOf(b));
    };

    const go = (vars) => gsap.to(bean, { overwrite: "auto", ...vars });
    const goBg = (vars) => gsap.to(bg, { overwrite: "auto", ...vars });

    // -----------------------------------------
    // Bean states
    // -----------------------------------------
    const STATES = {
      intro() {
        killTweens();
        go({
          duration: 0.45,
          backgroundColor: "#beecf4",
          "--bean-rot": "0deg",
          "--bean-scale": 1,
          "--armL-rot": "12deg",
          "--armR-rot": "-12deg",
          "--armL-y": "0px",
          "--armR-y": "0px",
          ease: "power2.out"
        });
        goBg({ duration: 0.45, backgroundColor: "transparent", ease: "power2.out" });
        setBlush(true);
      },

      mission() {
        killTweens();
        go({
          duration: 0.5,
          "--armL-rot": "-38deg",
          "--armR-rot": "38deg",
          "--armL-y": "-18px",
          "--armR-y": "-18px",
          "--bean-rot": "0deg",
          "--bean-scale": 1.02,
          ease: "power2.out"
        });
        goBg({ duration: 0.5, backgroundColor: "rgba(255,255,255,.12)", ease: "power2.out" });
        setBlush(false);
      },

      curiosities() {
        killTweens();
        go({
          duration: 0.5,
          "--bean-rot": "-7deg",
          "--bean-scale": 1,
          "--armL-rot": "10deg",
          "--armR-rot": "-10deg",
          "--armL-y": "0px",
          "--armR-y": "0px",
          ease: "power2.out"
        });
        goBg({ duration: 0.5, backgroundColor: "transparent", ease: "power2.out" });
        setBlush(false);
      },

      work() {
        killTweens();
        go({
          duration: 0.5,
          "--bean-rot": "0deg",
          "--bean-scale": 1.01,
          "--armL-rot": "14deg",
          "--armR-rot": "-14deg",
          "--armL-y": "0px",
          "--armR-y": "0px",
          backgroundColor: "#beecf4",
          ease: "power2.out"
        });
        goBg({ duration: 0.5, backgroundColor: "transparent", ease: "power2.out" });
        setBlush(false);
      },

      cta() {
        killTweens();
        go({
          duration: 0.35,
          backgroundColor: "#ffb04c",
          "--bean-scale": 1.06,
          "--bean-rot": "0deg",
          "--armL-rot": "-18deg",
          "--armR-rot": "18deg",
          "--armL-y": "-10px",
          "--armR-y": "-10px",
          ease: "power2.out"
        });
        goBg({ duration: 0.35, backgroundColor: "rgba(245,233,183,.55)", ease: "power2.out" });
        setBlush(false);

        if (prefersReduce) return;

        gsap.fromTo(bean, { y: 0 }, { y: -8, duration: 0.18, yoyo: true, repeat: 3, ease: "power1.inOut" });

        bubbles.forEach((b, i) => {
          gsap.fromTo(
            b,
            { opacity: 0, y: 12, scale: 0.9 },
            {
              opacity: 1,
              y: -34,
              scale: 1.15,
              duration: 0.7,
              delay: i * 0.05,
              ease: "power2.out",
              onComplete: () => gsap.set(b, { opacity: 0, y: 12, scale: 0.9 })
            }
          );
        });
      }
    };

    // -----------------------------------------
    // Measure + enable deck mode
    // (Measure BEFORE stacking, while cards are in normal flow)
    // -----------------------------------------
    // Ensure "not deck-ready" layout for accurate measuring
    story.classList.remove("deck-ready");
    steps.forEach((s) => s.classList.remove("is-active"));

    const measureMaxHeight = () => {
      // Cards are relative here, so scrollHeight is trustworthy
      const maxH = Math.max(...steps.map((s) => s.scrollHeight), 320);
      content.style.minHeight = Math.max(maxH + 24, 360) + "px";
    };

    measureMaxHeight();

    // Now stack them (CSS should switch to absolute)
    story.classList.add("deck-ready");

    // -----------------------------------------
    // Active card switching
    // -----------------------------------------
    let activeIndex = -1;

    const showStep = (i, direction = 1) => {
      i = Math.max(0, Math.min(steps.length - 1, i));
      if (i === activeIndex) return;

      const prev = steps[activeIndex];
      const next = steps[i];
      activeIndex = i;

      // update classes
      steps.forEach((s) => s.classList.remove("is-active"));
      next.classList.add("is-active");

      // run bean state
      const state = next.getAttribute("data-state");
      if (state && STATES[state]) STATES[state]();

      // animate text in/out (autoAlpha works if your CSS hides non-active)
      if (!prefersReduce) {
        if (prev) gsap.to(prev, { autoAlpha: 0, duration: 0.18, overwrite: "auto" });
        gsap.fromTo(
          next,
          { autoAlpha: 0, y: direction > 0 ? 10 : -10 },
          { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out", overwrite: "auto" }
        );
      } else {
        gsap.set(next, { autoAlpha: 1, y: 0 });
      }
    };

    // Initial visible step
    showStep(0, 1);

    // -----------------------------------------
    // Pin the whole "ocean window"
    // -----------------------------------------
    const perStep = () => Math.round((window.innerHeight || 800) * 0.9);
    const endDistance = () => "+=" + (perStep() * steps.length);

    const pinStory = ScrollTrigger.create({
      trigger: story,
      start: "top top+=24",
      end: endDistance,
      pin: story,
      pinSpacing: true,
      anticipatePin: 1,
      pinReparent: true,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const raw = self.progress * steps.length;
        const idx = Math.min(steps.length - 1, Math.floor(raw + 1e-6));
        showStep(idx, self.direction || 1);
      }
    });

    // Layout refresh moments
    const refreshSoon = () => {
      // Temporarily unstack to re-measure if fonts/images changed
      story.classList.remove("deck-ready");
      measureMaxHeight();
      story.classList.add("deck-ready");

      ScrollTrigger.refresh();
    };

    requestAnimationFrame(refreshSoon);
    setTimeout(refreshSoon, 250);

    // Cleanup for Hydejack
    _cleanup = () => {
      try {
        pinStory.kill();
      } catch (e) {}
      killTweens();
      story.classList.remove("deck-ready");
      steps.forEach((s) => s.classList.remove("is-active"));
      // clear inline opacity from gsap if any
      steps.forEach((s) => gsap.set(s, { clearProps: "opacity,visibility,transform" }));
      _cleanup = () => {};
    };

    if (DEBUG) console.log("[about] deck window init ok", { steps: steps.length });
  }

  // Run init on load + Hydejack PJAX (IMPORTANT)
  function initSoon() {
    requestAnimationFrame(() => setTimeout(initAboutDeck, 0));
  }

  document.addEventListener("DOMContentLoaded", initSoon);

  const ps = document.getElementById("_pushState");
  if (ps) ps.addEventListener("hy-push-state-load", initSoon);

  window.addEventListener("load", initSoon);
})();
