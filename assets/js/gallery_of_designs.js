(function () {
  // 1) MEDIA lives globally so other scripts can read it if needed
  window.MEDIA = window.MEDIA || [
    // { kind: "header", title: "<p class='small'>Soft stories and illustrations.</p>" },

    // { kind: "header", title: "<p><b>Scarlet World & Brand Art</b></p>" },
    { kind: "image", title: "Clay Scarlet World", src: "/images/Canva/Clay Scarlet World.jpg", w: 1080, h: 1080 },
    { kind: "image", title: "Plush Scarlet World", src: "/images/Canva/Plush Scarlet World.jpg", w: 1080, h: 1080 },
    { kind: "image", title: "Scarlet Profile Icon", src: "/images/Canva/Facebook Profile Photo (720 x 720px).png", w: 720, h: 720 },
    { kind: "image", title: "Scarlet Cover Photo", src: "/images/Canva/Scarlet Cover Photo (830 x 360 px).png", w: 830, h: 360 },
    { kind: "image", title: "Scarlet Another Cover Photo", src: "/images/Canva/Scarlet Creative Software.png", w: 1350, h: 500 },
    // { kind: "header", title: "<p><b>Scarlet Campaigns & Social Posts</b></p>" },
    { kind: "image", title: "Freedom & Trust", src: "/images/Canva/freedom_and_trust.png", w: 1080, h: 1080 },
    { kind: "image", title: "Happy Divali", src: "/images/Canva/Scarlet - Happy Divali.png", w: 1080, h: 1080 },
    { kind: "image", title: "Scarlet Beach", src: "/images/Canva/Scarlet Beach.png", w: 1080, h: 1080 },
    { kind: "video", title: "Let Go", thumb: "/images/Canva/thumbnail_images/Scarlet Creative Let Go.jpg", src: "/images/Canva/Scarlet Creative Let Go.mp4", hasAudio: false, w: 1080, h: 1080 },
    { kind: "image", title: "Scarlet Celebrating Creativity", src: "/images/Canva/Scarlet Most Creative.png", w: 1080, h: 1080 },
    { kind: "video", title: "Republic Day 2025", thumb: "/images/Canva/thumbnail_images/Scarlet Republic Day 2025.jpg", src: "/images/Canva/Scarlet Republic Day 2025.mp4", hasAudio: false, w: 1080, h: 1080 },
    { kind: "video", title: "Long Weekend", thumb: "/images/Canva/thumbnail_images/Scarlet_long_weekend.jpg", src: "/images/Canva/Scarlet_long_weekend.mp4", hasAudio: false, w: 1080, h: 1080 },
    { kind: "video", title: "Taking the First Step", thumb: "/images/Canva/thumbnail_images/Taking the first step.jpg", src: "/images/Canva/Taking the first step.mp4", hasAudio: false, w: 1080, h: 1080 },
    { kind: "video", title: "Christmas!", thumb: "/images/Canva/thumbnail_images/Scarlet_Christmas.jpg", src: "/images/Canva/Scarlet_Christmas.mp4", hasAudio: false, w: 1080, h: 1350 },
    // { kind: "header", title: "<p><b>Personal Illustrations & Mood Pieces</b></p>" },
    { kind: "video", title: "Let Go and Flow like Water", thumb: "/images/Canva/thumbnail_images/Let_Go_Flow_Growth.jpg", src: "/images/Canva/Personal/Let_Go_Flow_Growth.mp4", hasAudio: false, w: 1080, h: 1350 },
    { kind: "video", title: "It's Okay to not be Okay", thumb: "/images/Canva/thumbnail_images/its_ok_to_not_be_ok.jpg", src: "/images/Canva/Personal/its_ok_to_not_be_ok.mp4", hasAudio: true, w: 1080, h: 1350 },
    { kind: "image", title: "Care, Compassion & Growth", src: "/images/Canva/Personal/Care_Compassion_Growth.jpg", w: 1080, h: 1350 },
    { kind: "image", title: "Be Kind", src: "/images/Canva/Personal/Be_Kind.jpg", w: 1080, h: 1350 },
    { kind: "image", title: "Cosy & Warm", src: "/images/Canva/Personal/Cosy_And_Warm.jpg", w: 1080, h: 1350 },
    { kind: "video", title: "Floating In Space", thumb: "/images/Canva/thumbnail_images/Floating_Meditation.jpg", src: "/images/Canva/Personal/Floating_Meditation.mp4", hasAudio: true, w: 1080, h: 1350 },
    { kind: "video", title: "Let the Light Shine Through", thumb: "/images/Canva/thumbnail_images/Let_The_Light_Shine_Through.jpg", src: "/images/Canva/Personal/Let_The_Light_Shine_Through.mp4", hasAudio: false, w: 1080, h: 1350 },
    { kind: "video", title: "Space Adventure", thumb: "/images/Canva/thumbnail_images/Space_Adventure.jpg", src: "/images/Canva/Personal/Space_Adventure.mp4", hasAudio: false, w: 1080, h: 1350 },
    { kind: "video", title: "The Meet Up", thumb: "/images/Canva/thumbnail_images/The_Meet_Up.jpg", src: "/images/Canva/Personal/The_Meet_Up.mp4", hasAudio: true, w: 1080, h: 1350 },
    { kind: "video", title: "Where Have I Ended Up?", thumb: "/images/Canva/thumbnail_images/Where_Have_I_Ended_Up.jpg", src: "/images/Canva/Personal/Where_Have_I_Ended_Up.mp4", hasAudio: true, w: 1080, h: 1350 },
    { kind: "video", title: "You Are Enough <3", thumb: "/images/Canva/thumbnail_images/You_Are_Enough.jpg", src: "/images/Canva/Personal/You_Are_Enough.mp4", hasAudio: false, w: 1080, h: 1350 },
    { kind: "video", title: "The Reveal", thumb: "/images/Canva/thumbnail_images/Reveal.jpg", src: "/images/Canva/Personal/Reveal.mp4", hasAudio: false, w: 1080, h: 1350 },
    { kind: "video", title: "Cosy Penguin Family", thumb: "/images/Canva/thumbnail_images/Cosy_Penguin_Family.jpg", src: "/images/Canva/Personal/Cosy_Penguin_Family.mp4", hasAudio: true, w: 1080, h: 1350 }
  ];

  function initScarletGallery() {
    const masonry = document.querySelector("#scarletMasonry");
    if (!masonry) return;

    // if your theme swaps content, wait until #scarletMasonry is actually visible in DOM
    const section = masonry.closest(".scarlet-gallery");
    if (!section || !section.isConnected) return;

    // allow re-init on SPA nav: clear + rebuild
    masonry.innerHTML = "";

    const MEDIA = window.MEDIA || [];
    const frag = document.createDocumentFragment();

    MEDIA.forEach((item, idx) => {
      const li = document.createElement("li");
      li.dataset.idx = String(idx);

      // headers
      if (item.kind === "header" || item.kind === "spanning") {
        li.classList.add(item.kind === "header" ? "section-header" : "spanning");
        const html = (item.titleHtml ?? item.title ?? "");
        li.innerHTML = `<div class="${item.kind === "header" ? "section-header__inner" : ""}">${html}</div>`;
        frag.appendChild(li);
        return;
      }

      const safeTitle = escapeHtml(item.title || "");
      const hasAudio = !!item.hasAudio;

      const badges =
        item.kind === "video" && hasAudio
          ? `<div class="badges">
               <div class="badge" title="Has audio">
                 <button type="button" aria-label="Has audio">🔊</button>
               </div>
             </div>`
          : "";

      const w = num(item.w);
      const h = num(item.h);
      const aspect = (w && h) ? `${w} / ${h}` : "";

      const bgSrc = item.kind === "image" ? item.src : item.thumb;
      const isVideoTile = item.kind === "video";

      // IMPORTANT: grid videos should be muted ALWAYS (even if hasAudio true)
      // hasAudio is only for the lightbox.
      li.innerHTML = `
        <div class="ocean-tilt">
          <div class="ocean-card" ${aspect ? `style="aspect-ratio:${aspect}"` : ""}>
            ${badges}
            <div
              class="video-container ${isVideoTile ? "js-inview-video" : ""}"
              ${isVideoTile ? `data-video-src="${item.src}"` : ""}
            >
              <img
                class="card-bg"
                src="${bgSrc}"
                alt="${safeTitle}"
                loading="lazy"
                decoding="async"
                ${w ? `width="${w}"` : ""}
                ${h ? `height="${h}"` : ""}
              >
              <!-- video element will be injected here when in view -->
            </div>

            <h1 class="headline" aria-hidden="true"></h1>
          </div>
        </div>
      `;


      frag.appendChild(li);
    });

    masonry.appendChild(frag);

    // fade images in via class (matches your SCSS .card-bg.is-loaded)
    masonry.querySelectorAll(".card-bg").forEach((img) => {
      if (img.complete) img.classList.add("is-loaded");
      else img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    });

    initOceanTilt(masonry);
    initLightbox(masonry);
    initInViewVideos(masonry);
  }

  function initLightbox(masonry) {
    const lb = document.getElementById("lightbox");
    const lbMedia = document.getElementById("lbMedia");
    const lbTitle = document.getElementById("lbTitle");
    const lbAudioToggle = document.getElementById("lbAudioToggle");

    if (!lb || !lbMedia || !lbTitle || !lbAudioToggle) {
      if (retries > 0) setTimeout(() => initLightbox(masonry, retries - 1), 50);
      return;
    }

    let lbCurrentVideo = null;
    let lbHasAudio = false;

    function ensureLightboxInBody() {
      const lb = document.getElementById("lightbox");
      if (!lb) return null;
      if (lb.parentElement !== document.body) {
        document.body.appendChild(lb);
      }
      return lb;
    }

    function openLightbox(item) {
      const lb = ensureLightboxInBody();
      lbTitle.textContent = item.title || "";
      lbMedia.innerHTML = "";

      lbAudioToggle.hidden = true;
      lbAudioToggle.textContent = "🔊 Audio: On";
      lbHasAudio = !!item.hasAudio;
      lbCurrentVideo = null;

      if (item.kind === "image") {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.title || "";
        img.loading = "eager";
        if (num(item.w)) img.width = num(item.w);
        if (num(item.h)) img.height = num(item.h);
        lbMedia.appendChild(img);
      }

      if (item.kind === "video") {
        const v = document.createElement("video");
        v.controls = true;
        v.playsInline = true;
        v.preload = "metadata";
        v.src = item.src;

        if (lbHasAudio) {
          v.muted = false;
          v.volume = 1;
          lbAudioToggle.hidden = false;
          lbAudioToggle.textContent = "🔊 Audio: On";
        } else {
          v.muted = true;
          v.volume = 0;
        }

        lbMedia.appendChild(v);
        lbCurrentVideo = v;
        v.play().catch(() => {});
      }

      const panel = document.querySelector("#lightbox .lb__panel");
      const reserveH = 110; // room for title + buttons (tweak)

      function applyMax() {
        const vw = Math.floor(window.innerWidth * 0.92);
        const vh = Math.floor(window.innerHeight * 0.90) - reserveH;
        lbMedia.style.maxWidth = vw + "px";
        lbMedia.style.maxHeight = vh + "px";
      }

      applyMax();
      window.addEventListener("resize", applyMax, { passive: true });


      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      document.querySelectorAll("#scarletMasonry video.grid-video").forEach(v => {
        try { v.pause(); } catch {}
      });
    }

    function closeLightbox() {
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      if (lbCurrentVideo) {
        lbCurrentVideo.pause();
        lbCurrentVideo.src = "";
        lbCurrentVideo.load();
        lbCurrentVideo = null;
      }
      lbMedia.innerHTML = "";
    }

    // avoid double-binding by using one delegation + dataset flag
    if (masonry.dataset.lbBound !== "1") {
      masonry.dataset.lbBound = "1";
      masonry.addEventListener("click", (ev) => {
        const li = ev.target.closest("li");
        if (!li || !masonry.contains(li)) return;

        const idx = Number(li.dataset.idx);
        const item = (window.MEDIA || [])[idx];
        if (!item) return;
        if (item.kind === "header" || item.kind === "spanning") return;

        openLightbox(item);
      });
    }

    if (lb.dataset.bound !== "1") {
      lb.dataset.bound = "1";

      lb.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.hasAttribute("data-lb-close")) closeLightbox();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lb.getAttribute("aria-hidden") === "false") {
          closeLightbox();
        }
      });

      lbAudioToggle.addEventListener("click", () => {
        if (!lbCurrentVideo || !lbHasAudio) return;

        const isMuted = lbCurrentVideo.muted || lbCurrentVideo.volume === 0;
        if (isMuted) {
          lbCurrentVideo.muted = false;
          lbCurrentVideo.volume = 1;
          lbAudioToggle.textContent = "🔊 Audio: On";
        } else {
          lbCurrentVideo.muted = true;
          lbCurrentVideo.volume = 0;
          lbAudioToggle.textContent = "🔇 Audio: Off";
        }
      });
    }
  }

    
  function initOceanTilt(root) {
    if (!window.gsap) return;

    // Tilt strength (keep your +20 feel)
    const strength = 5;

    // Smoothness
    const moveDur = 0.15;            // slower tracking = less sharp
    const leaveDur = 1.15;
    const easeMove = "sine.out";     // softer than power3
    const easeLeave = "expo.out";

    // “Ocean filter” (0..1). Higher = more lag, less sharp
    const smoothing = 0.12;

    root.querySelectorAll(".ocean-tilt").forEach((container) => {
      const card = container.querySelector(".ocean-card");
      if (!card) return;

      let r = null;
      let center = { x: 0, y: 0 };

      // filtered target values
      let target = { x: 0, y: 0 };
      let current = { x: 0, y: 0 };

      let rafId = null;

      function updateRect() {
        r = card.getBoundingClientRect();
        center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }

      function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
      }

      // Animate toward target (low-pass filter)
      function tick() {
        // smooth toward target
        current.x += (target.x - current.x) * smoothing;
        current.y += (target.y - current.y) * smoothing;

        const rotX = current.y * -strength;
        const rotY = current.x * strength;

        // a little translation makes it feel buoyant
        const tx = current.x * 10;
        const ty = current.y * 10;

        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          x: tx,
          y: ty,
          duration: moveDur,
          ease: easeMove,
          overwrite: true,
          transformPerspective: 900
        });

        rafId = requestAnimationFrame(tick);
      }

      function setTargetFromEvent(event) {
        if (!r) updateRect();

        // normalized -1..1
        const dx = (event.clientX - center.x) / (r.width / 2);
        const dy = (event.clientY - center.y) / (r.height / 2);

        // soften edges (gentle falloff)
        target.x = clamp(dx, -1, 1);
        target.y = clamp(dy, -1, 1);
      }

      function startCurrentWobble() {
        // subtle slow “current” that layers on top
        // kill any previous wobble
        if (card._oceanWobble) card._oceanWobble.kill();

        card._oceanWobble = gsap.to(card, {
          rotateZ: 1.0,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      function stopCurrentWobble() {
        if (card._oceanWobble) {
          card._oceanWobble.kill();
          card._oceanWobble = null;
        }
      }

      container.addEventListener("pointerenter", (e) => {
        updateRect();
        gsap.set(card, { willChange: "transform" });

        setTargetFromEvent(e);
        startCurrentWobble();

        // start RAF loop once
        if (!rafId) rafId = requestAnimationFrame(tick);
      });

      container.addEventListener("pointermove", (e) => {
        setTargetFromEvent(e);
      });

      container.addEventListener("pointerleave", () => {
        stopCurrentWobble();

        // stop the RAF loop
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }

        // reset filtered values
        target = { x: 0, y: 0 };
        current = { x: 0, y: 0 };

        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          x: 0,
          y: 0,
          duration: leaveDur,
          ease: easeLeave,
          overwrite: true,
          onComplete: () => gsap.set(card, { willChange: "auto" })
        });

        r = null;
      });
    });
  }


  // function initOceanTilt(root) {
  //   // must include GSAP before this script
  //   if (!window.gsap) return;

  //   const strength = 5;
    

  //   root.querySelectorAll(".ocean-tilt").forEach((container) => {
  //     const card = container.querySelector(".ocean-card");
  //     if (!card) return;

  //     let r = null;
  //     let center = { x: 0, y: 0 };

  //     function updateRect() {
  //       r = card.getBoundingClientRect();
  //       center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  //     }

  //     container.addEventListener("pointerenter", updateRect);

  //     container.addEventListener("pointermove", (event) => {
  //       if (!r) updateRect();

  //       const dif = {
  //         x: ((event.clientX - center.x) / r.width) * 2,
  //         y: ((event.clientY - center.y) / r.height) * 2
  //       };

  //       const transform = {
  //         x: dif.y * strength * -1,
  //         y: dif.x * strength
  //       };

  //       gsap.to(card, {
  //         rotateX: `${transform.x}deg`,
  //         rotateY: `${transform.y}deg`,
  //         overwrite: true,
  //         duration: 0.2
  //       });
  //     });

  //     container.addEventListener("pointerleave", () => {
  //       gsap.to(card, {
  //         rotateX: "0deg",
  //         rotateY: "0deg",
  //         overwrite: true,
  //         duration: 0.25
  //       });
  //       r = null;
  //     });
  //   });
  // }

  function initInViewVideos(root) {
    if (!("IntersectionObserver" in window)) return;

    // reset observer each re-render (since you rebuild innerHTML)
    if (root._inviewObs) root._inviewObs.disconnect();

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const box = entry.target;
          if (!(box instanceof HTMLElement)) continue;

          const v = box.querySelector("video.grid-video");

          if (entry.isIntersecting && entry.intersectionRatio > 0.08) {
            ensureVideo(box);
            playVideo(box);
          } else {
            pauseVideo(box);
          }
        }
      },
      {
        root: null,
        rootMargin: "250px 0px 250px 0px",
        threshold: [0, 0.08, 0.2]
      }
    );

    root._inviewObs = obs;
    root.querySelectorAll(".js-inview-video").forEach((el) => obs.observe(el));

    function ensureVideo(box) {
      if (box.querySelector("video.grid-video")) return;

      const src = box.getAttribute("data-video-src");
      if (!src) return;

      const v = document.createElement("video");
      v.className = "grid-video";
      v.setAttribute("muted", "");
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.autoplay = true;
      v.preload = "metadata";
      v.src = src;

      // fade in when it actually plays or can render
      const show = () => box.classList.add("is-video-active");
      v.addEventListener("playing", show, { once: true });
      v.addEventListener("canplay", show, { once: true });

      // if it errors, keep thumbnail and don’t get stuck
      v.addEventListener("error", () => {
        box.classList.remove("is-video-active");
      });

      box.appendChild(v);
    }

    function playVideo(box) {
      const v = box.querySelector("video.grid-video");
      if (!v) return;

      // sometimes browsers pause these; re-try gently
      v.play().then(() => {
        box.classList.add("is-video-active");
      }).catch(() => {
        // autoplay blocked or throttled: keep thumbnail visible
        box.classList.remove("is-video-active");
      });
    }

    function pauseVideo(box) {
      const v = box.querySelector("video.grid-video");
      if (!v) return;
      try { v.pause(); } catch {}
      box.classList.remove("is-video-active");
    }
  }




  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function num(v) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  // Run on load + common SPA nav events
  // document.addEventListener("DOMContentLoaded", initScarletGallery);
  // window.addEventListener("pageshow", initScarletGallery);
  // document.addEventListener("hy-push-state-load", initScarletGallery);
  // document.addEventListener("turbo:load", initScarletGallery);
  // document.addEventListener("swup:contentReplaced", initScarletGallery);

  
  function bootScarletGallery(retries = 80) {
    const el = document.querySelector("#scarletMasonry");
    if (el) {
      initScarletGallery();
      return;
    }
    if (retries <= 0) return;
    setTimeout(() => bootScarletGallery(retries - 1), 50);
  }

  document.addEventListener("DOMContentLoaded", () => bootScarletGallery());
  window.addEventListener("load", () => bootScarletGallery());

  // Hydejack / PJAX hooks (safe if they never fire)
  document.addEventListener("hy-push-state-load", () => bootScarletGallery());
  document.addEventListener("turbo:load", () => bootScarletGallery());


})();
