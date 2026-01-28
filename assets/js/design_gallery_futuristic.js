// ----------------------
// initOceanGallery(rootSelectorOrEl, mediaArray)
// ----------------------
function initOceanGallery(root, media) {
  const el = typeof root === "string" ? document.querySelector(root) : root;
  if (!el) return;

  const masonry = el.querySelector("[data-masonry]");
  const loading = el.querySelector(".ocean-gallery__loading");
  const line = el.querySelector(".ocean-gallery__line");
  const counter = el.querySelector(".ocean-gallery__counter");

  const modal = el.querySelector("[data-modal]");
  const modalMedia = el.querySelector("[data-modal-media]");
  const modalTitle = el.querySelector("[data-modal-title]");
  const modalMuteBtn = el.querySelector("[data-modal-mute]");
  const modalSrc = el.querySelector("[data-modal-src]");

  // -------- Masonry sizing helpers
  const rowSize = () => parseFloat(getComputedStyle(el).getPropertyValue("--row")) || 10;
  const gapSize = () => parseFloat(getComputedStyle(el).getPropertyValue("--gap")) || 14;

  function resizeItem(item) {
    if (!masonry) return;

    if (item.classList.contains("ocean-gallery__item--header")) {
      item.style.gridRowEnd = "auto";
      return;
    }

    const row = rowSize();
    const gap = gapSize();
    const content = item.querySelector(".ocean-gallery__btnItem") || item;
    const height = content.getBoundingClientRect().height;
    const span = Math.ceil((height + gap) / (row + gap));
    item.style.gridRowEnd = `span ${span}`;
  }

  function resizeAll() {
    masonry.querySelectorAll(".ocean-gallery__item").forEach(resizeItem);
  }

  // -------- Modal
  let activeVideo = null;

  function openModal(item) {
    modal.setAttribute("data-open", "true");
    modal.setAttribute("aria-hidden", "false");

    modalMedia.innerHTML = "";
    modalTitle.textContent = item.title || "";

    if (item.src) {
      modalSrc.hidden = false;
      modalSrc.href = item.src;
    } else {
      modalSrc.hidden = true;
    }

    if (item.kind === "image") {
      modalMuteBtn.hidden = true;
      const img = new Image();
      img.alt = item.title || "Image";
      img.src = item.src;
      img.decoding = "async";
      modalMedia.appendChild(img);
      return;
    }

    if (item.kind === "video") {
      const v = document.createElement("video");
      v.src = item.src;
      v.controls = true;
      v.playsInline = true;
      v.preload = "metadata";
      v.poster = item.thumb || "";
      v.loop = true;

      // user initiated click, so audio allowed if hasAudio
      v.muted = item.hasAudio ? false : true;

      modalMuteBtn.hidden = false;
      modalMuteBtn.textContent = v.muted ? "🔇 Muted" : "🔊 Sound on";

      activeVideo = v;
      v.play().catch(() => {});
      modalMedia.appendChild(v);
    }
  }

  function closeModal() {
    modal.setAttribute("data-open", "false");
    modal.setAttribute("aria-hidden", "true");

    if (activeVideo) {
      try {
        activeVideo.pause();
        activeVideo.src = "";
      } catch {}
      activeVideo = null;
    }
    modalMedia.innerHTML = "";
    modalMuteBtn.hidden = true;
  }

  el.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-close")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("data-open") === "true") closeModal();
  });

  modalMuteBtn.addEventListener("click", () => {
    if (!activeVideo) return;
    activeVideo.muted = !activeVideo.muted;
    modalMuteBtn.textContent = activeVideo.muted ? "🔇 Muted" : "🔊 Sound on";
  });

  // -------- Render items
  function createHeaderItem(html) {
    const item = document.createElement("div");
    item.className = "ocean-gallery__item ocean-gallery__item--header";
    item.setAttribute("role", "listitem");

    const inner = document.createElement("div");
    inner.className = "ocean-gallery__headerContent";
    inner.innerHTML = html;

    item.appendChild(inner);
    return item;
  }

  function createMediaItem(entry) {
    const item = document.createElement("div");
    item.className = "ocean-gallery__item";
    item.setAttribute("role", "listitem");

    const btn = document.createElement("button");
    btn.className = "ocean-gallery__btnItem";
    btn.type = "button";
    btn.setAttribute("aria-label", `${entry.kind}: ${entry.title || "Open"}`);

    const frame = document.createElement("div");
    frame.className = "ocean-gallery__frame";
    frame.style.setProperty("--ar", "4 / 5");

    if (entry.kind === "image") {
      const img = new Image();
      img.className = "ocean-gallery__img";
      img.alt = entry.title || "Image";
      img.loading = "lazy";
      img.decoding = "async";
      img.src = entry.src;

      img.addEventListener("load", () => {
        if (img.naturalWidth && img.naturalHeight) {
          frame.style.setProperty("--ar", `${img.naturalWidth} / ${img.naturalHeight}`);
        }
        requestAnimationFrame(() => resizeItem(item));
      });

      frame.appendChild(img);
    }

    if (entry.kind === "video") {
      const poster = new Image();
      poster.className = "ocean-gallery__img";
      poster.alt = entry.title || "Video";
      poster.loading = "lazy";
      poster.decoding = "async";
      poster.src = entry.thumb;

      poster.addEventListener("load", () => {
        if (poster.naturalWidth && poster.naturalHeight) {
          frame.style.setProperty("--ar", `${poster.naturalWidth} / ${poster.naturalHeight}`);
        }
        requestAnimationFrame(() => resizeItem(item));
      });

      frame.appendChild(poster);

      item.dataset.kind = "video";
      item.dataset.src = entry.src;
      item.dataset.thumb = entry.thumb;
      item.dataset.hasAudio = entry.hasAudio ? "1" : "0";
    }

    const meta = document.createElement("div");
    meta.className = "ocean-gallery__meta";

    const title = document.createElement("div");
    title.className = "ocean-gallery__itemTitle";
    title.textContent = entry.title || "";

    const badges = document.createElement("div");
    badges.className = "ocean-gallery__badges";

    if (entry.kind === "video") {
      const vb = document.createElement("div");
      vb.className = "ocean-gallery__badge ocean-gallery__badge--video";
      vb.textContent = "🎞 video";
      badges.appendChild(vb);

      if (entry.hasAudio) {
        const ab = document.createElement("div");
        ab.className = "ocean-gallery__badge ocean-gallery__badge--audio";
        ab.textContent = "🔊 audio";
        badges.appendChild(ab);
      }
    }

    meta.appendChild(title);
    meta.appendChild(badges);

    btn.appendChild(frame);
    btn.appendChild(meta);

    btn.addEventListener("click", () => openModal(entry));

    item.appendChild(btn);
    return item;
  }

  function build() {
    masonry.innerHTML = "";
    for (const entry of media) {
      if (entry.kind === "header") masonry.appendChild(createHeaderItem(entry.title));
      else masonry.appendChild(createMediaItem(entry));
    }
  }

  // -------- Loading overlay: preload images + video thumbs only
  function preload(paths) {
    return new Promise((resolve) => {
      const list = paths.filter(Boolean);
      if (!list.length) return resolve();

      let loaded = 0;
      let percentage = 0;
      let num = 0;

      function doneOne() {
        loaded++;
        percentage = Math.floor((loaded / list.length) * 100);
      }

      list.forEach((src) => {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
        img.addEventListener("load", doneOne, { once: true });
        img.addEventListener("error", doneOne, { once: true });
      });

      function tick() {
        if (num < percentage) num++;

        line.style.width = `${num}%`;
        counter.textContent = `${num}%`;

        if (num >= 100) {
          setTimeout(() => {
            loading.classList.add("is-loaded");
            line.classList.add("is-loaded");
            counter.classList.add("is-loaded");
            resolve();
          }, 250);
          return;
        }
        requestAnimationFrame(tick);
      }

      tick();
    });
  }

  // -------- Lazy autoplay for silent videos only
  function setupVideoIntersection() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          const item = ent.target;
          if (item.dataset.kind !== "video") return;
          if (item.dataset.hasAudio === "1") return; // audio videos stay as poster in grid

          const frame = item.querySelector(".ocean-gallery__frame");
          if (!frame) return;

          const existing = frame.querySelector("video");

          if (ent.isIntersecting) {
            if (!existing) {
              const v = document.createElement("video");
              v.className = "ocean-gallery__video";
              v.src = item.dataset.src;
              v.poster = item.dataset.thumb || "";
              v.preload = "none";
              v.muted = true;
              v.loop = true;
              v.playsInline = true;

              const poster = frame.querySelector("img");
              if (poster) poster.style.display = "none";

              frame.appendChild(v);
              v.play().catch(() => {});
              requestAnimationFrame(() => resizeItem(item));
            } else {
              existing.play().catch(() => {});
            }
          } else {
            if (existing) existing.pause();
          }
        });
      },
      { threshold: 0.55 }
    );

    masonry.querySelectorAll(".ocean-gallery__item").forEach((item) => {
      if (item.dataset.kind === "video") io.observe(item);
    });
  }

  // -------- Boot
  build();

  const preloadPaths = media.flatMap((m) => {
    if (m.kind === "image") return [m.src];
    if (m.kind === "video") return [m.thumb];
    return [];
  });

  preload(preloadPaths).then(() => {
    resizeAll();
    setupVideoIntersection();
  });

  window.addEventListener("resize", () => resizeAll(), { passive: true });
}

// Example usage:
// initOceanGallery('#oceanGallery', MEDIA);
