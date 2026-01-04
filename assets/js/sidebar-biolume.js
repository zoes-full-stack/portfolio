(() => {
  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const waitFor = (fn, timeout = 6000) =>
    new Promise((resolve, reject) => {
      const start = Date.now();
      const tick = () => {
        const v = fn();
        if (v) return resolve(v);
        if (Date.now() - start > timeout) return reject(new Error("Timed out"));
        setTimeout(tick, 50);
      };
      tick();
    });

  const getSidebarHost = () => {
    // Prefer Hydejack's sidebar background layer if present
    return (
      document.querySelector("#_sidebar .sidebar-bg") ||
      document.querySelector("#_sidebar") ||
      document.querySelector("aside.sidebar") ||
      document.querySelector(".sidebar")
    );
  };

  const ensureMount = (host) => {
    let el = document.getElementById("sidebar-biolume");
    if (!el) {
      el = document.createElement("div");
      el.id = "sidebar-biolume";
      // Mount as first child so it's behind content (z-index controlled via CSS)
      host.prepend(el);
    }
    // Force correct sizing so tsParticles can create a canvas reliably
    Object.assign(el.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none"
    });
    return el;
  };

  const destroyExisting = (tsParticles) => {
    const dom = tsParticles.dom?.() || [];
    for (const c of dom) {
      if (c?.id === "sidebar-biolume") c.destroy();
    }
  };

  const alreadyMounted = () => !!document.querySelector("#sidebar-biolume canvas");

  const mount = async () => {
    try {
      const tsParticles = await waitFor(() => window.tsParticles);

      const host = getSidebarHost();
      if (!host) return;

      // Ensure host can position absolute children
      if (getComputedStyle(host).position === "static") host.style.position = "relative";

      // Avoid duplicates
      if (alreadyMounted()) return;

      const el = ensureMount(host);

      // Wait 2 frames so layout settles (Hydejack can animate in)
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      // If still tiny, bail and try again later
      const rect = el.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 80) {
        setTimeout(mount, 400);
        return;
      }

      // If PJAX swapped pages, clean prior instance
      destroyExisting(tsParticles);

      await tsParticles.load({
        id: "sidebar-biolume",
        options: {
          fpsLimit: 50,
          fullScreen: { enable: false },
          background: { color: "transparent" },
          detectRetina: true,

          particles: {
            number: { value: 26, density: { enable: true, area: 900 } },
            color: { value: ["#a8fff3", "#7de9ff", "#66c6ff", "#b7ffe6"] },

            opacity: {
              value: { min: 0.06, max: 0.35 },
              animation: { enable: true, speed: 0.35, minimumValue: 0.05 }
            },

            size: {
              value: { min: 1, max: 3 },
              animation: { enable: true, speed: 0.6, minimumValue: 0.9 }
            },

            move: {
              enable: true,
              speed: 0.22,
              direction: "top",
              random: true,
              straight: false,
              outModes: { default: "out" }
            },

            shadow: { enable: true, color: "#bffcff", blur: 22 },
            links: { enable: false }
          },

          interactivity: {
            events: {
              onHover: { enable: true, mode: "bubble" },
              onClick: { enable: true, mode: "bubble" },
              resize: true
            },
            modes: {
              bubble: {
                distance: 150,
                duration: 0.9,
                size: 7,
                opacity: 1
              }
            }
          }
        }
      });
    } catch (e) {
      console.warn("[biolume] mount failed:", e);
    }
  };

  // Initial mount
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }

  // Hydejack PJAX navigation support
  document.addEventListener("hy-push-state-after", () => {
    // Sidebar can re-render; give it a beat
    setTimeout(mount, 250);
  });

  // Late layout safety
  setTimeout(mount, 700);
})();
