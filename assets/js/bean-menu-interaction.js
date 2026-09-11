(() => {
  const bean = document.getElementById("magical-bean");
  const toggle = document.getElementById("bean-menu-open");
  if (!bean || !toggle) return;

  bean.style.cursor = "pointer";

  // 'click' is much more reliable for detecting taps on mobile than 'pointerup'
  bean.addEventListener("click", (e) => {
    // Let real controls behave normally (e.g. clicking the hamburger button)
    if (e.target.closest(".menu-item")) return;
    if (e.target.closest(".menu-open-button")) return;
    if (e.target.closest("a, button, input, label")) return;

    // Toggle the checkbox manually for taps on the main bean body
    toggle.checked = !toggle.checked;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
  });
})();
