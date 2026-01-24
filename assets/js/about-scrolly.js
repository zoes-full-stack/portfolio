/* global gsap, ScrollTrigger, ScrollSmoother */
(() => {
  function init() {
    const scrolly = document.querySelector('.about-scrolly');
    if (!scrolly) return;

    const steps = Array.from(scrolly.querySelectorAll('.about-step'));
    const cards = steps.map(s => s.querySelector('.about-step__card')).filter(Boolean);
    const bean = scrolly.querySelector('#magical-about-bean');
    const depthFill = scrolly.querySelector('.about-depth__fill');

    if (!window.gsap || !window.ScrollTrigger || steps.length === 0) return;

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

    const MOODS = {
      intro: { sea0:'#041823', sea1:'#062837', sea2:'#0b415a', accent:'#beecf4', bean:'#beecf4', glow:'rgba(190,236,244,0.25)' },
      mission:{ sea0:'#031523', sea1:'#07354a', sea2:'#0c4f6c', accent:'#ffb04c', bean:'#d6f3f8', glow:'rgba(255,176,76,0.20)' },
      tidbits:{ sea0:'#031b2a', sea1:'#0a3f3a', sea2:'#0d5a50', accent:'#9ef0d1', bean:'#bff7e3', glow:'rgba(158,240,209,0.22)' },
      curiosities:{ sea0:'#07081d', sea1:'#140b33', sea2:'#24124f', accent:'#c49bff', bean:'#e2d0ff', glow:'rgba(196,155,255,0.22)' },
      cta:{ sea0:'#041823', sea1:'#062837', sea2:'#0b415a', accent:'#ffb04c', bean:'#ffb04c', glow:'rgba(255,176,76,0.24)' },
    };

    function blink() {
      if (!bean) return;
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

    // ✅ IMPORTANT: set initial card visibility BEFORE timeline
    cards.forEach((c, idx) => gsap.set(c, { autoAlpha: idx === 0 ? 1 : 0, y: idx === 0 ? 0 : 10 }));

    // Subtle bean float
    if (bean) {
      gsap.to(bean, {
        y: -10,
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }

    // Pin length tuning
    const pixelsPerStep = window.innerHeight * 1.05;

    const canSnap = steps.length > 1;
    const snapCfg = canSnap
      ? { snapTo: 1 / (steps.length - 1), duration: 0.15, ease: 'power1.inOut' }
      : false;

    // MAIN: pinned scrollytelling timeline
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
          if (depthFill) depthFill.style.transform = `scaleY(${p})`;
        }
      }
    });

    // One card visible at a time
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
