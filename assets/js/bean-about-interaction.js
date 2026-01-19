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
      const scrollable = (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 2;
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
    if (!story || !story.classList.contains("about-story--deck")) return;

    if (window.matchMedia("(max-width: 900px)").matches) {
      story.classList.remove("deck-ready");
      return;
    }

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
      const currents = Array.from(story.querySelectorAll(".about-current"));

      if (!bean || !bg || !content || steps.length === 0) {
        story.classList.remove("deck-ready");
        return;
      }

      const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scroller = pickScroller();
      const usingElementScroller = scroller !== window;
      const pinType = usingElementScroller ? "transform" : "fixed";
      const scrollerOpt = usingElementScroller ? scroller : undefined;

      // ---- Measure max content height ----
      const stepScroll = Math.max(520, Math.min(980, Math.round((window.innerHeight || 800) * 0.95)));
      const maxH = Math.max(...steps.map((s) => s.scrollHeight), 320);
      content.style.minHeight = Math.max(maxH + 24, 360) + "px";
      story.classList.add("deck-ready");

      // Make first step visible immediately
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });
      steps[0].classList.add("is-active");

      // ---- Text: prepare hidden ----
      steps.forEach((s) => gsap.set(s, { autoAlpha: 0, y: 20 }));

      // ---- Master timeline ----
      const motionTL = gsap.timeline({
        scrollTrigger: {
          trigger: story,
          scroller: scrollerOpt,
          start: "top top+=24",
          end: () => "+=" + stepScroll * steps.length,
          pin: story,
          pinSpacing: true,
          pinType,
          scrub: prefersReduce ? false : 0.6
        }
      });

      // ---- Bean states ----
      const beanStates = [
        { rot: "0deg", scale: 1, armL: 12, armR: -12, bg: "transparent", blush: true },
        { rot: "0deg", scale: 1.02, armL: -38, armR: 38, bg: "rgba(255,255,255,.12)", blush: false },
        { rot: "0deg", scale: 1.01, armL: 14, armR: -14, bg: "transparent", blush: false },
        { rot: "-7deg", scale: 1, armL: 10, armR: -10, bg: "transparent", blush: false },
        { rot: "0deg", scale: 1.06, armL: -18, armR: 18, bg: "rgba(245,233,183,.55)", blush: false }
      ];

      beanStates.forEach((s, i) => {
        motionTL.to(bean, {
          "--bean-rot": s.rot,
          "--bean-scale": s.scale,
          "--armL-rot": s.armL + "deg",
          "--armR-rot": s.armR + "deg",
          duration: 1,
          ease: "power1.inOut",
          onUpdate: () => {
            // optional blush toggle
            const smile = bean.querySelector("#smile");
            if (smile) smile.classList.toggle("is-blush", !!s.blush);
          }
        }, i * 1);

        motionTL.to(bg, {
          backgroundColor: s.bg,
          duration: 1,
          ease: "power1.inOut"
        }, i * 1);
      });

      // ---- Currents: environmental drift ----
      currents.forEach((c, i) => {
        motionTL.to(c, {
          x: () => gsap.utils.random(-20, 20),
          y: () => gsap.utils.random(-10, 10),
          duration: 1,
          ease: "sine.inOut"
        }, i * 0.15);
      });

      // ---- Text reveal ----

      steps.forEach((step, i) => {
        gsap.fromTo(step,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power1.out",
            scrollTrigger: {
              trigger: step,
              scroller: scrollerOpt,
              start: "top 85%",
              end: "top 60%",
              scrub: true
            }
          }
        );
      });


      // steps.forEach((step, i) => {
      //   motionTL.to(step, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power1.out" }, i * 1);
      // });

      // Optional snap to cards
      if (!prefersReduce) {

        ScrollTrigger.create({
          trigger: story,
          scroller: scrollerOpt,
          start: "top top+=24",
          end: () => "+=" + stepScroll * steps.length,
          pin: content,   // pin only the text content, not the entire story
          pinSpacing: true,
          scrub: 0.6
        });

        // ScrollTrigger.create({
        //   trigger: story,
        //   scroller: scrollerOpt,
        //   start: "top top+=24",
        //   end: () => "+=" + stepScroll * steps.length,
        //   pin: story,
        //   pinSpacing: true,
        //   snap: {
        //     snapTo: 1 / (steps.length - 1),
        //     duration: { min: 0.12, max: 0.28 },
        //     delay: 0.02,
        //     ease: "power2.out"
        //   }
        // });
      }

      // ---- PJAX cleanup ----
      story.__aboutDeckCleanup = () => {
        motionTL.kill();
        steps.forEach((s) => gsap.set(s, { autoAlpha: 0, y: 20 }));
        currents.forEach((c) => gsap.killTweensOf(c));
        story.classList.remove("deck-ready");
      };
    });
  }

  hookAllLoads(initAboutDeck);
})();
