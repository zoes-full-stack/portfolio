/* assets/js/console-love.js
   Friendly console message (Hydejack/PJAX safe)
*/
(() => {
  const msg = () => {
    // Avoid spamming if Hydejack triggers multiple load hooks
    if (window.__gabbyConsoleLoveShown) return;
    window.__gabbyConsoleLoveShown = true;

    const titleStyle = [
      "font-size:16px",
      "font-weight:700",
      "color:#0DCCD1",
      "text-shadow:0 1px 0 rgba(0,0,0,0.25)"
    ].join(";");

    const bodyStyle = [
      "font-size:12px",
      "color:#F6FDFF"
    ].join(";");

    const accentStyle = [
      "font-size:12px",
      "color:#FF8A73",
      "font-weight:600"
    ].join(";");

    console.log("%cHello 👋", titleStyle);
    console.log("%cThis site was made with %clove %c(and lots of custom work).", bodyStyle, accentStyle, bodyStyle);
    console.log("%cHydejack powers some plumbing (sidebar + config), and most pages/sections are custom.", bodyStyle);
  };

  // Run on normal load
  const run = () => requestAnimationFrame(() => requestAnimationFrame(msg));

  if (document.readyState === "interactive" || document.readyState === "complete") run();
  else document.addEventListener("DOMContentLoaded", run, { passive: true });

  // Hydejack PJAX hook
  const ps = document.getElementById("_pushState");
  if (ps) ps.addEventListener("hy-push-state-load", run, { passive: true });
  document.addEventListener("hy-push-state-load", run, { passive: true });

  // Turbo (harmless if unused)
  document.addEventListener("turbo:load", run, { passive: true });
})();
