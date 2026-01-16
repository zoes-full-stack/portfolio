/**
 * About Deck + Bean (Hydejack-safe)
 * File: assets/js/bean-about-interaction.js
 *
 * Requires:
 *   gsap.min.js
 *   ScrollTrigger.min.js
 */

(() => {
  const DEBUG = false;

  function log(...args) {
    if (DEBUG) console.log("[about-deck]", ...args);
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

  function initAboutDeck() {
    const story = document.querySelector("#aboutStory");
    if (!story) return;

    // Only if this page uses deck variant
    if (!story.classList.contains("about-story--deck")) return;

    // Hydejack PJAX: kill previous instance cleanly
    if (typeof story.__aboutDeckCleanup === "function") {
      story.__aboutDeckCleanup();
      story.__aboutDeckCleanup = null;
    }

    // If GSAP isn't loaded, keep normal scroll (no deck-ready)
    if (!window.gsap || !window.ScrollTrigger) {
      story.classList.remove("deck-ready");
      log("Missing GSAP/ScrollTrigger, leaving as normal scroll.");
      return;
    }

    // Mobile: keep normal scroll
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    if (isMobile) {
      story.classList.remove("deck-ready");
      log("Mobile layout, leaving as normal scroll.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const bean = story.querySelector("#magical-about-bean");
    const bg = story.querySelector("#magical-about-bean-container");
    const content = story.querySelector(".about-story__content");
    const steps = Array.from(story.querySelectorAll(".about-step"));

    if (!bean || !bg || !content || steps.length === 0) {
      story.classList.remove("deck-ready");
      log("Missing elements", { bean, bg, content, steps: steps.length });
      return;
    }

    const smile = bean.querySelector("#smile");
    const bubbles = bean.querySelectorAll(".about-bean-bubbles .bb");
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setBlush = (on) => {
      if (!smile) return;
      smile.classList.toggle("is-blush", !!on);
    };

    const killTweens = () => {
      gsap.killTweensOf(bean);
      gsap.killTweensOf(bg);
      bubbles.forEach((b) => gsap.killTweensOf(b));
    };

    const go = (vars) => gsap.to(bean, { overwrite: "auto", ...vars });
    const goBg = (vars) => gsap.to(bg, { overwrite: "auto", ...vars });

    // Bean states
    const STATES = {
      intro() {
        killTweens();
        setBlush(true);
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
      },

      mission() {
        killTweens();
        setBlush(false);
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
      },

      curiosities() {
        killTweens();
        setBlush(false);
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
      },

      work() {
        killTweens();
        setBlush(false);
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
      },

      cta() {
        killTweens();
        setBlush(false);

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

    // Measure tallest step BEFORE stacking
    function measureMaxHeight() {
      // Ensure normal flow while measuring
      story.classList.remove("deck-ready");

      // Force layout
      // (small timeout lets fonts settle on first paint)
      const maxH = Math.max(...steps.map((s) => s.scrollHeight), 320);
      content.style.minHeight = Math.max(maxH + 24, 360) + "px";
    }

    measureMaxHeight();
    story.classList.add("deck-ready");

    // Prep step visibility
    steps.forEach((s) => s.classList.remove("is-active"));

    let activeIndex = -1;

    function showStep(i, direction = 1) {
      i = Math.max(0, Math.min(steps.length - 1, i));
      if (i === activeIndex) return;

      const prev = steps[activeIndex];
      const next = steps[i];
      activeIndex = i;

      steps.forEach((s) => s.classList.remove("is-active"));
      next.classList.add("is-active");

      // Run bean state
      const state = next.getAttribute("data-state");
      if (state && STATES[state]) STATES[state]();

      // Animate text in/out (optional)
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
    }

    // Initial
    showStep(0, 1);

    // Pin & progress mapping
    const stepScroll = Math.max(420, Math.min(900, Math.round((window.innerHeight || 800) * 0.9)));

    const pin = ScrollTrigger.create({
      trigger: story,
      start: "top top+=24",
      end: () => "+=" + (stepScroll * steps.length),
      pin: story,
      pinSpacing: true,
      anticipatePin: 1,
      pinReparent: true,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const raw = self.progress * steps.length;
        const idx = Math.min(steps.length - 1, Math.floor(raw + 0.000001));
        showStep(idx, self.direction || 1);
      }
    });

    // ✅ Hydejack PJAX: kill the pin BEFORE navigating away
    const ps = document.getElementById("_pushState");
    const killOnNav = () => {
      try { pin.kill(true); } catch(e) {}
      try { ScrollTrigger.refresh(); } catch(e) {}
    };

    if (ps) ps.addEventListener("hy-push-state-start", killOnNav);
    document.addEventListener("hy-push-state-start", killOnNav);


    function refreshSoon() {
      measureMaxHeight();
      ScrollTrigger.refresh();
    }

    requestAnimationFrame(refreshSoon);
    setTimeout(refreshSoon, 250);

    // Keep it stable across resizes
    const onResize = () => refreshSoon();
    window.addEventListener("resize", onResize, { passive: true });

    // Cleanup for PJAX navigations
    story.__aboutDeckCleanup = () => {
      try { pin.kill(true); } catch (e) {}
      killTweens();

      window.removeEventListener("resize", onResize);

      const ps = document.getElementById("_pushState");
      if (ps) ps.removeEventListener("hy-push-state-start", killOnNav);
      document.removeEventListener("hy-push-state-start", killOnNav);

      story.classList.remove("deck-ready");
      steps.forEach((s) => s.classList.remove("is-active"));
    };

    log("init OK", { steps: steps.length });
  }

  hookAllLoads(() => {
    // small delay helps Hydejack injection timing
    requestAnimationFrame(() => requestAnimationFrame(initAboutDeck));
  });
})();
