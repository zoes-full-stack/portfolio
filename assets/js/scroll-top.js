/* assets/js/scroll-top.js
 *
 * Scroll-to-top Bean
 * Hydejack / PJAX / Turbo safe
 *
 * - Creates one global button
 * - Shows only near bottom
 * - Bean changes expression on hover
 * - Arrow bounces on hover
 * - Bean flies upward on click
 * - Page jumps to top without smooth scrolling
 * - Cleans up listeners/timers before SPA re-init
 */

(() => {

  const SELECTOR = ".scroll-top";
  const NEAR_BOTTOM_PX = 600;

  let btn = null;
  let ticking = false;
  let flightTimer = null;

  let cleanupButton = null;


  /* =======================================================
     BUILD
     ======================================================= */

  function buildButton() {

    const existing = document.querySelector(SELECTOR);

    if (existing) {
      return existing;
    }

    const button = document.createElement("button");

    button.type = "button";
    button.className = "scroll-top";

    button.setAttribute(
      "aria-label",
      "Scroll to top"
    );

    button.innerHTML = `
      <div class="scroll-top-center">

        <div class="scroll-top-round">

          <div
            class="scroll-top-bean"
            aria-hidden="true"
          >

            <span
              class="scroll-top-bean-arm
                     scroll-top-bean-arm-left"
            ></span>

            <span
              class="scroll-top-bean-arm
                     scroll-top-bean-arm-right"
            ></span>

            <span class="scroll-top-bean-body">

              <span
                class="scroll-top-bean-eye
                       eye-left"
              ></span>

              <span
                class="scroll-top-bean-eye
                       eye-right"
              ></span>

              <span
                class="scroll-top-bean-smile"
              ></span>

            </span>

          </div>

          <div
            class="scroll-top-arrow"
            aria-hidden="true"
          >
            <span class="arrow primera"></span>
          </div>

        </div>

      </div>
    `.trim();

    document.body.appendChild(button);

    return button;
  }


  /* =======================================================
     VISIBILITY
     ======================================================= */

  function isNearBottom(px = NEAR_BOTTOM_PX) {

    const y =
      window.scrollY ||
      window.pageYOffset ||
      0;

    const vh =
      window.innerHeight ||
      0;

    const h =
      document.documentElement.scrollHeight ||
      0;

    return y + vh >= h - px;
  }


  function update() {

    ticking = false;

    if (!btn || !btn.isConnected) {
      return;
    }

    const y =
      window.scrollY ||
      window.pageYOffset ||
      0;

    const atTop = y <= 2;

    const nearBottom =
      isNearBottom(NEAR_BOTTOM_PX);

    btn.classList.toggle(
      "is-visible",
      nearBottom && !atTop
    );

    btn.classList.toggle(
      "is-full",
      atTop
    );

    btn.classList.toggle(
      "is-half",
      nearBottom
    );
  }


  function requestUpdate() {

    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(update);
  }


  /* =======================================================
     BUTTON EVENTS
     ======================================================= */

  function bindButton() {

    if (!btn) {
      return;
    }

    /*
     * Remove previous button lifecycle first.
     */
    if (cleanupButton) {
      cleanupButton();
      cleanupButton = null;
    }

    const handleClick = (event) => {

      event.preventDefault();

      /*
       * Don't allow repeated clicks while
       * the bean is flying.
       */
      if (
        btn.classList.contains("is-flying")
      ) {
        return;
      }

      btn.classList.add("is-flying");

      /*
       * Smooth scroll to top, respecting system 
       * reduced-motion preferences.
       */
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: 0,
        behavior: reduce ? "auto" : "smooth"
      });

      /*
       * Reset the bean after its flight.
       */
      if (flightTimer !== null) {
        window.clearTimeout(flightTimer);
      }

      flightTimer =
        window.setTimeout(() => {

          if (btn) {
            btn.classList.remove(
              "is-flying"
            );
          }

          flightTimer = null;

        }, 750);
    };


    btn.addEventListener(
      "click",
      handleClick
    );


    cleanupButton = () => {

      btn.removeEventListener(
        "click",
        handleClick
      );

      if (flightTimer !== null) {

        window.clearTimeout(
          flightTimer
        );

        flightTimer = null;
      }

      btn.classList.remove(
        "is-flying"
      );
    };
  }


  /* =======================================================
     INIT
     ======================================================= */

  function init() {

    /*
     * If the existing button is still in the DOM,
     * reuse it rather than creating another one.
     */
    btn = document.querySelector(
      SELECTOR
    );

    if (!btn) {
      btn = buildButton();
    }

    bindButton();

    requestUpdate();
  }


  /* =======================================================
     GLOBAL CLEANUP
     ======================================================= */

  function cleanup() {

    if (cleanupButton) {
      cleanupButton();
      cleanupButton = null;
    }

    btn = null;

    ticking = false;
  }


  /*
   * Expose cleanup for other SPA controllers if
   * needed later.
   */
  window.ScrollTopBean = {
    init,
    cleanup
  };


  /* =======================================================
     GLOBAL SCROLL / RESIZE
     ======================================================= */

  window.addEventListener(
    "scroll",
    requestUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    requestUpdate,
    { passive: true }
  );


  /* =======================================================
     SPA LOAD HOOKS
     ======================================================= */

  function hookAllLoads() {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      { passive: true }
    );

    window.addEventListener(
      "load",
      init,
      { passive: true }
    );

    window.addEventListener(
      "pageshow",
      init,
      { passive: true }
    );

    document.addEventListener(
      "hy-push-state-load",
      init,
      { passive: true }
    );

    document.addEventListener(
      "turbo:load",
      init,
      { passive: true }
    );

    window.addEventListener(
      "pjax:end",
      init,
      { passive: true }
    );

    window.addEventListener(
      "turbolinks:load",
      init,
      { passive: true }
    );
  }


  hookAllLoads();

})();
