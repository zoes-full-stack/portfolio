/* assets/js/gallery_of_designs.js
   Tabbed Masonry Gallery (Illustrations / Baking / Documents)
   - No global MutationObserver (prevents blink/re-render loops)
   - Safe re-init on Hydejack/Turbo navigation events
*/

(function () {
  // =========================
  // 1) MEDIA SETS
  // =========================
  const MEDIA_SETS = {
    illustrations: [
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
    ],

    baking: [
      { kind: "image", title: "Father's Day Red Velvet with Cream Cheese Icing Cake", src: "/images/baking/dad_cake.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Fudgy Brownies with Crackly Top", src: "/images/baking/brownies.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "White Chocolate Snow Men", src: "/images/baking/choc_snow.jpg", w: 1080, h: 1080 },

      { kind: "image", title: "Cactus Chocolate Cupcake with Peanut Butter Icing", src: "/images/baking/cactus_cake.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Pink Meringues!", src: "/images/baking/meringues.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Fudgy Brownies with Semi-Sweet Chocolate Ganache", src: "/images/baking/brownies2.jpg", w: 1080, h: 1080 },

      { kind: "image", title: "Mom's Birthday Cake!", src: "/images/baking/mom_cake.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Mom's Birthday Cake", src: "/images/baking/mom_cake2.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Mom's Birthday Cake with Chocolate Ganache Side Drip", src: "/images/baking/mom_cake4.jpg", w: 1080, h: 1080 },

      { kind: "image", title: "Father's Day Red Velvet and Coffee Cake with Coffee Cream Cheese Icing", src: "/images/baking/dad_cake3.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Dark Soul's Themed Birthday Red Velvet with Cream Cheese Icing Cake for My S/O", src: "/images/baking/bday_cake.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Dark Soul's Themed Birthday Red Velvet with Cream Cheese Icing Cake for My S/O", src: "/images/baking/bday_cake2.jpg", w: 1080, h: 1080 },

      { kind: "image", title: "Christmas/New Years Red Velvet with Cream Cheese Icing Cake", src: "/images/baking/christmas_newy_cake.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Anniversary Red Velvet Cake with Cream Cheese Icing", src: "/images/baking/ann_cake3.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Anniversary Red Velvet Cake with Cream Cheese Icing", src: "/images/baking/ann_cake.jpg", w: 1080, h: 1080 },

      { kind: "image", title: "Father's Day Red Velvet Cake with Cream Cheese Icing", src: "/images/baking/dad_cake2.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Mother's Day Chocolate Cake with Chocolate Buttercream and Ganache", src: "/images/baking/mom_cake3.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Lord of the Rings Themed Birthday Cake for my S/O", src: "/images/baking/ann_cake2.jpg", w: 1080, h: 1080 },

      { kind: "image", title: "Cute Red Velvet Cupcake", src: "/images/baking/cupcake.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Chewy Chocolate Chip Cookies", src: "/images/baking/cookies2.jpg", w: 1080, h: 1080 },
      { kind: "image", title: "Chewy Chocolate Chip and Cinnamon Cookies", src: "/images/baking/cookies.jpg", w: 1080, h: 1080 },
    ],

    documents: [
      {
        kind: "doc",
        title: "Scarlet Creative – Company Portfolio",
        desc: "A 60+ page, illustration-led portfolio sharing our story, values, services, case studies, and team.",
        thumb: "/assets/img/Scarlet_Creative_Company_Profile_Contact_Thumbnail.jpg",
        href: "/assets/docs/Scarlet_Creative_Company_Portfolio.pdf",
        w: 1414,
        h: 2000
      },
      {
        kind: "doc",
        title: "Scarlet Creative – Company Profile",
        desc: "A concise 15-page profile introducing who we are, what we do, key projects, our tech stack, and the sectors we serve across the Caribbean and worldwide.",
        thumb: "/assets/img/Scarlet_Creative_Company_Profile_Thumbnail.jpg",
        href: "/assets/docs/Scarlet_Creative_Software_Company_Profile.pdf",
        w: 1414,
        h: 2000
      }
    ],

  };

  // =========================
  // 2) State + caching
  // =========================
  let activeTab = "illustrations";
  const tabCache = new Map(); // tabKey -> DocumentFragment
  let bootTimer = null;

  // Prevent double-init loops
  let lastBootSignature = "";

  // lightbox uses window.MEDIA
  window.MEDIA = MEDIA_SETS[activeTab];

  // =========================
  // 3) Boot scheduling
  // =========================
  function scheduleBoot(delay = 60) {
    if (bootTimer) clearTimeout(bootTimer);
    bootTimer = setTimeout(() => {
      bootTimer = null;
      boot();
    }, delay);
  }

  function getTabFromHash() {
    const h = (location.hash || "").replace("#", "");
    if (h && MEDIA_SETS[h]) return h;
    return "illustrations";
  }

  function initWhimsicalTabs(tabsEl){
    if (!window.gsap) return;
    if (!tabsEl || tabsEl.dataset.whimsyBound === "1") return;
    tabsEl.dataset.whimsyBound = "1";

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const indicator = tabsEl.querySelector(".tab-indicator");
    const links = Array.from(tabsEl.querySelectorAll('a[data-tab]'));

    if (!indicator || !links.length) return;

    function rectOf(el){
      const r = el.getBoundingClientRect();
      const p = tabsEl.getBoundingClientRect();
      return {
        x: r.left - p.left,
        y: r.top - p.top,
        w: r.width,
        h: r.height
      };
    }

    function moveIndicatorTo(el, immediate=false){
      const {x,y,w,h} = rectOf(el);

      if (prefersReduce || immediate){
        gsap.set(indicator, { x, y, width: w, height: h });
        return;
      }

      // A little “squish then settle” feel
      const tl = gsap.timeline({ defaults: { overwrite: true } });

      tl.to(indicator, {
        duration: 0.18,
        x, y,
        ease: "power2.out"
      }, 0);

      tl.to(indicator, {
        duration: 0.18,
        width: w,
        height: h,
        ease: "power2.out"
      }, 0);

      // whimsical bounce (lightweight, only on click)
      tl.to(indicator, {
        duration: 0.70,
        // micro wobble by scaling around center
        scaleX: 1.02,
        scaleY: 0.98,
        ease: "elastic.out(1, 0.55)"
      }, 0);

      tl.to(indicator, {
        duration: 0.55,
        scaleX: 1,
        scaleY: 1,
        ease: "elastic.out(1, 0.55)"
      }, 0.10);
    }

    function popLabel(el){
      if (prefersReduce) return;
      gsap.fromTo(el,
        { scale: 0.98 },
        { scale: 1, duration: 0.55, ease: "elastic.out(1, 0.65)" }
      );
    }

    // initial placement
    const active = tabsEl.querySelector("a.is-active") || links[0];
    moveIndicatorTo(active, true);

    // click animation (doesn't replace your gallery click handler, just adds motion)
    tabsEl.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-tab]");
      if (!a) return;

      // set UI classes here too (optional, if you already do it elsewhere)
      links.forEach(l => l.classList.toggle("is-active", l === a));

      moveIndicatorTo(a, false);
      popLabel(a);
    }, { passive: true });

    // keep indicator aligned on resize
    window.addEventListener("resize", () => {
      const cur = tabsEl.querySelector("a.is-active") || links[0];
      moveIndicatorTo(cur, true);
    }, { passive: true });
  }

  function initSvgUnderlineWobbleTabs(tabsEl) {
    if (!window.gsap) return;
    if (!tabsEl || tabsEl.dataset.svgWobbleBound === "1") return;
    tabsEl.dataset.svgWobbleBound = "1";

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const anchors = Array.from(tabsEl.querySelectorAll("a[data-tab]"));
    if (!anchors.length) return;

    // Same values as the CodePen
    const initialD = "M 10,90 Q 100,90 190,90";
    const hoverD   = "M 10,90 Q 100,125 190,90";
    const activeD  = "M 10,90 Q 100,32 190,90";
    const ease     = "elastic.out(1.4, 0.3)"; // :contentReference[oaicite:1]{index=1}

    const getPath = (a) => a && a.querySelector("path");

    function tweenPath(a, d, duration = 1) {
      const path = getPath(a);
      if (!path) return;

      gsap.killTweensOf(path);

      if (prefersReduce || duration === 0) {
        gsap.set(path, { attr: { d } });
        return;
      }

      gsap.to(path, {
        attr: { d },
        ease,
        duration,
        overwrite: true
      });
    }

    function syncAllPaths(immediate = true) {
      anchors.forEach((a) => {
        const isActive = a.classList.contains("is-active");
        tweenPath(a, isActive ? activeD : initialD, immediate ? 0 : 0.6);
      });
    }

    // Initial state
    syncAllPaths(true);

    // Hover wobble (only if NOT active)
    anchors.forEach((a) => {
      a.addEventListener("pointerenter", () => {
        if (a.classList.contains("is-active")) return;
        tweenPath(a, hoverD, 0.9);
      });

      a.addEventListener("pointerleave", () => {
        if (a.classList.contains("is-active")) return;
        tweenPath(a, initialD, 0.9);
      });
    });

    // Click bounce:
    // - previous active collapses to initial
    // - clicked tab lifts to active
    tabsEl.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-tab]");
      if (!a) return;

      const prev = tabsEl.querySelector("a.is-active");
      if (prev && prev !== a) tweenPath(prev, initialD, 0.9);

      // If clicking same active tab, do a tiny “boing” anyway
      if (a.classList.contains("is-active")) {
        tweenPath(a, hoverD, 0.55);
        tweenPath(a, activeD, 0.85);
        return;
      }

      tweenPath(a, activeD, 1.0);
    }, { passive: true });

    // If tabs change via hashchange / code (not a click), keep paths correct
    window.addEventListener("resize", () => syncAllPaths(true), { passive: true });

    // Expose a hook so your existing setActiveTabUI can force-sync paths
    tabsEl._syncUnderlinePaths = syncAllPaths;
  }



  function boot(retries = 40) {
    const masonry = document.querySelector("#scarletMasonry");
    const tabs = document.querySelector(".media-tabs");
    initSvgUnderlineWobbleTabs(tabs);
    // initWhimsicalTabs(tabs);

    if (!masonry || !tabs) {
      if (retries > 0) return setTimeout(() => boot(retries - 1), 80);
      return;
    }

    // Create a signature so we don’t re-bind endlessly
    const sig = `${masonry.isConnected}-${tabs.isConnected}-${location.pathname}`;
    if (sig === lastBootSignature && masonry.dataset.booted === "1") {
      // already booted for this page instance; just ensure correct tab
      const tab = getTabFromHash();
      if (tab !== activeTab) {
        setActiveTabUI(tabs, tab);
        renderTab(tab, masonry, { immediate: true });
      }
      return;
    }
    lastBootSignature = sig;

    // bind once
    bindTabsOnce(tabs, masonry);
    bindLightboxOnce(masonry);

    // initial tab
    const initial = getTabFromHash();
    activeTab = initial;
    setActiveTabUI(tabs, initial);
    renderTab(initial, masonry, { immediate: true });

    masonry.dataset.booted = "1";
  }

  // =========================
  // 4) Tabs
  // =========================
  function bindTabsOnce(tabsEl, masonry) {
    if (tabsEl.dataset.bound === "1") return;
    tabsEl.dataset.bound = "1";

    tabsEl.addEventListener(
      "click",
      (e) => {
        const a = e.composedPath?.().find(n => n?.matches?.("a[data-tab]")) || e.target.closest("a[data-tab]");
        if (!a) return;

        e.preventDefault();

        const tab = a.dataset.tab;
        if (!tab || !MEDIA_SETS[tab]) return;
        if (tab === activeTab) return;

        history.replaceState(null, "", `#${tab}`);
        setActiveTabUI(tabsEl, tab);
        renderTab(tab, masonry);
      },
      { passive: false }
    );

    window.addEventListener(
      "hashchange",
      () => {
        const tab = getTabFromHash();
        if (tab !== activeTab) {
          setActiveTabUI(tabsEl, tab);
          renderTab(tab, masonry);
        }
      },
      { passive: true }
    );
  }

  function setActiveTabUI(tabsEl, tab) {
    tabsEl.querySelectorAll("a[data-tab]").forEach((a) => {
      const isActive = a.dataset.tab === tab;
      a.classList.toggle("is-active", isActive);
      a.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // keep GSAP underline paths in sync even when switching tabs programmatically
    if (typeof tabsEl._syncUnderlinePaths === "function") {
      tabsEl._syncUnderlinePaths(true);
    }
  }


  // =========================
  // 5) Render (cache + no blinking)
  // =========================
  function renderTab(tabKey, masonry, opts = {}) {
    const { immediate = false } = opts;

    // stop heavy stuff tied to old DOM (observer + videos)
    deactivateEnhancements(masonry);

    activeTab = tabKey;
    window.MEDIA = MEDIA_SETS[tabKey];

    masonry.classList.toggle("is-docs", tabKey === "documents");

    // IMPORTANT: don’t keep toggling opacity on every micro-event
    if (!immediate) masonry.classList.add("is-switching");

    const cached = tabCache.get(tabKey);
    if (cached) {
      masonry.replaceChildren(cached.cloneNode(true));
      postRender(masonry, immediate);
      return;
    }

    const frag = buildGalleryFragment(MEDIA_SETS[tabKey], tabKey);
    tabCache.set(tabKey, frag);

    masonry.replaceChildren(frag.cloneNode(true));
    postRender(masonry, immediate);
  }

  function postRender(masonry, immediate) {
    // fade-in thumbs when loaded
    masonry.querySelectorAll(".card-bg").forEach((img) => {
      const mark = () => img.classList.add("is-loaded");
      if (img.complete) mark();
      img.addEventListener("load", mark, { once: true });
    });

    // remove switch class once
    if (immediate) {
      masonry.classList.remove("is-switching");
    } else {
      requestAnimationFrame(() => {
        setTimeout(() => masonry.classList.remove("is-switching"), 140);
      });
    }

    // re-enable enhancements for current view
    initOceanTilt(masonry);
    initInViewVideos(masonry);
  }

  function buildGalleryFragment(list) {
    const frag = document.createDocumentFragment();

    list.forEach((item, idx) => {
      const li = document.createElement("li");
      li.dataset.idx = String(idx);

    // ✅ Documents: card layout (no lightbox)
    if (item.kind === "doc") {
      const title = escapeHtml(item.title || "");
      const desc = escapeHtml(item.desc || "");
      const thumb = item.thumb || "";
      const href = item.href || "#";

      li.className = "doc-tile";
      li.innerHTML = `
        <article class="doc-card">
          <a class="doc-card__media" href="${href}" target="_blank" rel="noopener">
            <img src="${thumb}" alt="${title}" loading="lazy" decoding="async">
          </a>

          <div class="doc-card__body">
            <h4 class="doc-card__title">${title}</h4>
            <p class="doc-card__desc">${desc}</p>
            <p class="doc-card__link">
              <a href="${href}" target="_blank" rel="noopener">View PDF →</a>
            </p>
          </div>
        </article>
      `;
      frag.appendChild(li);
      return;
    }

      const safeTitle = escapeHtml(item.title || "");
      const w = num(item.w);
      const h = num(item.h);
      const aspect = w && h ? `${w} / ${h}` : "";

      const bgSrc = item.kind === "image" ? item.src : (item.thumb || item.src);

      const isVideoTile = item.kind === "video";

      // small priority bump for the first couple items
      const eager = idx < 2 ? `loading="eager"` : `loading="lazy"`;
      const fetchPriority = idx < 3 ? `fetchpriority="high"` : "";

      li.innerHTML = `
        <div class="ocean-tilt">
          <div class="ocean-card" ${aspect ? `style="aspect-ratio:${aspect}"` : ""}>
            <div class="video-container ${isVideoTile ? "js-inview-video" : ""}"
                 ${isVideoTile ? `data-video-src="${item.src}"` : ""}>
              <img class="card-bg"
                   src="${bgSrc}"
                   alt="${safeTitle}"
                   ${eager}
                   decoding="async"
                   ${fetchPriority}
                   ${w ? `width="${w}"` : ""}
                   ${h ? `height="${h}"` : ""}>
            </div>
            <h1 class="headline" aria-hidden="true"></h1>
          </div>
        </div>
      `;

      frag.appendChild(li);
    });

    return frag;
  }

  // =========================
  // 6) Enhancements lifecycle
  // =========================
  function deactivateEnhancements(root) {
    if (root._inviewObs) {
      root._inviewObs.disconnect();
      root._inviewObs = null;
    }
    root.querySelectorAll("video.grid-video").forEach((v) => {
      try { v.pause(); } catch {}
    });
    root.dataset.tiltInit = "0";
  }

  // =========================
  // 7) Lightbox (bind once)
  // =========================
  function bindLightboxOnce(masonry) {
    if (masonry.dataset.lbBound === "1") return;
    masonry.dataset.lbBound = "1";

    const lb = document.getElementById("lightbox");
    const lbMedia = document.getElementById("lbMedia");
    const lbTitle = document.getElementById("lbTitle");
    const lbAudioToggle = document.getElementById("lbAudioToggle");
    const lbCloseBtn = lb ? lb.querySelector(".lb__close") : null;

    if (!lb || !lbMedia || !lbTitle || !lbAudioToggle || !lbCloseBtn) return;

    let lbCurrentVideo = null;
    let lbHasAudio = false;
    let lastFocusedEl = null;
    let lbCurrentItem = null;

    function isOpen() { return lb.getAttribute("aria-hidden") === "false"; }
    function ensureLightboxInBody() { if (lb.parentElement !== document.body) document.body.appendChild(lb); }

    function sizeLightboxToItem(item) {
      const mediaBox = document.getElementById("lbMedia");
      if (!mediaBox || !item) return;

      const w = Number(item.w) || 0;
      const h = Number(item.h) || 0;
      if (!w || !h) return;

      const vv = window.visualViewport;
      const vw = vv ? vv.width : window.innerWidth;
      const vh = vv ? vv.height : window.innerHeight;

      const maxW = vw * 0.94;
      const maxH = vh * 0.90;
      const scale = Math.min(maxW / w, maxH / h);

      mediaBox.style.width = Math.floor(w * scale) + "px";
      mediaBox.style.height = Math.floor(h * scale) + "px";
    }

    function openLightbox(item, triggerEl) {
      ensureLightboxInBody();
      lastFocusedEl = triggerEl || document.activeElement;
      lbCurrentItem = item;

      lb.classList.toggle("is-video", item.kind === "video");
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
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        lbMedia.appendChild(img);

      } else if (item.kind === "video") {
        const v = document.createElement("video");
        v.controls = true;
        v.playsInline = true;
        v.preload = "metadata";
        v.src = item.src;
        v.style.width = "100%";
        v.style.height = "100%";
        v.style.objectFit = "contain";

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

      } else if (item.kind === "pdf") {
        // Most reliable: iframe viewer
        const frame = document.createElement("iframe");
        frame.src = item.src;
        frame.title = item.title || "PDF document";
        frame.style.width = "100%";
        frame.style.height = "100%";
        frame.style.border = "0";
        frame.loading = "eager";
        lbMedia.appendChild(frame);

        // Optional: show caption/description if you want
        lbTitle.textContent = item.title || "";
      }

      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => sizeLightboxToItem(item));
      requestAnimationFrame(() => lbCloseBtn.focus({ preventScroll: true }));
    }

    function closeLightbox() {
      if (!isOpen()) return;

      const restore = lastFocusedEl;
      lastFocusedEl = null;
      if (restore && restore instanceof HTMLElement && restore.isConnected) {
        try { restore.focus({ preventScroll: true }); } catch {}
      }

      if (lbCurrentVideo) {
        try { lbCurrentVideo.pause(); } catch {}
        lbCurrentVideo.removeAttribute("src");
        try { lbCurrentVideo.load(); } catch {}
        lbCurrentVideo = null;
      }

      lbCurrentItem = null;
      lbMedia.innerHTML = "";
      lbMedia.style.width = "";
      lbMedia.style.height = "";
      lb.classList.remove("is-video");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    masonry.addEventListener("click", (ev) => {
      const li = ev.target.closest("li");
      if (!li || !masonry.contains(li)) return;

      if (li.classList.contains("doc-tile")) return;

      const idx = Number(li.dataset.idx);
      const item = (window.MEDIA || [])[idx];
      if (!item) return;

      if (item.kind === "pdf") {
        window.open(item.src, "_blank", "noopener");
        return;
      }

      openLightbox(item, li);
    });

    if (lb.dataset.bound !== "1") {
      lb.dataset.bound = "1";

      lb.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.hasAttribute("data-lb-close")) closeLightbox();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen()) closeLightbox();
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

      window.addEventListener("resize", () => {
        if (isOpen() && lbCurrentItem) sizeLightboxToItem(lbCurrentItem);
      }, { passive: true });

      lb.setAttribute("aria-hidden", "true");
    }
  }

  // =========================
  // 8) Tilt (fast quickSetters)
  // =========================
  function initOceanTilt(root) {
    if (!window.gsap) return;
    if (root.dataset.tiltInit === "1") return;
    root.dataset.tiltInit = "1";

    const strength = 5;
    const smoothing = 0.12;

    root.querySelectorAll(".ocean-tilt").forEach((container) => {
      const card = container.querySelector(".ocean-card");
      if (!card) return;

      let r = null;
      let center = { x: 0, y: 0 };
      let target = { x: 0, y: 0 };
      let current = { x: 0, y: 0 };
      let rafId = null;

      const setRX = gsap.quickSetter(card, "rotateX", "deg");
      const setRY = gsap.quickSetter(card, "rotateY", "deg");
      const setX = gsap.quickSetter(card, "x", "px");
      const setY = gsap.quickSetter(card, "y", "px");

      function updateRect() {
        r = card.getBoundingClientRect();
        center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }

      function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

      function tick() {
        current.x += (target.x - current.x) * smoothing;
        current.y += (target.y - current.y) * smoothing;

        setRX(current.y * -strength);
        setRY(current.x * strength);
        setX(current.x * 10);
        setY(current.y * 10);

        rafId = requestAnimationFrame(tick);
      }

      function setTargetFromEvent(e) {
        if (!r) updateRect();
        const dx = (e.clientX - center.x) / (r.width / 2);
        const dy = (e.clientY - center.y) / (r.height / 2);
        target.x = clamp(dx, -1, 1);
        target.y = clamp(dy, -1, 1);
      }

      container.addEventListener("pointerenter", (e) => {
        updateRect();
        gsap.set(card, { willChange: "transform", transformPerspective: 900 });
        setTargetFromEvent(e);
        if (!rafId) rafId = requestAnimationFrame(tick);
      });

      container.addEventListener("pointermove", (e) => setTargetFromEvent(e));

      container.addEventListener("pointerleave", () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        target = { x: 0, y: 0 };
        current = { x: 0, y: 0 };
        r = null;

        gsap.to(card, {
          rotateX: 0, rotateY: 0, x: 0, y: 0,
          duration: 0.9, ease: "expo.out", overwrite: true,
          onComplete: () => gsap.set(card, { willChange: "auto" })
        });
      });
    });
  }

  // =========================
  // 9) In-view videos
  // =========================
  function initInViewVideos(root) {
    if (!("IntersectionObserver" in window)) return;
    if (root._inviewObs) root._inviewObs.disconnect();

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const box = entry.target;
          if (!(box instanceof HTMLElement)) continue;

          if (entry.isIntersecting && entry.intersectionRatio > 0.08) {
            ensureVideo(box);
            playVideo(box);
          } else {
            pauseVideo(box);
          }
        }
      },
      { root: null, rootMargin: "180px 0px 180px 0px", threshold: [0, 0.08] }
    );

    root._inviewObs = obs;
    root.querySelectorAll(".js-inview-video").forEach((el) => obs.observe(el));

    function ensureVideo(box) {
      if (box.querySelector("video.grid-video")) return;
      const src = box.getAttribute("data-video-src");
      if (!src) return;

      const v = document.createElement("video");
      v.className = "grid-video";
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.autoplay = true;
      v.preload = "metadata";
      v.src = src;

      const show = () => box.classList.add("is-video-active");
      v.addEventListener("playing", show, { once: true });
      v.addEventListener("canplay", show, { once: true });

      box.appendChild(v);
    }

    function playVideo(box) {
      const v = box.querySelector("video.grid-video");
      if (!v) return;
      v.play()
        .then(() => box.classList.add("is-video-active"))
        .catch(() => box.classList.remove("is-video-active"));
    }

    function pauseVideo(box) {
      const v = box.querySelector("video.grid-video");
      if (!v) return;
      try { v.pause(); } catch {}
      box.classList.remove("is-video-active");
    }
  }

  // =========================
  // 10) Helpers
  // =========================
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

  // =========================
  // 11) Hooks for Hydejack / navigation
  // =========================
  function hookAllLoads(cb) {
    // normal load paths
    document.addEventListener("DOMContentLoaded", cb, { passive: true });
    window.addEventListener("load", cb, { passive: true });
    window.addEventListener("pageshow", cb, { passive: true });

    // Hydejack PJAX: prefer binding to the <hy-push-state> element
    const ps = document.getElementById("_pushState");
    if (ps) ps.addEventListener("hy-push-state-load", cb, { passive: true });

    // keep document listener too (harmless, helps if theme version dispatches there)
    document.addEventListener("hy-push-state-load", cb, { passive: true });

    // Turbo (if present)
    document.addEventListener("turbo:load", cb, { passive: true });
  }

  hookAllLoads(() => scheduleBoot(0));

})();
