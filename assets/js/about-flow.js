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

    const hasGSAP = !!window.gsap;
    const hasST = !!window.ScrollTrigger;
    const hasFlip = !!window.Flip;

    if (!hasGSAP || !hasST || !mover || !bean || chapters.length === 0) {
      // allow retry
      flow.dataset.aboutBound = "0";
      return false;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (hasFlip) gsap.registerPlugin(Flip);

    flow.classList.add("is-js");

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

    gsap.killTweensOf(bean);

    // ---------- SHORE PALETTE (CodePen vibe) ----------
    const SHORE = {
      shoreDeep: "#12486B",
      shoreMid:  "#419197",
      shoreLite: "#78D6C6",
      sand:      "#F5FCCD"
    };

    // Apply shore vars once (CSS builds the full gradient from vars)
    gsap.set(flow, {
      "--shore-deep": SHORE.shoreDeep,
      "--shore-mid":  SHORE.shoreMid,
      "--shore-lite": SHORE.shoreLite,
      "--sand":       SHORE.sand
    });

    // ---------- THEMES ----------
    // Bean + glow tuned for contrast against shore + sand
    const MOODS = {
      intro: {
        sea0:"#041823", sea1:"#062837", sea2:"#0b415a",
        accent:"#BFF6FF",        // brighter sea-foam highlight
        bean:"#D7FAFF",
        glow:"rgba(215,250,255,0.30)"
      },
      mission: {
        sea0:"#031523", sea1:"#07354a", sea2:"#0c4f6c",
        accent:"#FFC06A",        // warmer “sun / justice”
        bean:"#FFB04C",
        glow:"rgba(255,176,76,0.28)"
      },
      tidbits: {
        sea0:"#031b2a", sea1:"#0a3f3a", sea2:"#0d5a50",
        accent:"#7CF2D6",        // shoreline sparkle mint
        bean:"#B6FFE8",
        glow:"rgba(182,255,232,0.26)"
      },
      curiosities: {
        sea0:"#07081d", sea1:"#140b33", sea2:"#24124f",
        accent:"#cbffe7ff",        // warmed lilac so it plays nicer with shore greens
        bean:"#44FFA7",
        glow:"rgba(231,214,255,0.26)"
      },
      curiosities2: {
        sea0:"#07081d", sea1:"#140b33", sea2:"#24124f",
        accent:"#cbffe7ff",        // warmed lilac so it plays nicer with shore greens
        bean:"#44FFA7",
        glow:"rgba(231,214,255,0.26)"
      },
      cta: {
        sea0:"#041823", sea1:"#062837", sea2:"#0b415a",
        accent:"#FFE09A",        // most “sunlit / sand”
        bean:"#FFD08A",
        glow:"rgba(255,208,138,0.30)"
      },
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

          // pumped eyes
          "--eyeOpen": 0.95,  
          "--eyeH":"12%",        
          "--eyeW":"12%",       

          "--eyeTilt":"0deg",
          "--smileCurve": 1,
          "--smileY":"39%",

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
          // looking toward the thought bubble (left)
          "--lookX":"-22px",

          // “thinking” eyes: slightly open + a touch more tilt
          "--eyeOpen":0.30,
          "--eyeTilt":"-50deg",

          // subtler smile (neutral/thinking)
          "--smileCurve":0.0,
          "--smileW":"14%",
          "--smileY":"42%",

          // arms lower + more relaxed
          "--armY":"76%",         
          "--armLift":"10px",    
          "--armLrot":"-10deg",
          "--armRrot":"10deg",

          // keep hands slightly “tucked”
          "--handsY":"-4px",
        },
        prop: "question",
        loop: "think"
      },
      curiosities: {
        vars: {
          // look toward thought bubble
          "--lookX":"-18px",

          // open + happy eyes
          "--eyeOpen":0.5,
          "--eyeH":"12%",
          "--eyeW":"12%",
          "--eyeTilt":"-4deg",

          // kitty smile :3
          "--smileW":"18%",
          "--smileY":"39%",
          "--smileCurve":1.5,

          // arms UP + slightly inward to "hold it up"
          "--armY":"44%",
          "--armLift":"-14px",
          "--armLx":"-2%",
          "--armRx":"-2%",
          "--armLrot":"-50deg",
          "--armRrot":"50deg",

          // nudge props/hands up a touch
          "--handsY":"-5px",
        },
        prop: "heart",
        loop: "idle"
      },
      curiosities2: {
        vars: {
          // look toward thought bubble
          "--lookX":"-18px",

          // open + happy eyes
          "--eyeOpen":0.85,
          "--eyeH":"12%",
          "--eyeW":"12%",
          "--eyeTilt":"-4deg",

          // kitty smile :3
          "--smileW":"18%",
          "--smileY":"39%",
          "--smileCurve":1.15,

          // arms UP + slightly inward to "hold it up"
          "--armY":"44%",
          "--armLift":"-14px",
          "--armLx":"-2%",
          "--armRx":"-2%",
          "--armLrot":"-50deg",
          "--armRrot":"50deg",

          // nudge props/hands up a touch
          "--handsY":"-6px",
        },
        prop: "heart",
        loop: "idle"
      },
      cta: {
        vars: {
          "--lookX":"-10px",
          "--eyeOpen":0.55,
          "--smileCurve":0.8,
          "--smileY":"40%",

          /* move arms to meet the handshake */
          "--armY":"52%",
          "--armLift":"-10px",
          "--armLx":"-2%",
          "--armRx":"-10%",
          "--armLrot":"-35deg",   // left arm forward-ish
          "--armRrot":"55deg",    // right arm relaxed / slightly up
        },
        prop: "handshake",
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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ok = initAboutFlow(document);
        if (!ok && retries > 0) setTimeout(() => boot(retries - 1), 80);
      });
    });
  }

  hookAllLoads(() => scheduleBoot(0));
})();
