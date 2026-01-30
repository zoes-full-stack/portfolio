/* global gsap, ScrollTrigger, Flip, ScrollSmoother */
/* assets/js/about-flow.js
   About Flow (Hydejack-safe)
   - Works on first load + PJAX navigations
   - Retries until DOM + GSAP are ready
   - Prevents double-binding
   - NEW: no re-parenting / Flip. Mover stays overlayed and animates to slot coords (no snapping).
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

    // Create / reuse an overlay layer so mover's absolute coords are stable
    let overlay = flow.querySelector(".about-beanOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "about-beanOverlay";
      flow.appendChild(overlay);
    }

    // Move mover into overlay ONCE (critical!)
    overlay.appendChild(mover);

    // Make mover absolute relative to overlay
    mover.style.position = "absolute";
    mover.style.left = "0px";
    mover.style.top = "0px";
    mover.style.willChange = "transform";
    mover.style.zIndex = "10";

    const hasGSAP = !!window.gsap;
    const hasST = !!window.ScrollTrigger;

    if (!hasGSAP || !hasST || !mover || !bean || chapters.length === 0) {
      // allow retry
      flow.dataset.aboutBound = "0";
      return false;
    }

    gsap.registerPlugin(ScrollTrigger);

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

    // Kill any running tweens we own
    gsap.killTweensOf(bean);
    gsap.killTweensOf(mover);

    // ---------- SHORE PALETTE ----------
    const SHORE = {
      shoreDeep: "#12486B",
      shoreMid:  "#419197",
      shoreLite: "#78D6C6",
      sand:      "#F5FCCD"
    };

    gsap.set(flow, {
      "--shore-deep": SHORE.shoreDeep,
      "--shore-mid":  SHORE.shoreMid,
      "--shore-lite": SHORE.shoreLite,
      "--sand":       SHORE.sand
    });

    // ---------- THEMES ----------
    const MOODS = {
      intro: {
        sea0:"#041823", sea1:"#062837", sea2:"#0b415a",
        accent:"#BFF6FF",
        bean:"#D7FAFF",
        glow:"rgba(215,250,255,0.30)"
      },
      mission: {
        sea0:"#031523", sea1:"#07354a", sea2:"#0c4f6c",
        accent:"#FFC06A",
        bean:"#FFB04C",
        glow:"rgba(255,176,76,0.28)"
      },
      tidbits: {
        sea0:"#031b2a", sea1:"#0a3f3a", sea2:"#0d5a50",
        accent:"#7CF2D6",
        bean:"#B6FFE8",
        glow:"rgba(182,255,232,0.26)"
      },
      curiosities: {
        sea0:"#07081d", sea1:"#140b33", sea2:"#24124f",
        accent:"#cbffe7ff",
        bean:"#44FFA7",
        glow:"rgba(231,214,255,0.26)"
      },
      curiosities2: {
        sea0:"#07081d", sea1:"#140b33", sea2:"#24124f",
        accent:"#cbffe7ff",
        bean:"#44FFA7",
        glow:"rgba(231,214,255,0.26)"
      },
      curiosities3: {
        sea0:"#07081d", sea1:"#140b33", sea2:"#24124f",
        accent:"#ffd7d6ff",
        bean:"#ffb0aeff",
        glow:"rgba(231,214,255,0.26)"
      },
      cta: {
        sea0:"#041823", sea1:"#062837", sea2:"#0b415a",
        accent:"#FFE09A",
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
          "--blush": 0.15,
          "--blushY": "6px",
        },
        prop: null,
        loop: "wave"
      },
      mission: {
        vars: {
          "--lookX":"0px",
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
          "--blush": 0.0,
          "--blushY": "6px",
        },
        prop: null,
        loop: "idle"
      },
      tidbits: {
        vars: {
          "--lookX":"-22px",
          "--eyeOpen":0.30,
          "--eyeTilt":"-50deg",
          "--smileCurve":0.0,
          "--smileW":"14%",
          "--smileY":"42%",
          "--armY":"76%",
          "--armLift":"10px",
          "--armLrot":"-10deg",
          "--armRrot":"10deg",
          "--handsY":"-4px",
          "--blush": 0.15,
          "--blushY": "2px",
        },
        prop: "question",
        loop: "think"
      },
      curiosities: {
        vars: {
          "--lookX":"-18px",
          "--eyeOpen":0.5,
          "--eyeH":"12%",
          "--eyeW":"12%",
          "--eyeTilt":"-4deg",
          "--smileW":"18%",
          "--smileY":"39%",
          "--smileCurve":1.5,
          "--armY":"44%",
          "--armLift":"-14px",
          "--armLx":"-2%",
          "--armRx":"-2%",
          "--armLrot":"-50deg",
          "--armRrot":"50deg",
          "--handsY":"-5px",
          "--blush": 0,
          "--blushY": "0px",
        },
        prop: "heart",
        loop: "idle"
      },
      curiosities2: {
        vars: {
          "--lookX":"-18px",
          "--eyeOpen":0.85,
          "--eyeH":"12%",
          "--eyeW":"12%",
          "--eyeTilt":"-4deg",
          "--smileW":"18%",
          "--smileY":"39%",
          "--smileCurve":1.15,
          "--armY":"44%",
          "--armLift":"-14px",
          "--armLx":"-2%",
          "--armRx":"-2%",
          "--armLrot":"-50deg",
          "--armRrot":"50deg",
          "--handsY":"-6px",
          "--blush": 0.9,
          "--blushY": "2px",
        },
        prop: "heart",
        loop: "idle"
      },
      curiosities3: {
        vars: {
          "--lookX":"-18px",
          "--eyeOpen":0.85,
          "--eyeH":"12%",
          "--eyeW":"12%",
          "--eyeTilt":"-4deg",
          "--smileW":"18%",
          "--smileY":"39%",
          "--smileCurve":1.15,

          /* YAAAY arms */
          "--armY":"34%",          // higher (was 44%)
          "--armLift":"-26px",     // lift up more
          "--armLx":"-12%",        // push left arm further left
          "--armRx":"-12%",        // push right arm further right
          "--armLrot":"-120deg",   // left arm up/out
          "--armRrot":"120deg",    // right arm up/out

          "--handsY":"-10px",

          "--blush": 1,
          "--blushY": "2px"
        },
        prop: "fish",
        loop: "idle"
      },
      cta: {
        vars: {

          "--lookX":"0px",
          "--eyeOpen":0.85,
          "--eyeW":"12%", "--eyeH":"12%",
          "--eyeTilt":"-4deg",
          "--smileCurve":1.15,
          "--armY":"44%",
          "--armLift":"-6px",
          "--armLrot":"-150deg",
          "--armRrot":"120deg",
          "--armLx":"-10%",
          "--armRx":"-10%",

          // "--lookX":"-18px",
          // "--eyeOpen":0.85,
          // "--eyeH":"12%",
          // "--eyeW":"12%",
          // "--eyeTilt":"-4deg",
          // "--smileW":"18%",
          // "--smileY":"39%",
          // "--smileCurve":1.15,
          // "--armY":"44%",
          // "--armLift":"-14px",
          // "--armLx":"-2%",
          // "--armRx":"-2%",
          // "--armLrot":"-50deg",
          // "--armRrot":"50deg",
          "--handsY":"-6px",
          "--blush": 0.25,
          "--blushY": "2px"
        },
        prop: "cta",
        loop: "wave"
      },
      // cta: {
      //   vars: {
      //     "--lookX":"-10px",
      //     "--eyeOpen":0.55,
      //     "--smileCurve":0.8,
      //     "--smileY":"40%",
      //     "--armY":"52%",
      //     "--armLift":"-10px",
      //     "--armLx":"-2%",
      //     "--armRx":"-10%",
      //     "--armLrot":"-35deg",
      //     "--armRrot":"55deg",
      //   },
      //   prop: "handshake",
      //   loop: "idle"
      // }
    };

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

      const blush = Number(pose.vars?.["--blush"] ?? 0);
      if (!prefersReduce && blush > 0) {
        gsap.fromTo(bean,
          { "--blush": Math.min(1, blush + 0.25) },
          { "--blush": blush, duration: 0.35, ease: "sine.out", overwrite: "auto" }
        );
      }

      if (prefersReduce) {
        poseLoop = null;
      } else if (pose.loop === "wave") {
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

    // ----------------------------
    // NEW: Smooth mover positioning (no DOM moves)
    // ----------------------------

    const slots = chapters.map(ch => ch.querySelector(".about-beanSlot")).filter(Boolean);
    if (slots.length === 0) return false;

    // Create a spacer in each slot to preserve layout / provide target rect
    const spacers = slots.map((slot) => {
      let sp = slot.querySelector(".about-beanSpacer");
      if (!sp) {
        sp = document.createElement("div");
        sp.className = "about-beanSpacer";
        slot.appendChild(sp);
      }
      // ensure target has size (use mover's current box)
      const r = mover.getBoundingClientRect();
      sp.style.width = Math.max(1, Math.round(r.width)) + "px";
      sp.style.height = Math.max(1, Math.round(r.height)) + "px";
      return sp;
    });

    // Make mover an overlay inside flow (stable containing block)
    // NOTE: relies on flow being position: relative in CSS (most layouts do). If not, this still works but relative to page.
    const prevMoverPos = {
      position: mover.style.position,
      left: mover.style.left,
      top: mover.style.top,
      willChange: mover.style.willChange,
      transform: mover.style.transform
    };

    mover.style.position = "absolute";
    mover.style.left = "0px";
    mover.style.top = "0px";
    mover.style.willChange = "transform";
    // keep it above content if needed (safe no-op if already)
    if (!mover.style.zIndex) mover.style.zIndex = "10";

    function moverXYForSpacer(spacerEl) {
      const rootRect = overlay.getBoundingClientRect();
      const targetRect = spacerEl.getBoundingClientRect();

      const moverRect = mover.getBoundingClientRect();
      const mW = moverRect.width || targetRect.width;
      const mH = moverRect.height || targetRect.height;

      const mx = (targetRect.left - rootRect.left) + (targetRect.width / 2);
      const my = (targetRect.top - rootRect.top) + (targetRect.height / 2);

      return { x: mx - (mW / 2), y: my - (mH / 2) };
    }

    function moverXYForChapter(i) {
      const ch = chapters[i] || chapters[0];
      const thought = ch.querySelector(".thought");
      const slot = ch.querySelector(".about-beanSlot");
      const rootRect = overlay.getBoundingClientRect();

      const pad = parseFloat(getComputedStyle(flow).getPropertyValue("--beanPad")) || 18;
      const mobile = window.matchMedia("(max-width: 900px)").matches;

      const mRect = mover.getBoundingClientRect();

      // Fallback target if thought missing
      const tRect = (thought || slot).getBoundingClientRect();

      if (mobile) {
        // Center under the bubble + add vertical padding
        const x = (tRect.left - rootRect.left) + (tRect.width / 2) - (mRect.width / 2);
        const y = (tRect.bottom - rootRect.top) + pad; // below bubble
        return { x, y };
      } else {
        // Desktop: to the right + vertically centered
        const x = (tRect.right - rootRect.left) + pad;
        const y = (tRect.top - rootRect.top) + (tRect.height / 2) - (mRect.height / 2);
        return { x, y };
      }
    }

    let moveTween = null;
    function moveMoverToIndex(i, animate = true) {
      const { x, y } = moverXYForChapter(i);

      if (moveTween) moveTween.kill();

      if (!animate || prefersReduce) {
        gsap.set(mover, { x, y });
        return;
      }

      moveTween = gsap.to(mover, {
        x, y,
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto"
      });
    }

    // Baseline: hide all thoughts
    chapters.forEach(ch => {
      const thought = ch.querySelector(".thought");
      if (thought) gsap.set(thought, { autoAlpha: 0, y: 14 });
    });

    function activateChapter(i, animateMove = true) {
      if (i === activeIndex) return;
      activeIndex = i;

      const ch = chapters[i] || chapters[0];
      const state = ch.dataset.state || "intro";

      chapters.forEach(x => x.classList.toggle("is-active", x === ch));

      // hide all thoughts then show this one
      chapters.forEach((c) => revealThought(c.querySelector(".thought"), false));
      revealThought(ch.querySelector(".thought"), true);

      applyState(state);
      moveMoverToIndex(i, animateMove);
    }

    // Init first chapter without animation
    const first = chapters[0];
    const firstState = first.dataset.state || "intro";
    chapters.forEach(x => x.classList.toggle("is-active", x === first));
    applyState(firstState);
    revealThought(first.querySelector(".thought"), true);
    gsap.set(mover, { x: 0, y: 0 });
    moveMoverToIndex(0, false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    // Triggers
    // Use onToggle so we only activate when a chapter is truly "active" (reduces boundary thrash).
    chapters.forEach((ch, i) => {
      ScrollTrigger.create({
        ...stBase,
        id: `about-chapter-${i}`,
        trigger: ch,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) activateChapter(i, true);
        }
      });
    });

    // Keep correct on refresh/resize (no animation)
    const onRefresh = () => {
      moveMoverToIndex(activeIndex, false);
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Also keep it correct on resize (sometimes refresh doesn't fire immediately in PJAX)
    const onResize = () => {
      ScrollTrigger.refresh();
      moveMoverToIndex(activeIndex, false);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Cleanup hook for PJAX (optional but nice)
    flow.__aboutCleanup = () => {
      try {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
      } catch (e) {}

      try {
        ScrollTrigger.getAll()
          .filter(t => t?.vars?.id && String(t.vars.id).startsWith("about-"))
          .forEach(t => t.kill(true));
      } catch (e) {}

      window.removeEventListener("resize", onResize);

      if (poseLoop) { poseLoop.kill(); poseLoop = null; }
      if (moveTween) { moveTween.kill(); moveTween = null; }

      // restore mover inline styles
      mover.style.position = prevMoverPos.position;
      mover.style.left = prevMoverPos.left;
      mover.style.top = prevMoverPos.top;
      mover.style.willChange = prevMoverPos.willChange;
      mover.style.transform = prevMoverPos.transform;

      flow.dataset.aboutBound = "0";
    };

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
