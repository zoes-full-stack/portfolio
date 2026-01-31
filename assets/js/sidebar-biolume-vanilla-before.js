(() => {
  // ====== Hydejack Sidebar Biolume (Pure JS Canvas) ======
  // - Deep sea gradient + haze + depth specks
  // - Flow-field phytoplankton with hover glow
  // - Sparse dev.to-inspired jellyfish (squish + tentacle beads) + gentle trails
  // - Slow sperm whale on dblclick / press-hold
  // - Collision avoidance vs per-line text rects (no full-width blocks)
  // - NEW: Eddy flow around text (tangential swirl + gentle repulsion)
  // - Spawn-safe: phyto + jellies spawn outside text/icon bounds

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // ----------------- Tunables -----------------
  const CFG = {
    dprCap: 1.6,

    // BACKGROUND / DEPTH
    hazeCountMin: 3,
    hazeCountMax: 9,
    causticStrength: 0.008, // keep subtle to avoid flicker

    // FLOW FIELD
    flowScale: 220,
    flowStrength: 0.50,
    flowTime: 0.0007,

    // PHYTOPLANKTON
    phytoDensity: 0.3,
    phytoMinR: 0.6,
    phytoMaxR: 5.0,
    phytoBaseAlpha: [0.05, 0.16],
    phytoDrift: 0.35,
    phytoHoverRadius: 120,
    phytoHoverBoost: 2.5,
    phytoGlowBoost: 1.5,

    // Depth layer specks (far)
    depthDensity: 0.55,
    depthAlpha: 0.03,
    depthMinR: 0.5,
    depthMaxR: 1.0,
    depthDrift: 0.25,

    // WAKE (pointer + jelly trails)
    wakeMax: 40,
    wakeSpawnEveryPx: 90,
    wakeLife: 0.8,
    wakeSize: 22,
    wakeStrength: 1.0,
    jellyTrailEveryPx: 40,
    jellyTrailStrength: 0.2,

    // JELLYFISH
    jellyCount: [1, 2],
    jellySize: [5, 40],
    jellySpeed: [6, 20],
    jellyGlow: 0.05,
    jellyAvoidPad: 10,

    // WHALE
    whaleHoldMs: 520,
    whaleLifetime: 10.5,
    whaleSpeed: [4, 7],
    whaleCooldownMs: 0,

    // COLLISIONS (hard contact)
    obstaclePadding: 12,
    obstacleRefreshMs: 450,
    bounce: 0.55,
    damping: 0.9,

    // FLOW AROUND TEXT (soft current)
    repulsion: {
      enabled: true,
      radius: 95,          // how far the text "pressure field" reaches
      strength: 0.90,      // radial push away
      power: 2.2,          // falloff curve
      maxPush: 2.3,        // clamp per-frame push
      swirlStrength: 0.95, // tangential eddy amount
      swirlTime: 0.35,     // how fast eddy direction drifts
      swirlScale: 260,     // noise scale for swirl direction
    },

    // Spawn safety
    spawn: {
      tries: 60,
      padExtra: 10,        // extra padding beyond obstaclePadding
    },

    debug: {
      enabled: false,
      showForMs: 6000,
      stroke: "rgba(255, 80, 120, 0.8)",
      fill: "rgba(255, 80, 120, 0.10)",
      label: "rgba(255,255,255,0.85)",
    },
  };

  // ----------------- Utils -----------------
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const rand = (a, b) => a + Math.random() * (b - a);
  const lerp = (a, b, t) => a + (b - a) * t;

  // Small smooth noise (no libs): hash -> value noise -> smoothstep interp
  const fract = (x) => x - Math.floor(x);
  const hash2 = (x, y) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
  const smooth = (t) => t * t * (3 - 2 * t);

  const valueNoise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;

    const v00 = hash2(xi, yi);
    const v10 = hash2(xi + 1, yi);
    const v01 = hash2(xi, yi + 1);
    const v11 = hash2(xi + 1, yi + 1);

    const u = smooth(xf);
    const v = smooth(yf);

    const a = v00 + (v10 - v00) * u;
    const b = v01 + (v11 - v01) * u;
    return a + (b - a) * v;
  };

  const flowAngle = (x, y, t, scale) => {
    const nx = x / scale, ny = y / scale;
    const n1 = valueNoise(nx + t * 0.6, ny + t * 0.4);
    const n2 = valueNoise(nx - t * 0.3, ny + t * 0.7);
    const n = n1 * 0.65 + n2 * 0.35;
    return n * Math.PI * 2;
  };

  // ----------------- Hydejack host + mount -----------------
  const getHost = () =>
    document.querySelector("#_sidebar .sidebar-bg") ||
    document.querySelector("#_sidebar") ||
    document.querySelector("aside.sidebar") ||
    document.querySelector(".sidebar");

  const ensureMount = (host) => {
    let mount = document.getElementById("sidebar-biolume");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "sidebar-biolume";
      Object.assign(mount.style, {
        position: "absolute",
        inset: "0",
        zIndex: "0",
        pointerEvents: "none",
      });
      host.prepend(mount);
    }
    return mount;
  };

  // Prevent multiple instances across push-state
  if (window.__biolumeSidebarCleanup) {
    try { window.__biolumeSidebarCleanup(); } catch (e) {}
    window.__biolumeSidebarCleanup = null;
  }

  // ----------------- Obstacles (tight per line/item) -----------------
  let debugUntil = 0;
  let obstacles = [];
  let lastObstacleMeasure = 0;

  const collectObstacleNodes = () => {
    const nodes = [];

    // Title
    const title = document.querySelector(".sidebar-title");
    if (title) nodes.push({ el: title, mode: "text" });

    // Tagline
    const sidebarTagline = document.querySelector(".sidebar-about p");
    if (sidebarTagline) nodes.push({ el: sidebarTagline, mode: "text" });

    // Avatar (uncomment if you want particles to avoid the avatar too)
    // const avatar = document.querySelector(".sidebar-about img");
    // if (avatar) nodes.push({ el: avatar, mode: "box" });

    // Nav items
    const navA =
      document.querySelectorAll(".sidebar-nav ul li a.sidebar-nav-item").length
        ? document.querySelectorAll(".sidebar-nav ul li a.sidebar-nav-item")
        : document.querySelectorAll(".sidebar-nav ul li a");

    navA.forEach((a) => nodes.push({ el: a, mode: "text" }));

    // Social icons (anchors)
    document.querySelectorAll(".sidebar-social ul a").forEach((a) => {
      nodes.push({ el: a, mode: "box" });
    });

    return nodes;
  };

  const rectsFor = (entry) => {
    const el = entry.el;
    const mode = entry.mode;

    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return [];

    if (mode === "box") {
      const r = el.getBoundingClientRect();
      return r.width > 2 && r.height > 2 ? [r] : [];
    }

    // Text mode: per line rects
    const rects = [];
    const range = document.createRange();
    range.selectNodeContents(el);

    for (const rr of Array.from(range.getClientRects())) {
      if (rr.width > 2 && rr.height > 2) rects.push(rr);
    }
    range.detach?.();

    if (!rects.length) {
      const r = el.getBoundingClientRect();
      if (r.width > 2 && r.height > 2) rects.push(r);
    }

    return rects;
  };

  const padRect = (r, pad) => ({
    x: r.x - pad,
    y: r.y - pad,
    w: r.w + pad * 2,
    h: r.h + pad * 2,
  });

  const refreshObstacles = (mountEl, W, H, force = false) => {
    const now = performance.now();
    if (!force && now - lastObstacleMeasure < CFG.obstacleRefreshMs) return;
    lastObstacleMeasure = now;

    const mountRect = mountEl.getBoundingClientRect();
    const nodes = collectObstacleNodes();

    const rects = [];
    for (const entry of nodes) {
      for (const rr of rectsFor(entry)) {
        const x = rr.left - mountRect.left;
        const y = rr.top - mountRect.top;

        if (x + rr.width < 0 || y + rr.height < 0 || x > W || y > H) continue;

        rects.push(
          padRect(
            { x, y, w: rr.width, h: rr.height },
            CFG.obstaclePadding
          )
        );
      }
    }

    obstacles = rects;
  };

  // Circle vs AABB collision response (hard contact bounce)
  const resolveCircleAABB = (c) => {
    for (const o of obstacles) {
      const nx = clamp(c.x, o.x, o.x + o.w);
      const ny = clamp(c.y, o.y, o.y + o.h);
      const dx = c.x - nx;
      const dy = c.y - ny;
      const d2 = dx * dx + dy * dy;

      if (d2 < c.r * c.r) {
        const d = Math.max(0.0001, Math.sqrt(d2));
        const ux = dx / d;
        const uy = dy / d;

        const push = (c.r - d) + 0.6;
        c.x += ux * push;
        c.y += uy * push;

        const vn = c.vx * ux + c.vy * uy;
        if (vn < 0) {
          c.vx -= (1 + CFG.bounce) * vn * ux;
          c.vy -= (1 + CFG.bounce) * vn * uy;
          c.vx *= CFG.damping;
          c.vy *= CFG.damping;
        }
      }
    }
  };

  // Debug boxes
  const drawDebugObstacles = (ctx, nowMs) => {
    if (!CFG.debug?.enabled) return;
    if (CFG.debug.showForMs > 0 && nowMs > debugUntil) return;
    if (!obstacles?.length) return;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(10, 10, 210, 22);
    ctx.fillStyle = CFG.debug.label;
    ctx.fillText(`obstacles: ${obstacles.length}`, 18, 26);

    ctx.lineWidth = 1.25;
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      ctx.fillStyle = CFG.debug.fill;
      ctx.strokeStyle = CFG.debug.stroke;

      const r = 6;
      ctx.beginPath();
      ctx.moveTo(o.x + r, o.y);
      ctx.arcTo(o.x + o.w, o.y, o.x + o.w, o.y + o.h, r);
      ctx.arcTo(o.x + o.w, o.y + o.h, o.x, o.y + o.h, r);
      ctx.arcTo(o.x, o.y + o.h, o.x, o.y, r);
      ctx.arcTo(o.x, o.y, o.x + o.w, o.y, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = CFG.debug.label;
      ctx.fillText(`#${i}`, o.x + 6, o.y + 14);
    }

    ctx.restore();
  };

  // ----------------- Main mount -----------------
  let cleanup = null;

  const mount = () => {
    const host = getHost();
    if (!host) return;

    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    const mountEl = ensureMount(host);

    if (cleanup) cleanup();

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, { width: "100%", height: "100%", display: "block" });
    mountEl.replaceChildren(canvas);

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

    let W = 0, H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, CFG.dprCap);

    // Pointer
    const pointer = {
      x: 0, y: 0,
      active: false,
      strength: 0,
      lastWakeX: null, lastWakeY: null,
    };

    const setPointer = (clientX, clientY, boost = 0.6) => {
      const rect = mountEl.getBoundingClientRect();
      pointer.x = clamp(clientX - rect.left, 0, W);
      pointer.y = clamp(clientY - rect.top, 0, H);
      pointer.active = true;
      pointer.strength = Math.max(pointer.strength, boost);
    };

    const onMove = (e) => setPointer(e.clientX, e.clientY, 0.7);
    const onDown = (e) => setPointer(e.clientX, e.clientY, 1.0);
    const onLeave = () => (pointer.active = false);

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onDown, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });

    // Whale spawn triggers
    let holdTimer = 0;
    let lastWhaleAt = 0;

    const whale = {
      active: false,
      t: 0,
      x: 0,
      y: 0,
      dir: 1,
      scale: 0.8,
      speed: 5,
      wobble: 0.18,
      alpha: 0,
    };

    const spawnWhale = () => {
      const now = Date.now();
      if (CFG.whaleCooldownMs > 0 && now - lastWhaleAt < CFG.whaleCooldownMs) return;
      lastWhaleAt = now;

      whale.active = true;
      whale.t = 0;
      whale.dir = Math.random() < 0.5 ? 1 : -1;
      whale.y = rand(H * 0.26, H * 0.62);
      whale.scale = rand(0.62, 0.95);
      whale.x = whale.dir === 1 ? -W * 0.35 : W * 1.35;
      whale.speed = rand(CFG.whaleSpeed[0], CFG.whaleSpeed[1]);
      whale.wobble = rand(0.11, 0.18);
      whale.alpha = 0;
    };

    const onPointerDownForHold = () => {
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => spawnWhale(), CFG.whaleHoldMs);
    };
    const onPointerUpForHold = () => clearTimeout(holdTimer);
    const onDblClick = () => spawnWhale();

    host.addEventListener("pointerdown", onPointerDownForHold, { passive: true });
    host.addEventListener("pointerup", onPointerUpForHold, { passive: true });
    host.addEventListener("pointercancel", onPointerUpForHold, { passive: true });
    host.addEventListener("dblclick", onDblClick, { passive: true });

    // Colors
    const SEA_TOP = "rgba(5, 22, 36, 1)";
    const SEA_MID = "rgba(6, 44, 60, 1)";
    const SEA_BOT = "rgba(3, 14, 24, 1)";

    // Scene state
    let haze = [];
    let depth = [];
    let phyto = [];
    let jellies = [];
    let wake = [];

    let causticT = rand(0, 1000);
    let flowT = rand(0, 1000);
    let swirlT = rand(0, 1000);

    let sceneBuilt = false;
    let bootToken = 0;

    const scalePoints = (arr, sx, sy) => {
      for (const p of arr) {
        if (typeof p.x === "number") p.x *= sx;
        if (typeof p.y === "number") p.y *= sy;
      }
    };

    const scaleObstacles = (arr, sx, sy) => {
      for (const o of arr) {
        o.x *= sx; o.y *= sy;
        o.w *= sx; o.h *= sy;
      }
    };

    // ------------ Eddy flow around obstacles (soft current) ------------
    const pointInsideRect = (x, y, r) =>
      x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

    const isInsideAnyObstacle = (x, y, pad = 0) => {
      for (const o of obstacles) {
        const r = { x: o.x - pad, y: o.y - pad, w: o.w + pad * 2, h: o.h + pad * 2 };
        if (pointInsideRect(x, y, r)) return true;
      }
      return false;
    };

    const randomPointOutsideObstacles = (pad = 0) => {
      for (let i = 0; i < CFG.spawn.tries; i++) {
        const x = rand(0, W);
        const y = rand(0, H);
        if (!isInsideAnyObstacle(x, y, pad)) return { x, y };
      }
      // fallback: outer edge
      return { x: rand(0, W), y: rand(H * 0.85, H) };
    };

    // --- Corner-weighted eddy flow around obstacles (soft current) ---
    const closestPointRect = (x, y, r) => {
        const cx = clamp(x, r.x, r.x + r.w);
        const cy = clamp(y, r.y, r.y + r.h);
        return { cx, cy };
    };

    const cornerInfluence = (r, cx, cy) => {
        // Influence grows as the closest point approaches a corner.
        const corners = [
            [r.x, r.y],
            [r.x + r.w, r.y],
            [r.x, r.y + r.h],
            [r.x + r.w, r.y + r.h],
        ];

        let minD = Infinity;
        for (const [px, py] of corners) {
            const dx = cx - px;
            const dy = cy - py;
            minD = Math.min(minD, Math.hypot(dx, dy));
        }

        // Corner radius: scales with rect size, with a small floor
        const cornerR = Math.max(14, Math.min(r.w, r.h) * 0.22);
        return clamp(1 - minD / cornerR, 0, 1); // 0..1
    };

    const applyObstacleEddy = (obj, effectiveRadius, dt, mult = 1) => {
        const Rbase = CFG.repulsion?.radius ?? 90;
        if (!CFG.repulsion?.enabled || !obstacles?.length) return;

        const R = (Rbase + effectiveRadius) || 90;
        const R2 = R * R;

        let pushX = 0;
        let pushY = 0;

        // slow drift in swirl direction
        swirlT += (CFG.repulsion.swirlTime ?? 0.35) * dt;

        for (const o of obstacles) {
            const pad = CFG.obstaclePadding + (CFG.spawn?.padExtra || 0);
            const r = { x: o.x - pad, y: o.y - pad, w: o.w + pad * 2, h: o.h + pad * 2 };

            const { cx, cy } = closestPointRect(obj.x, obj.y, r);
            const dx = obj.x - cx;
            const dy = obj.y - cy;
            const d2 = dx * dx + dy * dy;

            if (d2 < R2) {
            const d = Math.max(0.001, Math.sqrt(d2));
            const ux = dx / d;
            const uy = dy / d;

            const t = 1 - d / R; // 0..1
            const eased = Math.pow(t, CFG.repulsion.power ?? 2);

            // Radial push (keeps things readable)
            const radial = eased * (CFG.repulsion.strength ?? 0.9) * mult;

            // Corner weighting:
            // - along long edges: swirl is gentler
            // - near corners: swirl ramps up (looks like flowing around text blocks)
            const ci = cornerInfluence(r, cx, cy); // 0..1
            const edgeSwirlMul = 0.55;
            const cornerSwirlMul = 1.35;
            const swirlMul = lerp(edgeSwirlMul, cornerSwirlMul, ci);

            // CW/CCW choice via noise (organic variation)
            const ns = CFG.repulsion.swirlScale ?? 260;
            const n = valueNoise((obj.x + o.x) / ns + swirlT, (obj.y + o.y) / ns - swirlT);
            const dir = (n < 0.5) ? -1 : 1;

            const tx = -uy * dir;
            const ty =  ux * dir;

            const swirl = eased * (CFG.repulsion.swirlStrength ?? 0.9) * swirlMul * mult;

            pushX += ux * radial + tx * swirl;
            pushY += uy * radial + ty * swirl;
            }
        }

        // Clamp for stability
        const mag = Math.hypot(pushX, pushY);
        const maxPush = CFG.repulsion.maxPush ?? 2.2;
        if (mag > maxPush) {
            pushX = (pushX / mag) * maxPush;
            pushY = (pushY / mag) * maxPush;
        }

        // Apply as gentle position nudge + slight velocity steering
        obj.x += pushX * dt * 60;
        obj.y += pushY * dt * 60;

        if (typeof obj.vx === "number") obj.vx += pushX * 0.18;
        if (typeof obj.vy === "number") obj.vy += pushY * 0.18;
    };

    // ----------------- Builders -----------------
    const buildScene = () => {
      // Update obstacles BEFORE spawning so we spawn safe
      refreshObstacles(mountEl, W, H, true);

      // Haze blobs
      const hazeCount = clamp(Math.floor((W * H) / 130000), CFG.hazeCountMin, CFG.hazeCountMax);
      haze = Array.from({ length: hazeCount }, () => ({
        x: rand(-W * 0.2, W * 1.2),
        y: rand(0, H),
        r: rand(Math.min(W, H) * 0.26, Math.min(W, H) * 0.58),
        a: rand(0.028, 0.060),
        vx: rand(-0.03, 0.03),
        vy: rand(-0.02, 0.02),
        t: rand(0, Math.PI * 2),
        tw: rand(0.0012, 0.0035),
      }));

      // Far depth specks
      const depthCount = clamp(Math.floor(((W * H) / 3800) * CFG.depthDensity), 120, 520);
      depth = Array.from({ length: depthCount }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(CFG.depthMinR, CFG.depthMaxR),
        a: rand(CFG.depthAlpha * 0.5, CFG.depthAlpha),
        vx: rand(-0.02, 0.02),
        vy: rand(0.02, 0.08),
        t: rand(0, Math.PI * 2),
        tw: rand(0.3, 1.0),
        p: rand(0.7, 1.2),
      }));

      // Phytoplankton (near)
      const base = (W * H) / 2150;
      const count = clamp(Math.floor(base * CFG.phytoDensity), 280, 1400);

      phyto = Array.from({ length: count }, () => {
        const p = {
          x: 0,
          y: 0,
          r: rand(CFG.phytoMinR, CFG.phytoMaxR),
          a: rand(CFG.phytoBaseAlpha[0], CFG.phytoBaseAlpha[1]),
          vx: 0,
          vy: 0,
          heat: 0,
          t: rand(0, Math.PI * 2),
          tw: rand(0.8, 1.8),
          p: rand(0.7, 1.4),
        };
        const pt = randomPointOutsideObstacles(CFG.obstaclePadding + CFG.spawn.padExtra + p.r * 6);
        p.x = pt.x;
        p.y = pt.y;
        return p;
      });

      // Jellyfish
      const jellyN = clamp(Math.round(Math.min(W, H) / 280), CFG.jellyCount[0], CFG.jellyCount[1]);
      jellies = Array.from({ length: jellyN }, () => makeJelly());

      // Wake reset
      wake = [];
      pointer.lastWakeX = pointer.lastWakeY = null;

      debugUntil = performance.now() + (CFG.debug?.showForMs ?? 0);
    };

    const makeJelly = () => {
      const R = rand(CFG.jellySize[0], CFG.jellySize[1]);
      const dir = Math.random() < 0.5 ? 1 : -1;

      const pad = CFG.obstaclePadding + CFG.spawn.padExtra + R * 3.2;
      const pt = randomPointOutsideObstacles(pad);

      return {
        x: pt.x,
        y: pt.y,
        r: R,
        dir,
        vx: dir * rand(CFG.jellySpeed[0], CFG.jellySpeed[1]),
        vy: rand(-2, 2),
        t: rand(0, Math.PI * 2),
        pulse: rand(0, Math.PI * 2),
        pulseSpd: rand(1.0, 1.8),
        wiggleSpd: rand(0.9, 1.4),
        glow: rand(0.85, 1.15),
        heat: 0,

        lastTrailX: null,
        lastTrailY: null,

        tentacles: Math.floor(rand(7, 12)),
        beads: Math.floor(rand(10, 16)),
      };
    };

    // ----------------- Resize -----------------
    const resize = () => {
      const r = mountEl.getBoundingClientRect();
      const w = Math.floor(r.width);
      const h = Math.floor(r.height);
      if (w < 10 || h < 10) return false;

      if (sceneBuilt && w === W && h === H) return true;

      const oldW = W || w;
      const oldH = H || h;

      W = w;
      H = h;

      dpr = Math.min(window.devicePixelRatio || 1, CFG.dprCap);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // refresh obstacle boxes on resize
      refreshObstacles(mountEl, W, H, true);

      if (!sceneBuilt) {
        buildScene();
        sceneBuilt = true;
      } else {
        const sx = W / oldW;
        const sy = H / oldH;

        scalePoints(phyto, sx, sy);
        scalePoints(jellies, sx, sy);
        scalePoints(haze, sx, sy);
        scalePoints(depth, sx, sy);
        scalePoints(wake, sx, sy);

        if (Array.isArray(obstacles)) scaleObstacles(obstacles, sx, sy);

        // After scaling, ensure nothing sits inside obstacles
        for (const p of phyto) {
          const c = { x: p.x, y: p.y, r: p.r + 2, vx: p.vx, vy: p.vy };
          resolveCircleAABB(c);
          p.x = c.x; p.y = c.y;
        }
        for (const j of jellies) {
          const c = { x: j.x, y: j.y, r: j.r * 1.3 + CFG.jellyAvoidPad, vx: 0, vy: 0 };
          resolveCircleAABB(c);
          j.x = c.x; j.y = c.y;
        }
      }

      return true;
    };

    let ro = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => resize());
      ro.observe(mountEl);
    }

    const localToken = ++bootToken;

    const init = async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (localToken !== bootToken) return;

      const ok1 = resize();
      if (!ok1) return setTimeout(init, 120);

      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (localToken !== bootToken) return;

      const w2 = Math.floor(mountEl.getBoundingClientRect().width);
      const h2 = Math.floor(mountEl.getBoundingClientRect().height);
      if (Math.abs(w2 - W) > 1 || Math.abs(h2 - H) > 1) return setTimeout(init, 120);
    };

    init();

    // ----------------- Wake -----------------
    const addWakePoint = (x, y, strength, sizeMul = 1) => {
      wake.push({
        x,
        y,
        a: 0,
        age: 0,
        life: CFG.wakeLife,
        s: strength,
        r: rand(CFG.wakeSize * 0.7, CFG.wakeSize * 1.2) * sizeMul,
        driftX: rand(-0.6, 0.6),
        driftY: rand(-0.2, 0.9),
      });
      if (wake.length > CFG.wakeMax) wake.splice(0, wake.length - CFG.wakeMax);
    };

    const updateWake = (dt) => {
      // pointer wake
      if (pointer.active) {
        if (pointer.lastWakeX == null) {
          pointer.lastWakeX = pointer.x;
          pointer.lastWakeY = pointer.y;
        }

        const dx = pointer.x - pointer.lastWakeX;
        const dy = pointer.y - pointer.lastWakeY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist >= CFG.wakeSpawnEveryPx) {
          const steps = Math.floor(dist / CFG.wakeSpawnEveryPx);
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            addWakePoint(
              pointer.lastWakeX + dx * t,
              pointer.lastWakeY + dy * t,
              CFG.wakeStrength * pointer.strength,
              1.0
            );
          }
          pointer.lastWakeX = pointer.x;
          pointer.lastWakeY = pointer.y;
        }
      } else {
        pointer.lastWakeX = pointer.lastWakeY = null;
      }

      // age + drift
      for (let i = wake.length - 1; i >= 0; i--) {
        const w = wake[i];
        w.age += dt;
        const t = clamp(w.age / w.life, 0, 1);
        w.a = (1 - t) * (0.18 + 0.55 * w.s);

        w.x += w.driftX * dt * 16;
        w.y += w.driftY * dt * 16;

        if (t >= 1) wake.splice(i, 1);
      }
    };

    const drawWake = () => {
      if (!wake.length) return;
      ctx.globalCompositeOperation = "lighter";

      for (const w of wake) {
        const g = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
        g.addColorStop(0, `rgba(230, 255, 255, ${w.a})`);
        g.addColorStop(0.35, `rgba(110, 235, 255, ${w.a * 0.55})`);
        g.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ----------------- Draw: Background & depth -----------------
    const drawBackground = () => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, SEA_TOP);
      g.addColorStop(0.55, SEA_MID);
      g.addColorStop(1, SEA_BOT);

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const v = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, "rgba(0,0,0,0.40)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);
    };

    const drawHaze = (dt) => {
      ctx.globalCompositeOperation = "screen";

      for (const h of haze) {
        h.t += h.tw * dt * 60;
        const tw = 0.55 + 0.45 * Math.sin(h.t);

        h.x += h.vx * dt * 60;
        h.y += h.vy * dt * 60;

        if (h.x < -W * 0.6) h.x = W * 1.3;
        if (h.x > W * 1.35) h.x = -W * 0.5;
        if (h.y < -H * 0.1) h.y = H * 1.1;
        if (h.y > H * 1.1) h.y = -H * 0.1;

        const alpha = h.a * tw;
        const fog = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.r);
        fog.addColorStop(0, `rgba(80, 210, 255, ${alpha})`);
        fog.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = fog;
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
        ctx.fill();
      }

      causticT += 0.0021 * dt * 60;
      const shimmer = (CFG.causticStrength * 0.8) + CFG.causticStrength * 0.6 * Math.sin(causticT);
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = `rgba(120, 220, 255, ${shimmer})`;
      ctx.fillRect(0, 0, W, H);
    };

    const drawDepth = (dt) => {
      ctx.globalCompositeOperation = "lighter";

      for (const d of depth) {
        d.t += dt * d.tw;
        d.x += d.vx * dt * 60 * CFG.depthDrift;
        d.y += d.vy * dt * 60 * CFG.depthDrift;

        if (d.y > H + 6) { d.y = -6; d.x = rand(0, W); }
        if (d.x < -6) d.x = W + 6;
        if (d.x > W + 6) d.x = -6;

        const tw = 0.6 + 0.4 * Math.sin(d.t);
        const a = d.a * tw;

        ctx.fillStyle = `rgba(135, 235, 235, ${a})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ----------------- Phyto -----------------
    const drawPhyto = (dt) => {
      ctx.globalCompositeOperation = "lighter";
      flowT += CFG.flowTime * dt * 60;

      const hoverR = CFG.phytoHoverRadius;
      const hoverR2 = hoverR * hoverR;

      for (const p of phyto) {
        const ang = flowAngle(p.x, p.y, flowT, CFG.flowScale);
        const fx = Math.cos(ang) * CFG.flowStrength;
        const fy = Math.sin(ang) * CFG.flowStrength;

        p.vx = lerp(p.vx, fx, 0.08);
        p.vy = lerp(p.vy, fy, 0.08);

        p.t += dt * p.tw;
        const wig = Math.sin(p.t * 2.2) * 0.09;

        const speed = CFG.phytoDrift * (0.65 + p.p * 0.35);
        p.x += (p.vx + wig) * dt * 60 * speed;
        p.y += (p.vy + 0.10) * dt * 60 * speed;

        // wrap
        if (p.y > H + 6) {
          const pt = randomPointOutsideObstacles(CFG.obstaclePadding + CFG.spawn.padExtra + p.r * 6);
          p.y = -6; p.x = pt.x;
        }
        if (p.x < -6) p.x = W + 6;
        if (p.x > W + 6) p.x = -6;

        // hover heat
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < hoverR2) {
            const influence = 1 - d2 / hoverR2;
            p.heat = Math.max(p.heat, influence * CFG.phytoHoverBoost * pointer.strength);
          }
        }
        p.heat *= Math.pow(0.90, dt * 60);

        // NEW: eddy flow around text (soft current)
        applyObstacleEddy(p, p.r * 3.0, dt, 1.0);

        // Hard contact bounce as last resort
        const c = { x: p.x, y: p.y, r: p.r + 1.6, vx: p.vx, vy: p.vy };
        resolveCircleAABB(c);
        p.x = c.x; p.y = c.y; p.vx = c.vx; p.vy = c.vy;

        // brightness
        const shimmer = 0.55 + 0.45 * Math.sin(p.t * 2.6);
        const baseA = p.a * shimmer;
        const a = baseA * (1 + p.heat * 0.7);

        const glowR = p.r * (2.8 + p.heat * 2.7) * CFG.phytoGlowBoost;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        g.addColorStop(0, `rgba(230, 255, 255, ${a * (0.34 + p.heat * 0.18)})`);
        g.addColorStop(0.35, `rgba(110, 235, 255, ${a * 0.45})`);
        g.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(235, 255, 255, ${clamp(a * 0.55, 0, 0.86)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ----------------- Jellyfish -----------------
    const maybeJellyTrail = (j) => {
      if (j.lastTrailX == null) {
        j.lastTrailX = j.x;
        j.lastTrailY = j.y;
        return;
      }
      const dx = j.x - j.lastTrailX;
      const dy = j.y - j.lastTrailY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= CFG.jellyTrailEveryPx) {
        const steps = Math.floor(dist / CFG.jellyTrailEveryPx);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          addWakePoint(
            j.lastTrailX + dx * t,
            j.lastTrailY + dy * t,
            CFG.jellyTrailStrength,
            0.9
          );
        }
        j.lastTrailX = j.x;
        j.lastTrailY = j.y;
      }
    };

    const updateAndDrawJellies = (dt) => {
      ctx.globalCompositeOperation = "lighter";

      for (const j of jellies) {
        j.t += dt;
        j.pulse += dt * j.pulseSpd;
        const pulse = Math.sin(j.pulse);

        // squish (X/Y opposite)
        const squish = pulse * 0.09;
        const sx = 1 + squish;
        const sy = 1 - squish * 0.7;

        // motion
        const ang = flowAngle(j.x, j.y, flowT * 0.85, CFG.flowScale * 1.15);
        const fx = Math.cos(ang) * 0.6;
        const fy = Math.sin(ang) * 0.6;

        const swim = (0.7 + 0.3 * (0.5 + 0.5 * pulse));
        j.x += (j.vx * swim + fx * 18) * dt * 0.38;
        j.y += (j.vy + Math.sin(j.t * j.wiggleSpd) * 6 + fy * 12) * dt * 0.22;

        // wrap with spawn-safe re-entry
        if (j.x < -j.r * 3 || j.x > W + j.r * 3 || j.y < -j.r * 3 || j.y > H + j.r * 3) {
          const pt = randomPointOutsideObstacles(CFG.obstaclePadding + CFG.spawn.padExtra + j.r * 3.2);
          j.x = pt.x;
          j.y = pt.y;
          j.lastTrailX = j.lastTrailY = null;
        }

        // hover heat
        if (pointer.active) {
          const dx = j.x - pointer.x;
          const dy = j.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const r = 220;
          if (d2 < r * r) {
            const influence = 1 - d2 / (r * r);
            j.heat = Math.max(j.heat, influence * 1.4 * pointer.strength);
          }
        }
        j.heat *= Math.pow(0.92, dt * 60);

        // NEW: eddy flow around text (stronger than phyto)
        applyObstacleEddy(j, j.r * 3.8, dt, 1.25);

        // Hard contact correction only (keep glide)
        const bellR = j.r * 1.15 + CFG.jellyAvoidPad;
        const c = { x: j.x, y: j.y, r: bellR, vx: j.vx * 0.02, vy: j.vy * 0.02 };
        resolveCircleAABB(c);
        j.x = c.x; j.y = c.y;

        // trail
        maybeJellyTrail(j);

        // glow halo
        const heat = j.heat;
        const haloR = j.r * 3.8 * (1 + heat * 0.18);
        const halo = ctx.createRadialGradient(j.x, j.y, 0, j.x, j.y, haloR);
        halo.addColorStop(0, `rgba(110, 235, 255, ${0.20 + heat * 0.40})`);
        halo.addColorStop(0.25, `rgba(180, 255, 255, ${0.10 + heat * 0.22})`);
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(j.x, j.y, haloR, 0, Math.PI * 2);
        ctx.fill();

        // bell
        ctx.save();
        ctx.translate(j.x, j.y);
        ctx.scale(sx, sy);

        const R = j.r;
        const bellG = ctx.createRadialGradient(0, -R * 0.35, 0, 0, -R * 0.35, R * 1.35);
        bellG.addColorStop(0, `rgba(255,255,255, 0.90)`);
        bellG.addColorStop(0.55, `rgba(180,255,255, ${0.66 + heat * 0.18})`);
        bellG.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bellG;

        ctx.beginPath();
        ctx.moveTo(-R * 1.02, 0);
        ctx.bezierCurveTo(-R * 1.05, -R * 1.05, R * 1.05, -R * 1.05, R * 1.02, 0);
        ctx.bezierCurveTo(R * 0.75, R * 0.45, -R * 0.75, R * 0.45, -R * 1.02, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = `rgba(255,255,255, ${0.16 + heat * 0.36})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-R * 1.02, 0);
        ctx.bezierCurveTo(-R * 1.02, -R * 0.75, R * 1.02, -R * 0.75, R * 1.02, 0);
        ctx.stroke();

        // tentacles + beads
        const baseY = R * 0.28;
        for (let t = 0; t < j.tentacles; t++) {
          const off = lerp(-R * 0.75, R * 0.75, t / Math.max(1, j.tentacles - 1));
          const len = R * rand(1.35, 2.25);
          const sway = Math.sin(j.t * 1.3 + t) * (R * 0.18 + heat * R * 0.22);

          ctx.strokeStyle = `rgba(110,235,255, ${0.06 + heat * 0.16})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(off, baseY);
          ctx.quadraticCurveTo(off + sway * 0.45, baseY + len * 0.45, off + sway, baseY + len);
          ctx.stroke();

          for (let b = 0; b < j.beads; b++) {
            const bt = b / (j.beads - 1);
            const bx = off + sway * bt + Math.sin(j.t * 1.7 + b + t) * (R * 0.03);
            const by = baseY + len * bt + (0.5 + 0.5 * Math.sin(j.pulse + b * 0.35)) * (R * 0.08);

            const br = R * 0.10 + (1 - bt) * R * 0.05;
            const beadG = ctx.createRadialGradient(bx, by, 0, bx, by, br * 3.2);
            beadG.addColorStop(0, `rgba(255,255,255, ${0.12 + heat * 0.30})`);
            beadG.addColorStop(0.35, `rgba(110,235,255, ${0.10 + heat * 0.20})`);
            beadG.addColorStop(1, "rgba(0,0,0,0)");

            ctx.fillStyle = beadG;
            ctx.beginPath();
            ctx.arc(bx, by, br * 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }
    };

    // ----------------- Whale -----------------
    const drawWhale = (dt) => {
      if (!whale.active) return;

      whale.t += dt;
      const t = whale.t;

      const fadeIn = clamp(t / 2.0, 0, 1);
      const fadeOut = clamp((CFG.whaleLifetime - t) / 2.4, 0, 1);
      whale.alpha = Math.min(fadeIn, fadeOut) * 0.52;

      if (t > CFG.whaleLifetime) { whale.active = false; return; }

      whale.x += whale.dir * whale.speed * dt * 60 * 0.18;
      const wob = Math.sin(t * 0.9) * (H * whale.wobble * 0.01);

      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = whale.alpha;

      ctx.fillStyle = "rgba(5, 18, 28, 0.95)";
      ctx.shadowColor = "rgba(80, 190, 255, 0.10)";
      ctx.shadowBlur = 16;

      const sx = whale.scale * (whale.dir === 1 ? 1 : -1);
      const sy = whale.scale;

      ctx.translate(whale.x, whale.y + wob);
      ctx.scale(sx, sy);

      ctx.beginPath();
      ctx.moveTo(-180, 0);
      ctx.bezierCurveTo(-110, -70, 40, -70, 135, -20);
      ctx.bezierCurveTo(175, 0, 175, 25, 130, 40);
      ctx.bezierCurveTo(40, 75, -110, 55, -180, 0);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-175, 0);
      ctx.bezierCurveTo(-215, -40, -245, -25, -235, 0);
      ctx.bezierCurveTo(-245, 25, -215, 40, -175, 0);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = whale.alpha * 0.85;
      ctx.fillStyle = "rgba(0, 10, 18, 0.95)";
      ctx.beginPath();
      ctx.moveTo(70, -32);
      ctx.bezierCurveTo(155, -40, 185, -5, 150, 20);
      ctx.bezierCurveTo(120, 40, 65, 32, 55, 10);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = whale.alpha * 0.45;
      ctx.fillStyle = "rgba(180,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(105, 3, 2.0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // ----------------- Loop -----------------
    let raf = 0;
    let last = performance.now();

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!W || !H) return;

      const dt = clamp((now - last) / 1000, 0, 0.033);
      last = now;

      // Keep obstacles updated for font loading / layout shifts
      refreshObstacles(mountEl, W, H);

      drawBackground();
      drawHaze(dt);

      updateWake(dt);
      drawWake();

      drawDepth(dt);
      drawPhyto(dt);
      updateAndDrawJellies(dt);
      drawWhale(dt);

      drawDebugObstacles(ctx, now);

      pointer.strength *= Math.pow(0.88, dt * 60);
      if (pointer.strength < 0.02) pointer.active = false;
    };

    raf = requestAnimationFrame(loop);

    // ----------------- Cleanup -----------------
    cleanup = () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();

      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerleave", onLeave);

      host.removeEventListener("pointerdown", onPointerDownForHold);
      host.removeEventListener("pointerup", onPointerUpForHold);
      host.removeEventListener("pointercancel", onPointerUpForHold);
      host.removeEventListener("dblclick", onDblClick);

      clearTimeout(holdTimer);
    };

    window.__biolumeSidebarCleanup = cleanup;
  };

  // Boot (debounced) for Hydejack, allow only one mount per page state
  let bootTimer = 0;
  let mountedOnce = false;

  const boot = () => {
    clearTimeout(bootTimer);
    bootTimer = setTimeout(() => {
      if (mountedOnce) return;
      mountedOnce = true;
      mount();
    }, 120);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  document.addEventListener("hy-push-state-after", () => {
    mountedOnce = false;
    boot();
  });

  setTimeout(() => {
    if (!mountedOnce) boot();
  }, 650);
})();
