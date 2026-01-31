/* global gsap, ScrollTrigger, Flip, ScrollSmoother */
/* assets/js/about-flow.js
   About Flow (Hydejack-safe)
   - Desktop: bean moves via overlay coords (smooth, no snapping)
   - Mobile: bean is docked into the active .thought (top-right) so it moves with the bubble
   - PJAX safe: prevents double-binding + kills only our triggers
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

  function isMobile() {
    return window.matchMedia("(max-width: 900px)").matches;
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

    if (!hasGSAP || !hasST || !mover || !bean || chapters.length === 0) {
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

    // ---------- THEMES ----------
    const MOODS = {
      intro: {
        sea0:"#041823", sea1:"#062837", sea2:"#0b415a",
        accent:"#BFF6FF", bean:"#D7FAFF", glow:"rgba(215,250,255,0.30)"
      },
      mission: {
        sea0:"#031523", sea1:"#07354a", sea2:"#0c4f6c",
        accent:"#FFC06A", bean:"#FFB04C", glow:"rgba(255,176,76,0.28)"
      },
      tidbits: {
        sea0:"#031b2a", sea1:"#0a3f3a", sea2:"#0d5a50",
        accent:"#7CF2D6", bean:"#B6FFE8", glow:"rgba(182,255,232,0.26)"
      },
      curiosities: {
        sea0:"#07081d", sea1:"#140b33", sea2:"#24124f",
        accent:"#cbffe7ff", bean:"#44FFA7", glow:"rgba(231,214,255,0.26)"
      },
      curiosities2: {
        sea0:"#07081d", sea1:"#140b33", sea2:"#24124f",
        accent:"#cbffe7ff", bean:"#44FFA7", glow:"rgba(231,214,255,0.26)"
      },
      curiosities3: {
        sea0:"#07081d", sea1:"#140b33", sea2:"#24124f",
        accent:"#ffd7d6ff", bean:"#ffb0aeff", glow:"rgba(231,214,255,0.26)"
      },
      cta: {
        sea0:"#041823", sea1:"#062837", sea2:"#0b415a",
        accent:"#FFE09A", bean:"#FFD08A", glow:"rgba(255,208,138,0.30)"
      },
    };

    const POSES = {
      intro: {
        vars: {
          "--lookX":"0px","--eyeOpen":0.10,"--eyeW":"12%","--eyeH":"10%",
          "--smileCurve":1,"--armY":"44%","--armLift":"-6px",
          "--armLrot":"-150deg","--armRrot":"120deg","--armLx":"-10%","--armRx":"-10%",
          "--blush": 0.15,"--blushY":"6px",
        },
        prop: null, loop: "wave"
      },
      mission: {
        vars: {
          "--lookX":"0px","--eyeOpen":0.95,"--eyeH":"12%","--eyeW":"12%",
          "--eyeTilt":"0deg","--smileCurve":1,"--smileY":"39%",
          "--armY":"40%","--armLift":"-18px","--armLrot":"-92deg","--armRrot":"92deg",
          "--armLx":"-6%","--armRx":"-6%","--blush":0,"--blushY":"6px"
        },
        prop: null, loop: "idle"
      },
      tidbits: {
        vars: {
          "--lookX":"-22px","--eyeOpen":0.30,"--eyeTilt":"-50deg",
          "--smileCurve":0,"--smileW":"14%","--smileY":"42%",
          "--armY":"76%","--armLift":"10px","--armLrot":"-10deg","--armRrot":"10deg",
          "--handsY":"-4px","--blush":0.15,"--blushY":"2px",
        },
        prop: "question", loop: "think"
      },
      curiosities: {
        vars: {
          "--lookX":"-18px","--eyeOpen":0.5,"--eyeH":"12%","--eyeW":"12%","--eyeTilt":"-4deg",
          "--smileW":"18%","--smileY":"39%","--smileCurve":1.5,
          "--armY":"44%","--armLift":"-14px","--armLx":"-2%","--armRx":"-2%",
          "--armLrot":"-50deg","--armRrot":"50deg","--handsY":"-5px","--blush":0,"--blushY":"0px"
        },
        prop: "heart", loop: "idle"
      },
      curiosities2: {
        vars: {
          "--lookX":"-18px","--eyeOpen":0.85,"--eyeH":"12%","--eyeW":"12%","--eyeTilt":"-4deg",
          "--smileW":"18%","--smileY":"39%","--smileCurve":1.15,
          "--armY":"44%","--armLift":"-14px","--armLx":"-2%","--armRx":"-2%",
          "--armLrot":"-50deg","--armRrot":"50deg","--handsY":"-6px",
          "--blush":0.9,"--blushY":"2px"
        },
        prop: "heart", loop: "idle"
      },
      curiosities3: {
        vars: {
          "--lookX":"-18px","--eyeOpen":0.85,"--eyeH":"12%","--eyeW":"12%","--eyeTilt":"-4deg",
          "--smileW":"18%","--smileY":"39%","--smileCurve":1.15,
          "--armY":"34%","--armLift":"-26px","--armLx":"-12%","--armRx":"-12%",
          "--armLrot":"-120deg","--armRrot":"120deg","--handsY":"-10px",
          "--blush":1,"--blushY":"2px"
        },
        prop: "fish", loop: "idle"
      },
      cta: {
        vars: {
          "--lookX":"0px","--eyeOpen":0.85,"--eyeW":"12%","--eyeH":"12%","--eyeTilt":"-4deg",
          "--smileCurve":1.15,"--armY":"4%","--armLift":"-6px",
          "--armLrot":"-150deg","--armRrot":"120deg","--armLx":"-10%","--armRx":"-10%",
          "--handsY":"-6px","--blush":0.25,"--blushY":"2px"
        },
        prop: "cta", loop: "wave"
      }
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
    // Desktop overlay layer (stable absolute coords)
    // ----------------------------
    let overlay = flow.querySelector(".about-beanOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "about-beanOverlay";
      flow.appendChild(overlay);
    }

    const prevMoverPos = {
      parent: mover.parentNode,
      position: mover.style.position,
      left: mover.style.left,
      top: mover.style.top,
      willChange: mover.style.willChange,
      transform: mover.style.transform
    };

    function ensureDesktopHome() {
      flow.dataset.dock = "0";
      if (mover.parentNode !== overlay) overlay.appendChild(mover);

      mover.style.position = "absolute";
      mover.style.left = "0px";
      mover.style.top = "0px";
      mover.style.willChange = "transform";
      mover.style.zIndex = "10";
    }

    function ensureMobileDock(i) {
      flow.dataset.dock = "1";

      const ch = chapters[i] || chapters[0];
      const thought = ch.querySelector(".thought");
      if (!thought) return;

      // Move mover INTO the thought so it naturally scrolls with it
      if (mover.parentNode !== thought) thought.appendChild(mover);

      // Clear any overlay transforms so CSS absolute top/right wins
      gsap.set(mover, { clearProps: "x,y,transform" });
    }

    // Desktop position calc (right of thought, vertically centered)
    function moverXYForDesktop(i) {
      const ch = chapters[i] || chapters[0];
      const thought = ch.querySelector(".thought");
      const slot = ch.querySelector(".about-beanSlot");

      const rootRect = overlay.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(flow).getPropertyValue("--beanPad")) || 18;

      const mRect = mover.getBoundingClientRect();
      const tRect = (thought || slot).getBoundingClientRect();

      const x = (tRect.right - rootRect.left) + pad;
      const y = (tRect.top - rootRect.top) + (tRect.height / 2) - (mRect.height / 2);
      return { x, y };
    }

    let moveTween = null;
    function moveMoverDesktop(i, animate = true) {
      const { x, y } = moverXYForDesktop(i);

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

    // Baseline: hide all thoughts (JS reveals active)
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

      chapters.forEach((c) => revealThought(c.querySelector(".thought"), false));
      revealThought(ch.querySelector(".thought"), true);

      applyState(state);

      if (isMobile()) {
        // Dock to thought (moves together)
        ensureMobileDock(i);
      } else {
        // Overlay move
        ensureDesktopHome();
        moveMoverDesktop(i, animateMove);
      }
    }

    // Init first chapter
    const first = chapters[0];
    const firstState = first.dataset.state || "intro";
    chapters.forEach(x => x.classList.toggle("is-active", x === first));
    applyState(firstState);
    revealThought(first.querySelector(".thought"), true);

    if (isMobile()) {
      ensureMobileDock(0);
    } else {
      ensureDesktopHome();
      gsap.set(mover, { x: 0, y: 0 });
      moveMoverDesktop(0, false);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    // Triggers
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

    // Keep correct on refresh/resize
    const onRefresh = () => {
      if (isMobile()) {
        ensureMobileDock(activeIndex);
      } else {
        ensureDesktopHome();
        moveMoverDesktop(activeIndex, false);
      }
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Handle resize crossing breakpoint (mobile <-> desktop)
    let lastMobile = isMobile();
    const onResize = () => {
      const nowMobile = isMobile();
      if (nowMobile !== lastMobile) {
        lastMobile = nowMobile;

        if (nowMobile) {
          // switch to dock mode
          if (moveTween) { moveTween.kill(); moveTween = null; }
          ensureMobileDock(activeIndex);
        } else {
          // switch to overlay mode
          ensureDesktopHome();
          gsap.set(mover, { x: 0, y: 0 });
          moveMoverDesktop(activeIndex, false);
        }
      }

      ScrollTrigger.refresh();
      onRefresh();
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Cleanup hook for PJAX (optional but nice)
    flow.__aboutCleanup = () => {
      try { ScrollTrigger.removeEventListener("refresh", onRefresh); } catch (e) {}

      try {
        ScrollTrigger.getAll()
          .filter(t => t?.vars?.id && String(t.vars.id).startsWith("about-"))
          .forEach(t => t.kill(true));
      } catch (e) {}

      window.removeEventListener("resize", onResize);

      if (poseLoop) { poseLoop.kill(); poseLoop = null; }
      if (moveTween) { moveTween.kill(); moveTween = null; }

      // restore mover inline styles + parent
      if (prevMoverPos.parent && prevMoverPos.parent.appendChild) {
        try { prevMoverPos.parent.appendChild(mover); } catch (e) {}
      }
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
