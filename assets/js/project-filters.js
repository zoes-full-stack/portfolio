
(() => {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".p-card"));

  const categoryGroup = document.querySelector('[data-filter-group="category"]');
  const tagGroup = document.querySelector('[data-filter-group="tag"]'); // may be null if section is commented
  const searchInput = document.getElementById("projectSearch");
  const featuredOnly = document.getElementById("featuredOnly");

  const state = {
    category: "all",
    tags: new Set(),
    search: "",
    featured: false
  };

  const setActiveSingle = (groupEl, btn) => {
    if (!groupEl) return;
    groupEl.querySelectorAll(".pill").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  };

  const syncTagPills = () => {
    if (!tagGroup) return; // ✅ guard
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

      // ✅ If tag UI is disabled, ignore tag filtering entirely
      const okTags = !tagGroup || state.tags.size === 0 || tags.some(t => state.tags.has(t));

      const okFeatured = !state.featured || featured;
      const okSearch = !q || haystack.includes(q);

      card.classList.toggle("is-hidden", !(okCat && okTags && okFeatured && okSearch));
    });
  };

  // Category (single-select)
  categoryGroup?.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.filter;
      setActiveSingle(categoryGroup, btn);
      apply();
    });
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
    });
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
  syncTagPills(); // safe now
  apply();
})();
