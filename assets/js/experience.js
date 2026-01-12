(function () {
  // Define once
  if (window.CollapsibleTimeline) return;

  class CollapsibleTimeline {
    constructor(selector, opts = {}) {
      this.el = typeof selector === "string" ? document.querySelector(selector) : selector;
      if (!this.el) return;

      // ✅ prevent multiple instances on the same element
      if (this.el.__collapsibleTimelineInstance) return this.el.__collapsibleTimelineInstance;
      this.el.__collapsibleTimelineInstance = this;

      this.idPrefix = opts.idPrefix || "item";
      this.animation = null;

      // bind once so we can de-dupe listeners
      this._onClick = this.itemAction.bind(this);

      this.init();
    }

    init() {
      // ✅ prevent multiple listeners on the same element
      if (this.el.dataset.ctBound === "1") return;
      this.el.dataset.ctBound = "1";

      this.el.addEventListener("click", this._onClick);
    }

    animateItemAction(button, ctrld, contentHeight, shouldCollapse, shouldScroll = false) {
      const expandedClass = "timeline__item-body--expanded";
      const animOptions = { duration: 300, easing: "cubic-bezier(0.65,0,0.35,1)" };

      if (shouldCollapse) {
        button.ariaExpanded = "false";
        ctrld.ariaHidden = "true";
        ctrld.classList.remove(expandedClass);
        animOptions.duration *= 2;

        this.animation = ctrld.animate(
          [{ height: `${contentHeight}px` }, { height: `${contentHeight}px` }, { height: "0px" }],
          animOptions
        );
      } else {
        button.ariaExpanded = "true";
        ctrld.ariaHidden = "false";
        ctrld.classList.add(expandedClass);

        this.animation = ctrld.animate([{ height: "0px" }, { height: `${contentHeight}px` }], animOptions);

        // ✅ only scroll when explicitly asked (single-item clicks)
        if (shouldScroll) {
          const itemEl = button.closest(".timeline__item");
          if (itemEl) itemEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }


    itemAction(e) {
      // ✅ use closest so clicks on the SVG still resolve to the button
      const actionBtn = e.target.closest("[data-action]");
      const itemBtn = e.target.closest("[data-item]");

      if (actionBtn) {
        const action = actionBtn.getAttribute("data-action");
        const targetExpanded = action === "expand" ? "false" : "true";
        const buttons = Array.from(this.el.querySelectorAll(`[aria-expanded="${targetExpanded}"]`));
        const wasExpanded = action === "collapse";

        for (const button of buttons) {
          const buttonID = button.getAttribute("data-item");
          const ctrld = this.el.querySelector(`#${this.idPrefix}${buttonID}-ctrld`);
          const contentHeight = ctrld?.firstElementChild?.offsetHeight || 0;

          // ✅ NO per-item scroll during bulk actions
          this.animateItemAction(button, ctrld, contentHeight, wasExpanded, false);
        }

        // ✅ after Expand All, scroll to the first item (or top of timeline)
        if (action === "expand") {
          requestAnimationFrame(() => {
            const firstItem = this.el.querySelector(".timeline__item");
            if (firstItem) firstItem.scrollIntoView({ behavior: "smooth", block: "start" });
            // alternatively: this.el.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }

        return;
      }


      if (itemBtn) {
        const item = itemBtn.getAttribute("data-item");
        const expanded = itemBtn.getAttribute("aria-expanded");
        const wasExpanded = expanded === "true";

        const ctrld = this.el.querySelector(`#${this.idPrefix}${item}-ctrld`);
        const contentHeight = ctrld?.firstElementChild?.offsetHeight || 0;
        this.animateItemAction(itemBtn, ctrld, contentHeight, wasExpanded, true);
      }
    }
  }

  window.CollapsibleTimeline = CollapsibleTimeline;
})();
