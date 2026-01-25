/* global gsap, ScrollTrigger, ScrollSmoother */
(() => {
  function init() {
    const scrolly = document.querySelector('.about-scrolly');
    if (!scrolly) return;

    const steps = Array.from(scrolly.querySelectorAll('.about-step'));
    const cards = steps.map(s => s.querySelector('.thought')).filter(Boolean);
    const bean = scrolly.querySelector('#magical-about-story-bean');

    if (!window.gsap || !window.ScrollTrigger || steps.length === 0 || !bean) return;

    gsap.registerPlugin(ScrollTrigger);

    // Smooth scroll support (only if ScrollSmoother exists)
    let scrollerEl = null;
    if (window.ScrollSmoother && typeof window.ScrollSmoother.get === 'function') {
      const smoother = window.ScrollSmoother.get();
      if (smoother && typeof smoother.wrapper === 'function') {
        scrollerEl = smoother.wrapper();
      }
    }
    const stBase = scrollerEl ? { scroller: scrollerEl } : {};

    // Kill only OUR old triggers (Hydejack PJAX safe)
    ScrollTrigger.getAll()
      .filter(t => t?.vars?.id && String(t.vars.id).startsWith('about-'))
      .forEach(t => t.kill(true));

    // Kill any old tweens/loops on our bean (extra safety)
    gsap.killTweensOf(bean);

    const MOODS = {
      intro: { sea0:'#041823', sea1:'#062837', sea2:'#0b415a', accent:'#beecf4', bean:'#beecf4', glow:'rgba(190,236,244,0.25)' },
      mission:{ sea0:'#031523', sea1:'#07354a', sea2:'#0c4f6c', accent:'#ffb04c', bean:'#d6f3f8', glow:'rgba(255,176,76,0.20)' },
      tidbits:{ sea0:'#031b2a', sea1:'#0a3f3a', sea2:'#0d5a50', accent:'#9ef0d1', bean:'#bff7e3', glow:'rgba(158,240,209,0.22)' },
      curiosities:{ sea0:'#07081d', sea1:'#140b33', sea2:'#24124f', accent:'#c49bff', bean:'#e2d0ff', glow:'rgba(196,155,255,0.22)' },
      cta:{ sea0:'#041823', sea1:'#062837', sea2:'#0b415a', accent:'#ffb04c', bean:'#ffb04c', glow:'rgba(255,176,76,0.24)' },
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

    function applyPose(state){
      const pose = POSES[state] || POSES.intro;

      // clear prior loop
      if (poseLoop) { poseLoop.kill(); poseLoop = null; }

      // reset wave every time (only intro re-enables)
      gsap.set(bean, { "--armWave": "0deg" });

      // stop any y bob from previous pose
      gsap.killTweensOf(bean, "y");

      // prop toggles
      if (pose.prop) bean.setAttribute("data-prop", pose.prop);
      else bean.removeAttribute("data-prop");

      // tween CSS vars
      gsap.to(bean, {
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
        ...pose.vars
      });

      // loops (only ONE active at a time)
      if (pose.loop === "wave") {
        poseLoop = gsap.to(bean, {
          "--armWave": "12deg",
          duration: 0.9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      } else if (pose.loop === "think") {
        poseLoop = gsap.to(bean, { y:-4, duration:1.2, yoyo:true, repeat:-1, ease:"sine.inOut" });
      } else if (pose.loop === "idle") {
        poseLoop = gsap.to(bean, { y:-8, duration:2.6, yoyo:true, repeat:-1, ease:"sine.inOut" });
      }
    }

    function blink() {
      const e1 = bean.querySelector('#eye1');
      const e2 = bean.querySelector('#eye2');
      if (!e1 || !e2) return;

      gsap.fromTo([e1, e2], { scaleY: 1 }, {
        scaleY: 0.08,
        transformOrigin: '50% 50%',
        duration: 0.08,
        yoyo: true,
        repeat: 1,
        repeatDelay: 0.06,
        ease: 'power1.inOut',
        overwrite: true
      });
    }

    function setMood(state) {
      const mood = MOODS[state] || MOODS.intro;
      scrolly.dataset.active = state;

      applyPose(state);

      gsap.to(scrolly, {
        '--sea-0': mood.sea0,
        '--sea-1': mood.sea1,
        '--sea-2': mood.sea2,
        '--accent': mood.accent,
        '--bean': mood.bean,
        '--glow': mood.glow,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      blink();
    }

    function setActiveIndex(i) {
      steps.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
      const state = steps[i]?.dataset?.state || 'intro';
      setMood(state);
    }

    // Initial card visibility BEFORE timeline
    cards.forEach((c, idx) => gsap.set(c, { autoAlpha: idx === 0 ? 1 : 0, y: idx === 0 ? 0 : 10 }));

    const pixelsPerStep = window.innerHeight * 1.05;

    const canSnap = steps.length > 1;
    const snapCfg = canSnap
      ? { snapTo: 1 / (steps.length - 1), duration: 0.15, ease: 'power1.inOut' }
      : false;

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        ...stBase,
        id: 'about-pin',
        trigger: scrolly,
        start: 'top top',
        end: () => `+=${steps.length * pixelsPerStep}`,
        snap: snapCfg,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          const p = self.progress;
          scrolly.style.setProperty('--scroll-progress', p.toFixed(4));
        }
      }
    });

    const seg = 1;
    steps.forEach((step, i) => {
      const card = cards[i];

      tl.call(() => setActiveIndex(i), null, i * seg);

      if (card) {
        tl.to(card, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, i * seg + 0.05);

        if (i > 0 && cards[i - 1]) {
          tl.to(cards[i - 1], { autoAlpha: 0, y: 10, duration: 0.18, ease: 'power2.inOut' }, i * seg + 0.02);
        }
      }
    });

    setActiveIndex(0);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('hy-push-state-after', init);
  window.addEventListener('hy-push-state-ready', init);
})();
