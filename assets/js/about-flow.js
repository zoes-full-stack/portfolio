/* global gsap, ScrollTrigger, Flip, ScrollSmoother */
/* assets/js/about-flow.js
   About Flow (Hydejack-safe)
   - Works on first load + PJAX navigations
   - Retries until DOM + GSAP are ready
   - Prevents double-binding
*/

(function () {
  // ----------------------------
  // Hook all relevant load paths
  // ----------------------------
  function hookAllLoads(cb) {
    document.addEventListener("DOMContentLoaded", cb, { passive: true });
    window.addEventListener("load", cb, { passive: true });
    window.addEventListener("pageshow", cb, { passive: true });

    const ps = document.getElementById("_pushState");
    if (ps) ps.addEventListener("hy-push-state-load", cb, { passive: true });

    document.addEventListener("hy-push-state-load", cb, { passive: true });
    document.addEventListener("turbo:load", cb, { passive: true });
  }

  let bootTimer = null;
  function scheduleBoot(delay = 0) {
    if (bootTimer) clearTimeout(bootTimer);
    bootTimer = setTimeout(() => {
      bootTimer = null;
      boot();
    }, delay);
  }

  // ----------------------------
  // Init (bind once per page DOM)
  // ----------------------------
  function initAboutFlow(root = document) {
    const flow = root.querySelector("#aboutFlow.about-flow");
    if (!flow) return false;

    // Prevent double-binding (critical on PJAX)
    if (flow.dataset.aboutBound === "1") return true;
    flow.dataset.aboutBound = "1";

    const mover = flow.querySelector(".about-beanMover");
    const bean = flow.querySelector("#magical-about-story-bean");
    const chapters = Array.from(flow.querySelectorAll(".about-chapter"));

    // GSAP availability
    const hasGSAP = !!window.gsap;
    const hasST = !!window.ScrollTrigger;

    // IMPORTANT:
    // Your global tags currently do NOT include Flip.
    // So Flip will often be missing unless you add it.
    // We'll gracefully fall back without Flip.
    const hasFlip = !!window.Flip;

    if (!hasGSAP || !hasST || !mover || !bean || chapters.length === 0) {
      // allow retry
      flow.dataset.aboutBound = "0";
      return false;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (hasFlip) gsap.registerPlugin(Flip);

    // Mark active JS state (use in CSS so content isn't "blank" if JS fails)
    flow.classList.add("is-js");

    // Optional normalize
    try { ScrollTrigger.normalizeScroll(true); } catch (e) {}

    // Hydejack / ScrollSmoother support (optional)
    let scrollerEl = null;
    if (window.ScrollSmoother && typeof window.ScrollSmoother.get === "function") {
      const smoother = window.ScrollSmoother.get();
      if (smoother && typeof smoother.wrapper === "function") scrollerEl = smoother.wrapper();
    }
    const stBase = scrollerEl ? { scroller: scrollerEl } : {};

    // Kill only OUR triggers (PJAX safe)
    ScrollTrigger.getAll()
      .filter(t => t?.vars?.id && String(t.vars.id).startsWith("about-"))
      .forEach(t => t.kill(true));

    // Stop old tweens on bean
    gsap.killTweensOf(bean);

    // ---------- THEMES ----------
    const MOODS = {
      intro:       { sea0:"#041823", sea1:"#062837", sea2:"#0b415a", accent:"#beecf4", bean:"#beecf4", glow:"rgba(190,236,244,0.25)" },
      mission:     { sea0:"#031523", sea1:"#07354a", sea2:"#0c4f6c", accent:"#ffb04c", bean:"#d6f3f8", glow:"rgba(255,176,76,0.20)" },
      tidbits:     { sea0:"#031b2a", sea1:"#0a3f3a", sea2:"#0d5a50", accent:"#9ef0d1", bean:"#bff7e3", glow:"rgba(158,240,209,0.22)" },
      curiosities: { sea0:"#07081d", sea1:"#140b33", sea2:"#24124f", accent:"#c49bff", bean:"#e2d0ff", glow:"rgba(196,155,255,0.22)" },
      cta:         { sea0:"#041823", sea1:"#062837", sea2:"#0b415a", accent:"#ffb04c", bean:"#ffb04c", glow:"rgba(255,176,76,0.24)" },
    };

    const POSES = {
      intro: {
        vars: {
          "--lookX":"0px",
          "--eyeOpen":0.10,
          "--eyeW":"12%", "--eyeH":"10%",
          "--smileCurve":1,
          "--armY":"44%",
          "--armLift":"-6px",
          "--armLrot":"-150deg",
          "--armRrot":"120deg",
          "--armLx":"-10%",
          "--armRx":"-10%",
        },
        prop: null,
        loop: "wave"
      },
      mission: {
        vars: {
          "--lookX":"0px",
          "--eyeOpen":0.55,
          "--eyeTilt":"0deg",
          "--smileCurve":0.2,
          "--smileY":"40%",
          "--armY":"40%",
          "--armLift":"-18px",
          "--armLrot":"-92deg",
          "--armRrot":"92deg",
          "--armLx":"-6%",
          "--armRx":"-6%",
        },
        prop: null,
        loop: "idle"
      },
      tidbits: {
        vars: {
          "--lookX":"-14px",
          "--eyeOpen":0.35,
          "--eyeTilt":"-6deg",
          "--smileCurve":0.0,
          "--smileW":"14%",
          "--smileY":"41%",
          "--armY":"56%",
          "--armLrot":"-18deg",
          "--armRrot":"18deg",
          "--armLift":"8px",
          "--handsY":"-6px",
        },
        prop: null,
        loop: "think"
      },
      curiosities: {
        vars: {
          "--lookX":"0px",
          "--eyeOpen":0.45,
          "--smileCurve":0.8,
          "--armY":"60%",
          "--armLrot":"-20deg",
          "--armRrot":"20deg",
          "--armLift":"8px",
          "--handsY":"6px",
        },
        prop: "heart",
        loop: "idle"
      },
      cta: {
        vars: {
          "--lookX":"-10px",
          "--eyeOpen":0.45,
          "--smileCurve":0.6,
          "--armY":"62%",
          "--armLrot":"-22deg",
          "--armRrot":"16deg",
          "--armLift":"10px",
        },
        prop: "portal",
        loop: "idle"
      }
    };

    let poseLoop = null;
    let activeIndex = 0;

    function blink() {
      const e1 = bean.querySelector("#eye1");
      const e2 = bean.querySelector("#eye2");
      if (!e1 || !e2) return;

      gsap.fromTo([e1, e2], { scaleY: 1 }, {
        scaleY: 0.08,
        transformOrigin: "50% 50%",
        duration: 0.08,
        yoyo: true,
        repeat: 1,
        repeatDelay: 0.06,
        ease: "power1.inOut",
        overwrite: true
      });
    }

    function applyState(state) {
      const mood = MOODS[state] || MOODS.intro;
      const pose = POSES[state] || POSES.intro;

      flow.dataset.active = state;

      gsap.to(flow, {
        "--sea-0": mood.sea0,
        "--sea-1": mood.sea1,
        "--sea-2": mood.sea2,
        "--accent": mood.accent,
        "--bean": mood.bean,
        "--glow": mood.glow,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto"
      });

      if (poseLoop) { poseLoop.kill(); poseLoop = null; }

      gsap.set(bean, { "--armWave": "0deg" });
      gsap.killTweensOf(bean, "y");

      if (pose.prop) bean.setAttribute("data-prop", pose.prop);
      else bean.removeAttribute("data-prop");

      gsap.to(bean, {
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
        ...pose.vars
      });

      if (pose.loop === "wave") {
        poseLoop = gsap.to(bean, { "--armWave": "12deg", duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
      } else if (pose.loop === "think") {
        poseLoop = gsap.to(bean, { y: -4, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      } else {
        poseLoop = gsap.to(bean, { y: -8, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      blink();
    }

    function revealThought(thought, show) {
      if (!thought) return;
      gsap.to(thought, {
        autoAlpha: show ? 1 : 0,
        y: show ? 0 : 14,
        duration: show ? 0.35 : 0.20,
        ease: show ? "power2.out" : "power2.inOut",
        overwrite: "auto"
      });
    }

    // Move the mover into the slot; Flip if available, otherwise a normal move
    function moveMoverToSlot(slotEl, animate = true) {
      if (!slotEl) return;
      if (mover.parentNode === slotEl) return;

      if (hasFlip && animate) {
        const state = Flip.getState(mover, { props: "transform" });
        slotEl.appendChild(mover);

        Flip.from(state, {
          duration: 0.55,
          ease: "power2.out",
          absolute: true,
          prune: true
        });
      } else {
        slotEl.appendChild(mover);
      }
    }

    // Slots
    const slots = chapters.map(ch => ch.querySelector(".about-beanSlot")).filter(Boolean);
    if (slots.length === 0) return false;

    // Baseline: hide all thoughts
    chapters.forEach(ch => {
      const thought = ch.querySelector(".thought");
      if (thought) gsap.set(thought, { autoAlpha: 0, y: 14 });
    });

    // Init first
    const first = chapters[0];
    const firstState = first.dataset.state || "intro";
    const firstThought = first.querySelector(".thought");
    const firstSlot = first.querySelector(".about-beanSlot");

    chapters.forEach(x => x.classList.toggle("is-active", x === first));
    applyState(firstState);

    if (firstThought) gsap.set(firstThought, { autoAlpha: 1, y: 0 });
    moveMoverToSlot(firstSlot, false);

    // Ensure refresh happens after layout paints (critical on first load)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    // Triggers
    chapters.forEach((ch, i) => {
      const state = ch.dataset.state || "intro";
      const thought = ch.querySelector(".thought");
      const slot = ch.querySelector(".about-beanSlot");

      ScrollTrigger.create({
        ...stBase,
        id: `about-chapter-${i}`,
        trigger: ch,
        start: "top 60%",
        end: "bottom 40%",

        onEnter: () => {
          activeIndex = i;
          chapters.forEach(x => x.classList.toggle("is-active", x === ch));
          applyState(state);
          moveMoverToSlot(slot, true);
          revealThought(thought, true);
        },

        onEnterBack: () => {
          activeIndex = i;
          chapters.forEach(x => x.classList.toggle("is-active", x === ch));
          applyState(state);
          moveMoverToSlot(slot, true);
          revealThought(thought, true);
        },

        onLeave: () => revealThought(thought, false),
        onLeaveBack: () => revealThought(thought, false),
      });
    });

    // Keep correct on refresh/resize (no animation)
    ScrollTrigger.addEventListener("refresh", () => {
      const active = chapters[activeIndex] || chapters[0];
      const slot = active.querySelector(".about-beanSlot");
      if (slot) moveMoverToSlot(slot, false);
    });

    return true;
  }

  // ----------------------------
  // Boot w/ retries
  // ----------------------------
  function boot(retries = 40) {
    // Two RAFs gives Hydejack time to inject + browser time to layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ok = initAboutFlow(document);
        if (!ok && retries > 0) setTimeout(() => boot(retries - 1), 80);
      });
    });
  }

  hookAllLoads(() => scheduleBoot(0));
})();
