(() => {
  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Hydejack can swap pages with pushState; run safely multiple times.
  const mount = () => {
    // Avoid duplicating canvas on PJAX nav
    if (document.getElementById("sidebarAmbient")) return;

    // Try common Hydejack sidebar targets (one of these will exist)
    const target =
      document.querySelector("#_sidebar .sidebar-bg") ||
      document.querySelector("#_sidebar") ||
      document.querySelector("aside.sidebar") ||
      document.querySelector(".sidebar");

    if (!target) return;

    // Ensure positioning context
    const style = getComputedStyle(target);
    if (style.position === "static") target.style.position = "relative";

    // Create canvas
    const c = document.createElement("canvas");
    c.id = "sidebarAmbient";
    c.className = "hj-ambient-canvas";
    c.setAttribute("aria-hidden", "true");
    target.prepend(c);

    const ctx = c.getContext("2d", { alpha: true });

    let w = 0, h = 0, dpr = 1;

    const glows = Array.from({ length: 16 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 8 + Math.random() * 18,
      vx: (Math.random() - 0.5) * 0.00045,
      vy: (-0.00015 - Math.random() * 0.00045),
      a: 0.10 + Math.random() * 0.14,
      tw: 0.5 + Math.random() * 1.2,
      t: Math.random() * 1000
    }));

    const resize = () => {
      const rect = target.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      c.style.width = w + "px";
      c.style.height = h + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Pause animation when sidebar not visible
    let paused = false;
    const io = new IntersectionObserver(([e]) => {
      paused = !e.isIntersecting;
    }, { threshold: 0.1 });
    io.observe(target);

    window.addEventListener("resize", resize, { passive: true });
    resize();

    const frame = () => {
      if (!paused) {
        ctx.clearRect(0, 0, w, h);

        // subtle dark wash (doesn't replace your gradient, just enhances)
        const wash = ctx.createLinearGradient(0, 0, 0, h);
        wash.addColorStop(0, "rgba(0,0,0,0.10)");
        wash.addColorStop(1, "rgba(0,0,0,0.28)");
        ctx.fillStyle = wash;
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = "lighter";

        for (const p of glows) {
          p.t += 0.016;
          p.x = (p.x + p.vx + 1) % 1;
          p.y = (p.y + p.vy + 1) % 1;

          const tw = p.a + Math.sin(p.t * p.tw) * 0.04;
          const x = p.x * w, y = p.y * h;

          const rg = ctx.createRadialGradient(x, y, 0, x, y, p.r);
          rg.addColorStop(0, `rgba(140,240,255, ${Math.max(0, tw)})`);
          rg.addColorStop(1, "rgba(140,240,255, 0)");

          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalCompositeOperation = "source-over";
      }

      requestAnimationFrame(frame);
    };

    frame();
  };

  // Run once on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }

  // Hydejack pushState navigation: run after page swaps
  document.addEventListener("hy-push-state-after", mount);
})();
