(() => {
  const beam = document.querySelector(".submarine-body .light");
  const section = document.querySelector(".submarine-section");
  if (!beam || !section) return;

  // Base angle matches your current rotate
  const base = -50;         // degrees
  const maxTilt = 10;       // +/- tilt range
  const maxLift = 10;       // px up/down

  let targetTilt = 0;
  let targetLift = 0;
  let curTilt = 0;
  let curLift = 0;

  // only run on pointer devices (avoid mobile cost)
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) return;

  function onMove(e) {
    const r = section.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;   // 0..1
    const y = (e.clientY - r.top) / r.height;   // 0..1

    // map center -> tilt
    targetTilt = (x - 0.5) * 2 * maxTilt;      // -maxTilt..+maxTilt
    targetLift = (0.5 - y) * 2 * maxLift;      // +up when mouse higher
  }

  section.addEventListener("pointermove", onMove, { passive: true });

  function tick() {
    // ease toward target (smooth and cheap)
    curTilt += (targetTilt - curTilt) * 0.08;
    curLift += (targetLift - curLift) * 0.08;

    beam.style.transform =
      `translate3d(0, ${curLift.toFixed(2)}px, 0) rotate(${(base + curTilt).toFixed(2)}deg)`;

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
