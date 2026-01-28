/* assets/js/projects-filters.js
   Projects filters (Hydejack-safe)
   - Works on first load + PJAX navigations
   - Safe if tag UI is commented out
   - No double-binding
*/

(function () {
  // ----------------------------
  // Hook all relevant load paths
  // ----------------------------
  function hookAllLoads(cb) {
    document.addEventListener("DOMContentLoaded", cb, { passive: true });
    window.addEventListener("load", cb, { passive: true });
    window.addEventListener("pageshow", cb, { passive: true });

    const ps = document.getElementById("_pushState");
    if (ps) ps.addEventListener("hy-push-state-load", cb, { passive: true });

    document.addEventListener("hy-push-state-load", cb, { passive: true });
    document.addEventListener("turbo:load", cb, { passive: true });
  }

  let bootTimer = null;
  function scheduleBoot(delay = 0) {
    if (bootTimer) clearTimeout(bootTimer);
    bootTimer = setTimeout(() => {
      bootTimer = null;
      boot();
    }, delay);
  }

  // ----------------------------
  // Init (bind once per page DOM)
  // ----------------------------
  function initProjectsFilters(root = document) {
    const grid = root.getElementById("projectsGrid");
    if (!grid) return false;

    // Prevent double-binding (critical on PJAX)
    if (grid.dataset.filtersBound === "1") return true;
    grid.dataset.filtersBound = "1";

    const cards = Array.from(grid.querySelectorAll(".p-card"));

    const categoryGroup = root.querySelector('[data-filter-group="category"]');
    const tagGroup = root.querySelector('[data-filter-group="tag"]'); // may be null
    const searchInput = root.getElementById("projectSearch");
    const featuredOnly = root.getElementById("featuredOnly");

    const state = {
      category: "all",
      tags: new Set(),
      search: "",
      featured: false
    };

    const setActiveSingle = (groupEl, btn) => {
      if (!groupEl || !btn) return;
      groupEl.querySelectorAll(".pill").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    };

    const syncTagPills = () => {
      if (!tagGroup) return;
      const pills = Array.from(tagGroup.querySelectorAll(".pill"));
      const allBtn = pills.find(p => p.dataset.filter === "all");
      const tagBtns = pills.filter(p => p.dataset.filter !== "all");

      tagBtns.forEach(btn => {
        btn.classList.toggle("is-active", state.tags.has(btn.dataset.filter));
      });

      if (allBtn) allBtn.classList.toggle("is-active", state.tags.size === 0);
    };

    const apply = () => {
      const q = state.search.trim().toLowerCase();

      cards.forEach(card => {
        const cat = card.dataset.category || "";
        const tags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
        const featured = (card.dataset.featured || "false") === "true";
        const haystack = card.dataset.search || "";

        const okCat = state.category === "all" || cat === state.category;

        // If tag UI is disabled, ignore tag filtering entirely
        const okTags = !tagGroup || state.tags.size === 0 || tags.some(t => state.tags.has(t));

        const okFeatured = !state.featured || featured;
        const okSearch = !q || haystack.includes(q);

        card.classList.toggle("is-hidden", !(okCat && okTags && okFeatured && okSearch));
      });
    };

    // Category (single-select)
    categoryGroup?.querySelectorAll(".pill").forEach(btn => {
      btn.addEventListener("click", () => {
        state.category = btn.dataset.filter || "all";
        setActiveSingle(categoryGroup, btn);
        apply();
      }, { passive: true });
    });

    // Tags (multi-select) - only if tag UI exists
    tagGroup?.querySelectorAll(".pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;

        if (f === "all") {
          state.tags.clear();
          syncTagPills();
          apply();
          return;
        }

        if (state.tags.has(f)) state.tags.delete(f);
        else state.tags.add(f);

        syncTagPills();
        apply();
      }, { passive: true });
    });

    // Search (debounced)
    let t = null;
    searchInput?.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.search = searchInput.value || "";
        apply();
      }, 120);
    });

    // Featured toggle
    featuredOnly?.addEventListener("change", () => {
      state.featured = !!featuredOnly.checked;
      apply();
    });

    // Init
    syncTagPills();
    apply();

    return true;
  }

  // ----------------------------
  // Boot w/ retries (for PJAX timing)
  // ----------------------------
  function boot(retries = 30) {
    // Let Hydejack finish injecting, and layout settle
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ok = initProjectsFilters(document);
        if (!ok && retries > 0) setTimeout(() => boot(retries - 1), 80);
      });
    });
  }

  hookAllLoads(() => scheduleBoot(0));
})();
