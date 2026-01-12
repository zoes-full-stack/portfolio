(function () {
  // 1) MEDIA lives globally so other scripts can read it if needed
  window.MEDIA = window.MEDIA || [
    { kind: "header", title: "<p class='small'>Soft stories and illustrations.</p>" },

    { kind: "header", title: "<p><b>Scarlet World & Brand Art</b></p>" },
    { kind: "image", title: "Clay Scarlet World", src: "/images/Canva/Clay Scarlet World.jpg", w: 1080, h: 1080 },
    { kind: "image", title: "Plush Scarlet World", src: "/images/Canva/Plush Scarlet World.jpg", w: 1080, h: 1080 },
    { kind: "image", title: "Scarlet Profile Icon", src: "/images/Canva/Facebook Profile Photo (720 x 720px).png", w: 720, h: 720 },
    { kind: "image", title: "Scarlet Cover Photo", src: "/images/Canva/Scarlet Cover Photo (830 x 360 px).png", w: 830, h: 360 },
    { kind: "image", title: "Scarlet Another Cover Photo", src: "/images/Canva/Scarlet Creative Software.png", w: 1350, h: 500 },

    { kind: "header", title: "<p><b>Scarlet Campaigns & Social Posts</b></p>" },
    { kind: "image", title: "Freedom & Trust", src: "/images/Canva/freedom_and_trust.png", w: 1080, h: 1080 },
    { kind: "image", title: "Happy Divali", src: "/images/Canva/Scarlet - Happy Divali.png", w: 1080, h: 1080 },
    { kind: "image", title: "Scarlet Beach", src: "/images/Canva/Scarlet Beach.png", w: 1080, h: 1080 },

    { kind: "video", title: "Let Go", thumb: "/images/Canva/thumbnail_images/Scarlet Creative Let Go.jpg", src: "/images/Canva/Scarlet Creative Let Go.mp4", hasAudio: false, w: 1080, h: 1080 },
    { kind: "image", title: "Scarlet Celebrating Creativity", src: "/images/Canva/Scarlet Most Creative.png", w: 1080, h: 1080 },
    { kind: "video", title: "Republic Day 2025", thumb: "/images/Canva/thumbnail_images/Scarlet Republic Day 2025.jpg", src: "/images/Canva/Scarlet Republic Day 2025.mp4", hasAudio: false, w: 1080, h: 1080 },
    { kind: "video", title: "Long Weekend", thumb: "/images/Canva/thumbnail_images/Scarlet_long_weekend.jpg", src: "/images/Canva/Scarlet_long_weekend.mp4", hasAudio: false, w: 1080, h: 1080 },
    { kind: "video", title: "Taking the First Step", thumb: "/images/Canva/thumbnail_images/Taking the first step.jpg", src: "/images/Canva/Taking the first step.mp4", hasAudio: false, w: 1080, h: 1080 },
    { kind: "video", title: "Christmas!", thumb: "/images/Canva/thumbnail_images/Scarlet_Christmas.jpg", src: "/images/Canva/Scarlet_Christmas.mp4", hasAudio: false, w: 1080, h: 1350 },

    { kind: "header", title: "<p><b>Personal Illustrations & Mood Pieces</b></p>" },
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

      li.innerHTML = `
        <div class="ocean-tilt">
          <div class="ocean-card" ${aspect ? `style="aspect-ratio:${aspect}"` : ""}>
            ${badges}
            <div class="video-container">
              <img
                class="card-bg"
                src="${bgSrc}"
                alt="${safeTitle}"
                loading="lazy"
                decoding="async"
                ${w ? `width="${w}"` : ""}
                ${h ? `height="${h}"` : ""}
              >
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
  }

  function initLightbox(masonry) {
    const lb = document.getElementById("lightbox");
    const lbMedia = document.getElementById("lbMedia");
    const lbTitle = document.getElementById("lbTitle");
    const lbAudioToggle = document.getElementById("lbAudioToggle");

    if (!lb || !lbMedia || !lbTitle || !lbAudioToggle) return;

    let lbCurrentVideo = null;
    let lbHasAudio = false;

    function openLightbox(item) {
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

      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
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
    // must include GSAP before this script
    if (!window.gsap) return;

    const strength = 5;

    root.querySelectorAll(".ocean-tilt").forEach((container) => {
      const card = container.querySelector(".ocean-card");
      if (!card) return;

      let r = null;
      let center = { x: 0, y: 0 };

      function updateRect() {
        r = card.getBoundingClientRect();
        center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }

      container.addEventListener("pointerenter", updateRect);

      container.addEventListener("pointermove", (event) => {
        if (!r) updateRect();

        const dif = {
          x: ((event.clientX - center.x) / r.width) * 2,
          y: ((event.clientY - center.y) / r.height) * 2
        };

        const transform = {
          x: dif.y * strength * -1,
          y: dif.x * strength
        };

        gsap.to(card, {
          rotateX: `${transform.x}deg`,
          rotateY: `${transform.y}deg`,
          overwrite: true,
          duration: 0.2
        });
      });

      container.addEventListener("pointerleave", () => {
        gsap.to(card, {
          rotateX: "0deg",
          rotateY: "0deg",
          overwrite: true,
          duration: 0.25
        });
        r = null;
      });
    });
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
  document.addEventListener("DOMContentLoaded", initScarletGallery);
  window.addEventListener("pageshow", initScarletGallery);
  document.addEventListener("hy-push-state-load", initScarletGallery);
  document.addEventListener("turbo:load", initScarletGallery);
  document.addEventListener("swup:contentReplaced", initScarletGallery);
})();
