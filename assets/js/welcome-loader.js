/* =========================================================
   Welcome / Ocean Preloader
   Hydejack-safe
   ---------------------------------------------------------
   - First full page load only
   - Preloads critical images
   - Shows progress
   - Uses image decoding when available
   - Has a hard timeout
   - Smooth underwater exit
   - Does NOT run on PJAX navigation
   ========================================================= */

   (() => {
    "use strict";
  
    const loader =
      document.getElementById("welcome-loader");
  
    if (!loader) return;

    // // 🛑 DEBUG MODE
    // if (window.location.search.includes("debug")) {
    //     console.log("Preloader frozen for debugging");
    //     return; 
    // }
  
  
    /* =======================================================
       Elements
       ======================================================= */
  
    const progressBar =
      document.getElementById(
        "welcome-progress-bar"
      );
  
    const progressNumber =
      document.getElementById(
        "welcome-progress-number"
      );
  
    const message =
      document.getElementById(
        "welcome-loader-message"
      );
  
    const progressContainer =
      loader.querySelector(
        ".welcome-progress"
      );
  
  
    /* =======================================================
       Critical images
       ======================================================= */
  
    /*
     * IMPORTANT:
     *
     * Only include images that are genuinely important
     * for the first screen of the site.
     *
     * If PNG and WebP are alternative versions of the
     * same image, preload ONLY the format your site actually
     * uses.
     */
  
    const criticalImages = [
  
      "/images/ZFS_logo.webp",
  
      "/images/AboutMe.webp",
      "/images/AboutMe_Hover.webp",
  
      "/images/Projects_Designs/Projects_Neutral.webp",
      "/images/Projects_Designs/Projects_Hover.webp",
      "/images/Projects_Designs/Projects_Active.webp",
  
      "/images/Projects_Designs/Designs_Neutral.webp",
      "/images/Projects_Designs/Designs_Hover.webp",
      "/images/Projects_Designs/Designs_Active.webp"
  
    ];
  
  
    /* =======================================================
       Timing
       ======================================================= */
  
    const MAX_WAIT = 4000;
  
    /*
     * Prevents the loader from flashing away instantly
     * when everything is already cached.
     */
    const MIN_DISPLAY = 650;
  
  
    /* =======================================================
       Messages
       ======================================================= */
  
    const messages = [
      "Please hold my bubble...",
      "Oops, there goes another one.",
      "Bean is working very hard.",
      "Okay okay, almost there..."
    ];
  
  
    /* =======================================================
       State
       ======================================================= */
  
    let completed = 0;
    let finished = false;
  
    const startTime =
      performance.now();
  
  
    /*
     * Lets the rest of the site know that the welcome
     * screen is currently covering the page.
     */
    document.body.classList.add(
      "welcome-loading"
    );
  
  
    /* =======================================================
       Progress
       ======================================================= */
  
    function updateProgress() {
  
      const total =
        criticalImages.length;
  
      const percent =
        total === 0
          ? 100
          : Math.round(
              (completed / total) * 100
            );
  
  
      /* -----------------------------------------------
         Progress bar
         ----------------------------------------------- */
  
      if (progressBar) {
        progressBar.style.width =
          `${percent}%`;
      }
  
  
      /* -----------------------------------------------
         Percentage text
         ----------------------------------------------- */
  
      if (progressNumber) {
        progressNumber.textContent =
          `${percent}%`;
      }
  
  
      /* -----------------------------------------------
         Accessibility
         ----------------------------------------------- */
  
      if (progressContainer) {
        progressContainer.setAttribute(
          "aria-valuenow",
          String(percent)
        );
      }
  
  
      /* -----------------------------------------------
         Loading message
         ----------------------------------------------- */
  
      if (
        message &&
        percent < 100 &&
        messages.length
      ) {
  
        const index =
          Math.min(
            Math.floor(
              (percent / 100) *
              messages.length
            ),
            messages.length - 1
          );
  
        message.textContent =
          messages[index];
      }
    }
  
  
    /* =======================================================
       Preload one image
       ======================================================= */
  
    function preloadImage(src) {
  
      return new Promise((resolve) => {
  
        const img =
          new Image();
  
        let done = false;
  
  
        function finish() {
  
          if (done) return;
  
          done = true;
  
          completed++;
  
          updateProgress();
  
          resolve();
        }
  
  
        /* -----------------------------------------------
           Image successfully loaded
           ----------------------------------------------- */
  
        img.onload = async () => {
  
          /*
           * decode() waits for the browser to finish
           * decoding the image where supported.
           */
          if (
            typeof img.decode ===
            "function"
          ) {
  
            try {
              await img.decode();
            } catch {
              /*
               * Decode can fail even though the image
               * loaded successfully. That's okay.
               */
            }
          }
  
          finish();
        };
  
  
        /* -----------------------------------------------
           Image failed
           ----------------------------------------------- */
  
        img.onerror = () => {
  
          /*
           * Don't let one missing image trap
           * the entire website behind the loader.
           */
          finish();
        };
  
  
        /* -----------------------------------------------
           Start loading
           ----------------------------------------------- */
  
        img.src = src;
  
  
        /* -----------------------------------------------
           Cached image
           ----------------------------------------------- */
  
        if (img.complete) {
  
          Promise.resolve().then(
            async () => {
  
              if (
                typeof img.decode ===
                "function"
              ) {
  
                try {
                  await img.decode();
                } catch {
                  // Already handled by finish().
                }
              }
  
              finish();
            }
          );
        }
      });
    }
  
  
    /* =======================================================
       Finish loader
       ======================================================= */
  
    function finishLoader({
      timedOut = false
    } = {}) {
  
      if (finished) return;
  
      finished = true;
  
  
      /* -----------------------------------------------
         Complete progress visually
         ----------------------------------------------- */
  
      completed =
        criticalImages.length;
  
      updateProgress();
  
  
      /* -----------------------------------------------
         Final message
         ----------------------------------------------- */
  
      if (message) {
  
        message.textContent =
          timedOut
            ? "Found everything I could — dive in! 🫧"
            : "All clear — dive in! 🫧";
      }
  
  
      /* -----------------------------------------------
         Keep loader on screen for minimum duration
         ----------------------------------------------- */
  
      const elapsed =
        performance.now() -
        startTime;
  
      const remaining =
        Math.max(
          0,
          MIN_DISPLAY - elapsed
        );
  
  
      setTimeout(() => {
  
        /*
         * Add the exit animation.
         */
        loader.classList.add(
          "slide-up"
        );
  
  
        /*
         * Stop blocking the page.
         *
         * The loader is still visually present
         * during its 850ms exit animation.
         */
        document.body.classList.remove(
          "welcome-loading"
        );
  
  
        /*
         * Remove the loader after the animation.
         */
        setTimeout(() => {
  
          if (
            loader &&
            loader.parentNode
          ) {
  
            loader.parentNode.removeChild(
              loader
            );
          }
  
        }, 1450);
  
      }, remaining);
    }
  
  
    /* =======================================================
       Start
       ======================================================= */
  
    updateProgress();
  
  
    /*
     * Start all image requests simultaneously.
     */
    const preloadPromise =
      Promise.all(
        criticalImages.map(
          preloadImage
        )
      );
  
  
    /*
     * Absolute safety timeout.
     *
     * The user will never be trapped on the
     * preloader indefinitely.
     */
    const timeoutPromise =
      new Promise((resolve) => {
  
        setTimeout(() => {
  
          resolve({
            timedOut: true
          });
  
        }, MAX_WAIT);
      });
  
  
    /*
     * Whichever happens first wins:
     *
     *   all images loaded
     *          OR
     *   4 second timeout
     */
    Promise.race([
      preloadPromise.then(() => ({
        timedOut: false
      })),
  
      timeoutPromise
  
    ]).then((result) => {
  
      finishLoader(result);
  
    });
  
  })();
