/**
 * About Deck + Bean (Hydejack-proof + smooth scrub + snap)
 * File: assets/js/bean-about-interaction.js
 *
 * Requires:
 *   gsap.min.js
 *   ScrollTrigger.min.js
 */

(() => {
  const DEBUG = false;
  const log = (...a) => DEBUG && console.log("[about-deck]", ...a);

  function hookAllLoads(cb) {
    const run = () => requestAnimationFrame(() => requestAnimationFrame(cb));

    if (document.readyState === "interactive" || document.readyState === "complete") run();
    else document.addEventListener("DOMContentLoaded", run, { passive: true });

    window.addEventListener("load", run, { passive: true });
    window.addEventListener("pageshow", run, { passive: true });

    const ps = document.getElementById("_pushState");
    if (ps) ps.addEventListener("hy-push-state-load", run, { passive: true });
    document.addEventListener("hy-push-state-load", run, { passive: true });

    document.addEventListener("turbo:load", run, { passive: true });
  }

  function pickScroller() {
    const candidates = ["#_main", "#_content", "#_wrapper", "hy-push-state", "main", "body"];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const cs = getComputedStyle(el);
      const oy = cs.overflowY;
      const scrollable =
        (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 2;
      if (scrollable) return el;
    }
    return window;
  }

  function whenGSAPReady(fn, tries = 40) {
    const ok = !!(window.gsap && window.ScrollTrigger && gsap.timeline);
    if (ok) return fn();
    if (tries <= 0) return;
    requestAnimationFrame(() => whenGSAPReady(fn, tries - 1));
  }

  function initAboutDeck() {
    const story = document.querySelector("#aboutStory");
    if (!story) return;
    if (!story.classList.contains("about-story--deck")) return;

    if (window.matchMedia("(max-width: 900px)").matches) {
      story.classList.remove("deck-ready");
      return;
    }

    // Kill previous instance (PJAX)
    if (typeof story.__aboutDeckCleanup === "function") {
      story.__aboutDeckCleanup();
      story.__aboutDeckCleanup = null;
    }

    whenGSAPReady(() => {
      gsap.registerPlugin(ScrollTrigger);

      const bean = story.querySelector("#magical-about-bean");
      const bg = story.querySelector("#magical-about-bean-container");
      const content = story.querySelector(".about-story__content");
      const steps = Array.from(story.querySelectorAll(".about-step"));

      if (!bean || !bg || !content || steps.length === 0) {
        story.classList.remove("deck-ready");
        return;
      }

      const smile = bean.querySelector("#smile");
      const bubbles = bean.querySelectorAll(".about-bean-bubbles .bb");
      const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const scroller = pickScroller();
      const usingElementScroller = scroller !== window;
      const pinType = usingElementScroller ? "transform" : "fixed";
      const scrollerOpt = usingElementScroller ? scroller : undefined;

      // Helpers
      const setBlush = (on) => smile?.classList.toggle("is-blush", !!on);

      const killTweens = () => {
        gsap.killTweensOf(bean);
        gsap.killTweensOf(bg);
        bubbles.forEach((b) => gsap.killTweensOf(b));
      };

      const go = (vars) => gsap.to(bean, { overwrite: "auto", ...vars });
      const goBg = (vars) => gsap.to(bg, { overwrite: "auto", ...vars });

      const STATES = {
        intro() {
          killTweens();
          setBlush(true);
          go({
            duration: 0.45,
            backgroundColor: "rgb(254, 255, 171)",
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

        tidbits() {
          killTweens();
          setBlush(false);
          go({
            duration: 0.45,
            "--bean-rot": "0deg",
            "--bean-scale": 1.01,
            "--armL-rot": "14deg",
            "--armR-rot": "-14deg",
            "--armL-y": "0px",
            "--armR-y": "0px",
            backgroundColor: "#rgba(255, 221, 119, 1)",
            ease: "power2.out"
          });
          goBg({ duration: 0.45, backgroundColor: "transparent", ease: "power2.out" });
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

      // ---- Measure tallest step BEFORE stacking ----
      function measureMaxHeight() {
        story.classList.remove("deck-ready");
        const maxH = Math.max(...steps.map((s) => s.scrollHeight), 320);
        content.style.minHeight = Math.max(maxH + 24, 360) + "px";
      }

      measureMaxHeight();
      story.classList.add("deck-ready");

      // Prep visibility
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

        const stateName = next.getAttribute("data-state");
        if (stateName && STATES[stateName]) STATES[stateName]();

        if (!prefersReduce) {
          if (prev) gsap.to(prev, { autoAlpha: 0, duration: 0.18, overwrite: "auto" });
          gsap.fromTo(
            next,
            { autoAlpha: 0, y: direction > 0 ? 10 : -10 },
            { autoAlpha: 1, y: 0, duration: 0.26, ease: "power2.out", overwrite: "auto" }
          );
        } else {
          gsap.set(next, { autoAlpha: 1, y: 0 });
        }
      }

      // Initial
      showStep(0, 1);

      // ---- Scroll "feel" tuning knobs ----
      const stepScroll = Math.max(520, Math.min(980, Math.round((window.innerHeight || 800) * 0.95)));

      // This makes index changes ease-in instead of popping
      const indexDriver = { v: 0 };
      let indexTween = null;

      function setIndexSmooth(target, direction) {
        if (indexTween) indexTween.kill();

        indexTween = gsap.to(indexDriver, {
          v: target,
          duration: 0.18,
          ease: "power2.out",
          onUpdate: () => {
            const idx = Math.round(indexDriver.v);
            showStep(idx, direction);
          }
        });
      }

      const pin = ScrollTrigger.create({
        trigger: story,
        scroller: scrollerOpt,
        start: "top top+=24",
        end: () => "+=" + stepScroll * steps.length,
        pin: story,
        pinSpacing: true,
        anticipatePin: 1,
        pinType,
        invalidateOnRefresh: true,

        // 🧈 Butter: progress follows scroll smoothly
        scrub: prefersReduce ? false : 0.6,

        // 🧲 Snap to each “card”
        snap: prefersReduce
          ? false
          : {
              snapTo: (value) => {
                const step = 1 / (steps.length - 1);
                return Math.round(value / step) * step;
              },
              duration: { min: 0.12, max: 0.28 },
              delay: 0.02,
              ease: "power2.out"
            },

        onUpdate(self) {
          // Map progress -> step index (continuous)
          const t = self.progress * (steps.length - 1);
          setIndexSmooth(t, self.direction || 1);
        }
      });

      function refreshSoon() {
        measureMaxHeight();
        ScrollTrigger.refresh(true);
      }

      requestAnimationFrame(refreshSoon);
      setTimeout(refreshSoon, 250);

      const onResize = () => refreshSoon();
      window.addEventListener("resize", onResize, { passive: true });

      // PJAX cleanup
      const ps = document.getElementById("_pushState");
      const killOnNav = () => {
        try { pin.kill(true); } catch (e) {}
        try { ScrollTrigger.refresh(true); } catch (e) {}
      };

      if (ps) ps.addEventListener("hy-push-state-start", killOnNav);
      document.addEventListener("hy-push-state-start", killOnNav);

      story.__aboutDeckCleanup = () => {
        try { pin.kill(true); } catch (e) {}
        if (indexTween) indexTween.kill();
        killTweens();
        window.removeEventListener("resize", onResize);

        const ps2 = document.getElementById("_pushState");
        if (ps2) ps2.removeEventListener("hy-push-state-start", killOnNav);
        document.removeEventListener("hy-push-state-start", killOnNav);

        story.classList.remove("deck-ready");
        steps.forEach((s) => s.classList.remove("is-active"));
      };
    });
  }

  hookAllLoads(initAboutDeck);
})();
