(() => {
  if (window.__Ocean404) window.__Ocean404.cleanup?.();

  const state = {
    raf: 0,
    ringRaf: 0,
    ctx: null,
    canvas: null,
    plankton: [],
    cleanup: () => {}
  };

  const reduceMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hookAllLoads(cb) {
    document.addEventListener("DOMContentLoaded", cb, { passive: true });
    window.addEventListener("load", cb, { passive: true });
    window.addEventListener("pageshow", cb, { passive: true });

    const ps = document.getElementById("_pushState");
    if (ps) ps.addEventListener("hy-push-state-load", cb, { passive: true });
    document.addEventListener("hy-push-state-load", cb, { passive: true });

    document.addEventListener("turbo:load", cb, { passive: true });
  }

  function clearPlankton(root) {
    if (!root) return;
    root.querySelectorAll(".pl").forEach(n => n.remove());
    state.plankton = [];
  }

  function addPlankton(root, count = 72) {
    const host = root.querySelector(".o404__plankton");
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const W = rect.width || window.innerWidth;
    const H = rect.height || window.innerHeight;

    for (let i = 0; i < count; i++) {
      const d = document.createElement("span");
      d.className = "pl";

      const x = Math.random() * W;
      const y = Math.random() * H;
      const s = 2 + Math.random() * 6;
      const o = 0.18 + Math.random() * 0.55;

      d.style.left = `${x}px`;
      d.style.top = `${y}px`;
      d.style.width = `${s}px`;
      d.style.height = `${s}px`;
      d.style.opacity = o.toFixed(2);

      host.appendChild(d);
      state.plankton.push({ el: d, x, y, s, drift: (Math.random() * 2 - 1) * 0.22, W, H });
    }

    if (reduceMotion()) return;

    let t0 = performance.now();
    const tick = (t) => {
      const dt = Math.min(32, t - t0);
      t0 = t;

      for (const p of state.plankton) {
        p.y -= 0.015 * dt * (0.4 + p.s / 10);
        p.x += p.drift * dt;

        if (p.y < -30) p.y = p.H + 30;
        if (p.x < -30) p.x = p.W + 30;
        if (p.x > p.W + 30) p.x = -30;

        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }

      state.raf = requestAnimationFrame(tick);
    };

    state.raf = requestAnimationFrame(tick);
  }

  function setupBreatheCanvas(root) {
    const c = root.querySelector("#o404Breathe");
    if (!c) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = c.getBoundingClientRect();
    const cssW = rect.width || c.clientWidth || 320;
    const cssH = rect.height || c.clientHeight || 320;

    c.width = Math.floor(cssW * dpr);
    c.height = Math.floor(cssH * dpr);

    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    state.canvas = c;
    state.ctx = ctx;
  }

  function drawRing(t) {
    const ctx = state.ctx;
    const c = state.canvas;
    if (!ctx || !c) return;

    const W = c.clientWidth || 320;
    const H = c.clientHeight || 320;

    ctx.clearRect(0, 0, W, H);

    const cx = W * 0.52;
    const cy = H * 0.52;

    const breathe = 0.5 + 0.5 * Math.sin(t * 0.0013);
    const baseR = Math.min(W, H) * (0.32 + 0.03 * breathe);

    const rings = [
      { r: baseR * 1.00, a: 0.38, w: 2.2 },
      { r: baseR * 1.18, a: 0.22, w: 1.8 },
      { r: baseR * 1.36, a: 0.14, w: 1.4 }
    ];

    ctx.globalCompositeOperation = "lighter";

    for (let k = 0; k < rings.length; k++) {
      const { r, a, w } = rings[k];
      ctx.beginPath();

      const points = 180;
      for (let i = 0; i <= points; i++) {
        const p = i / points;
        const ang = p * Math.PI * 2;

        const wob =
          Math.sin(ang * (6 + k) + t * 0.0016) * (8 - k * 2) +
          Math.sin(ang * (11 + k * 2) - t * 0.0011) * (5 - k) +
          Math.sin(ang * 3 + t * 0.0009) * 3;

        const rr = r + wob * (0.35 + 0.65 * breathe);

        const x = cx + Math.sin(ang) * rr;
        const y = cy + Math.cos(ang) * rr;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const grad = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.55);
      grad.addColorStop(0, `rgba(120,255,240,${a})`);
      grad.addColorStop(0.55, `rgba(110,180,255,${a * 0.9})`);
      grad.addColorStop(1, `rgba(150,120,255,${a * 0.75})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = w;
      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
  }

  function startRing() {
    if (!state.ctx || !state.canvas) return;

    if (reduceMotion()) {
      drawRing(performance.now());
      return;
    }

    const tick = (t) => {
      drawRing(t);
      state.ringRaf = requestAnimationFrame(tick);
    };
    state.ringRaf = requestAnimationFrame(tick);
  }

  function init() {
    const root = document.getElementById("ocean404");
    if (!root) {
      state.cleanup = () => {};
      return;
    }

    state.cleanup?.();

    cancelAnimationFrame(state.raf);
    cancelAnimationFrame(state.ringRaf);
    clearPlankton(root);

    setupBreatheCanvas(root);
    addPlankton(root, reduceMotion() ? 38 : 72);
    startRing();

    let rt;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        cancelAnimationFrame(state.ringRaf);
        setupBreatheCanvas(root);
        startRing();
      }, 140);
    };

    window.addEventListener("resize", onResize, { passive: true });

    state.cleanup = () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(state.raf);
      cancelAnimationFrame(state.ringRaf);
      clearPlankton(root);
    };
  }

  hookAllLoads(init);

  window.__Ocean404 = {
    cleanup: () => state.cleanup()
  };
})();
