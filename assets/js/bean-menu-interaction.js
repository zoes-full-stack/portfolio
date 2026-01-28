(() => {
  const bean = document.getElementById("magical-bean");
  const toggle = document.getElementById("bean-menu-open");
  if (!bean || !toggle) return;

  // More reliable “touch” detection than matchMedia on some mobile browsers
  const isTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  if (!isTouch) return;

  bean.style.cursor = "pointer";

  // Use pointer events (more consistent on mobile)
  bean.addEventListener("pointerup", (e) => {
    // Let real controls behave normally
    if (e.target.closest(".menu-item")) return;        // links
    if (e.target.closest(".menu-open-button")) return; // hamburger button/label
    if (e.target.closest("a, button, input, label")) return;

    toggle.checked = !toggle.checked;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
  });
})();
