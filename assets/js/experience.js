/* assets/js/experience.js
   Collapsible Timeline (Hydejack-safe, buttery height)
   - Open: 0 -> px -> auto
   - Close: px -> 0
   - No auto scroll/jump
   - ✅ First Work Experience item open by default
*/

function isDesktop() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

(function () {
  // ----------------------------
  // Hook all relevant load paths
  // ----------------------------
  function hookAllLoads(cb) {
    document.addEventListener("DOMContentLoaded", cb, { passive: true });
    window.addEventListener("load", cb, { passive: true });
    window.addEventListener("pageshow", cb, { passive: true });

    // Hydejack PJAX: bind to the <hy-push-state> element when possible
    const ps = document.getElementById("_pushState");
    if (ps) ps.addEventListener("hy-push-state-load", cb, { passive: true });

    // fallback: some theme versions dispatch on document
    document.addEventListener("hy-push-state-load", cb, { passive: true });

    // Turbo (if present)
    document.addEventListener("turbo:load", cb, { passive: true });
  }

  // ----------------------------
  // Define class once (global)
  // ----------------------------
  if (!window.CollapsibleTimeline) {
    class CollapsibleTimeline {
      constructor(selector, opts = {}) {
        this.el = typeof selector === "string" ? document.querySelector(selector) : selector;
        if (!this.el) return;

        if (this.el.__collapsibleTimelineInstance) return this.el.__collapsibleTimelineInstance;
        this.el.__collapsibleTimelineInstance = this;

        this.idPrefix = opts.idPrefix || "item";
        this._onClick = this.itemAction.bind(this);

        this.init();
      }

      init() {
        if (this.el.dataset.ctBound === "1") return;
        this.el.dataset.ctBound = "1";
        this.el.addEventListener("click", this._onClick);
      }

      _contentHeight(ctrld) {
        const inner = ctrld?.firstElementChild;
        if (!inner) return 0;
        return inner.scrollHeight || inner.offsetHeight || 0;
      }

      _cancelAnim(ctrld) {
        if (!ctrld) return;
        try { if (ctrld.__ctAnim) ctrld.__ctAnim.cancel(); } catch {}
        ctrld.__ctAnim = null;
      }

      _ensureClosedStyles(ctrld) {
        if (!ctrld) return;
        ctrld.style.overflow = "hidden";
        ctrld.style.height = "0px";
      }

      _ensureOpenStyles(ctrld) {
        if (!ctrld) return;
        ctrld.style.overflow = "visible";
        ctrld.style.height = "auto";
      }

      openItem(button, ctrld, shouldScroll = true) {
        if (!button || !ctrld) return;

        const expandedClass = "timeline__item-body--expanded";
        const targetH = this._contentHeight(ctrld);

        this._cancelAnim(ctrld);

        button.ariaExpanded = "true";
        ctrld.ariaHidden = "false";
        ctrld.classList.add(expandedClass);

        ctrld.style.overflow = "hidden";
        ctrld.style.height = "0px";

        const anim = ctrld.animate(
          [{ height: "0px" }, { height: `${targetH}px` }],
          { duration: 320, easing: "cubic-bezier(0.65,0,0.35,1)" }
        );

        ctrld.__ctAnim = anim;

        anim.onfinish = () => {
          this._ensureOpenStyles(ctrld);
          ctrld.__ctAnim = null;

          if (shouldScroll && isDesktop()) {
            const rect = button.getBoundingClientRect();
            const offset = window.scrollY + rect.top - 120;

            window.scrollTo({
              top: offset,
              behavior: "smooth"
            });
          }
        };
      }

      closeItem(button, ctrld) {
        if (!button || !ctrld) return;

        const expandedClass = "timeline__item-body--expanded";

        this._cancelAnim(ctrld);

        // If open is 'auto', lock to px first so animation has a start value
        const currentH = Math.max(0, Math.round(ctrld.getBoundingClientRect().height || this._contentHeight(ctrld)));

        button.ariaExpanded = "false";
        ctrld.ariaHidden = "true";
        ctrld.classList.remove(expandedClass);

        ctrld.style.overflow = "hidden";
        ctrld.style.height = `${currentH}px`;

        const anim = ctrld.animate(
          [{ height: `${currentH}px` }, { height: "0px" }],
          { duration: 420, easing: "cubic-bezier(0.65,0,0.35,1)" }
        );

        ctrld.__ctAnim = anim;

        anim.onfinish = () => {
          this._ensureClosedStyles(ctrld);
          ctrld.__ctAnim = null;
        };
        anim.oncancel = () => (ctrld.__ctAnim = null);
      }

      itemAction(e) {
        const actionBtn = e.target.closest("[data-action]");
        const itemBtn = e.target.closest("[data-item]");

        // Expand All / Collapse All
        if (actionBtn) {
          const action = actionBtn.getAttribute("data-action");
          const expand = action === "expand";

          const buttons = Array.from(this.el.querySelectorAll("[data-item]"));

          for (const button of buttons) {
            const item = button.getAttribute("data-item");
            const ctrld = this.el.querySelector(`#${this.idPrefix}${item}-ctrld`);
            if (!ctrld) continue;

            const isExpanded = button.getAttribute("aria-expanded") === "true";

            if (expand && !isExpanded) {
              // 🚫 no scroll when Expand All
              this.openItem(button, ctrld, false);
            }

            if (!expand && isExpanded) {
              this.closeItem(button, ctrld);
            }
          }

          return;
        }

        // Single toggle (NO scroll/jump)
        if (itemBtn) {
          const item = itemBtn.getAttribute("data-item");
          const ctrld = this.el.querySelector(`#${this.idPrefix}${item}-ctrld`);
          if (!ctrld) return;

          const isExpanded = itemBtn.getAttribute("aria-expanded") === "true";
          if (isExpanded) this.closeItem(itemBtn, ctrld);
          else this.openItem(itemBtn, ctrld);
        }
      }
    }

    window.CollapsibleTimeline = CollapsibleTimeline;
  }

  // ----------------------------
  // Init timelines (with retry)
  // ----------------------------
  function initTimelineOnce(selector, idPrefix) {
    const el = document.querySelector(selector);
    if (!el) return false;

    if (el.dataset.timelineInit === "1") return true;
    el.dataset.timelineInit = "1";

    // ✅ Open first item by default (only for work experience timeline)
    if (selector === "#experienceTimeline") {
      const firstBtn = el.querySelector("[data-item]");
      if (firstBtn) {
        const item = firstBtn.getAttribute("data-item");
        const firstPanel = item ? el.querySelector(`#${idPrefix}${item}-ctrld`) : null;

        firstBtn.setAttribute("aria-expanded", "true");

        if (firstPanel) {
          firstPanel.setAttribute("aria-hidden", "false");
          firstPanel.classList.add("timeline__item-body--expanded");
          firstPanel.style.overflow = "visible";
          firstPanel.style.height = "auto";
        }
      }
    }

    // ensure all panels are truly collapsed at first paint
    el.querySelectorAll(".timeline__item-body").forEach((panel) => {
      const btnId = panel.getAttribute("aria-labelledby");
      const btn = btnId ? document.getElementById(btnId) : null;
      const expanded = btn?.getAttribute("aria-expanded") === "true";
      if (!expanded) {
        panel.style.overflow = "hidden";
        panel.style.height = "0px";
      }
    });

    new window.CollapsibleTimeline(el, { idPrefix });
    return true;
  }

  let bootTimer = null;

  function scheduleBoot(delay = 0) {
    if (bootTimer) clearTimeout(bootTimer);
    bootTimer = setTimeout(() => {
      bootTimer = null;
      boot();
    }, delay);
  }

  function boot(retries = 30) {
    const okExp = initTimelineOnce("#experienceTimeline", "exp-item");
    const okRes = initTimelineOnce("#researchTimeline", "res-item");

    // If PJAX injected content after we ran, retry briefly
    if ((!okExp && document.querySelector("#experienceTimeline") == null) ||
        (!okRes && document.querySelector("#researchTimeline") == null)) {
      if (retries > 0) setTimeout(() => boot(retries - 1), 80);
    }
  }

  hookAllLoads(() => scheduleBoot(0));
})();
