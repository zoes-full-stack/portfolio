(() => {
  const bean = document.getElementById("magical-bean");
  const toggle = document.getElementById("bean-menu-open");
  if (!bean || !toggle) return;

  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (!isTouch) return;

  bean.style.cursor = "pointer";

  bean.addEventListener("click", (e) => {
    // Don't steal clicks from the actual menu (buttons/links)
    if (e.target.closest(".fab-menu")) return;

    toggle.checked = !toggle.checked;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
  });
})();
