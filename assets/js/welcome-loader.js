/* =========================================================
   Welcome / Ocean Preloader
   Hydejack-safe

   - First full page load only
   - Preloads critical images
   - Shows simple progress
   - Has a hard timeout
   - Does NOT run on PJAX navigation
   ========================================================= */

   (() => {
    "use strict";
  
    const loader = document.getElementById("welcome-loader");
  
    if (!loader) return;

    // // 🛑 DEBUG MODE
    // if (window.location.search.includes("debug")) {
    //     console.log("Preloader frozen for debugging");
    //     return; 
    // }
  
    const progressBar =
      document.getElementById("welcome-progress-bar");
  
    const progressNumber =
      document.getElementById("welcome-progress-number");
  
    const message =
      document.getElementById("welcome-loader-message");
  
    const progressContainer =
      loader.querySelector(".welcome-progress");
  
    const criticalImages = [
      "/images/ZFS_logo.png",
      "/images/ZFS_logo.webp",
      "/images/AboutMe.png",
      "/images/AboutMe.webp",
      "/images/AboutMe_Hover.png",
      "/images/AboutMe_Hover.webp",
      "/images/Projects_Designs/Projects_Neutral.png",
      "/images/Projects_Designs/Projects_Neutral.webp",
      "/images/Projects_Designs/Projects_Hover.png",
      "/images/Projects_Designs/Projects_Hover.webp",
      "/images/Projects_Designs/Projects_Active.png",
      "/images/Projects_Designs/Projects_Active.webp",
      "/images/Projects_Designs/Designs_Neutral.png",
      "/images/Projects_Designs/Designs_Neutral.webp",
      "/images/Projects_Designs/Designs_Hover.png",
      "/images/Projects_Designs/Designs_Hover.webp",
      "/images/Projects_Designs/Designs_Active.png",
      "/images/Projects_Designs/Designs_Active.webp"
    ];
  
    const MAX_WAIT = 4000;
    const MIN_DISPLAY = 650;
  
    const messages = [
      "Preparing the ocean...",
      "Finding my little beans...",
      "Gathering the good stuff...",
      "Almost ready..."
    ];
  
    let completed = 0;
    let finished = false;
  
    const startTime = performance.now();
  
    document.body.classList.add("welcome-loading");
  
  
    /* -------------------------------------------------------
       Progress
       ------------------------------------------------------- */
  
    function updateProgress() {
      const total = criticalImages.length;
  
      const percent = Math.round(
        (completed / total) * 100
      );
  
      if (progressBar) {
        progressBar.style.width = `${percent}%`;
      }
  
      if (progressNumber) {
        progressNumber.textContent = `${percent}%`;
      }
  
      if (progressContainer) {
        progressContainer.setAttribute(
          "aria-valuenow",
          String(percent)
        );
      }
  
      if (message && percent < 100) {
        const index = Math.min(
          Math.floor((percent / 100) * messages.length),
          messages.length - 1
        );
  
        message.textContent = messages[index];
      }
    }
  
  
    /* -------------------------------------------------------
       Preload one image
       ------------------------------------------------------- */
  
    function preloadImage(src) {
      return new Promise((resolve) => {
        const img = new Image();
  
        let done = false;
  
        const finish = () => {
          if (done) return;
  
          done = true;
          completed++;
  
          updateProgress();
  
          resolve();
        };
  
        img.onload = async () => {
          /*
           * decode() lets the browser finish decoding the image
           * before we declare it ready, when supported.
           */
          if (typeof img.decode === "function") {
            try {
              await img.decode();
            } catch {
              // Some image types/browsers may reject decode().
              // The image has still successfully loaded.
            }
          }
  
          finish();
        };
  
        img.onerror = () => {
          /*
           * Don't let one broken image keep the website stuck
           * behind the preloader.
           */
          finish();
        };
  
        img.src = src;
  
        /*
         * Cached images can already be complete before onload
         * fires in some situations.
         */
        if (img.complete) {
          Promise.resolve()
            .then(async () => {
              if (typeof img.decode === "function") {
                try {
                  await img.decode();
                } catch {}
              }
  
              finish();
            });
        }
      });
    }
  
  
    /* -------------------------------------------------------
       Finish loader
       ------------------------------------------------------- */
  
    function finishLoader() {
      if (finished) return;
  
      finished = true;
  
      completed = criticalImages.length;
  
      updateProgress();
  
      if (message) {
        message.textContent = "Welcome 🌊";
      }
  
      const elapsed =
        performance.now() - startTime;
  
      const remaining =
        Math.max(0, MIN_DISPLAY - elapsed);
  
      setTimeout(() => {
        loader.classList.add("fade-out");
  
        document.body.classList.remove(
          "welcome-loading"
        );
  
        setTimeout(() => {
          if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 550);
  
      }, remaining);
    }
  
  
    /* -------------------------------------------------------
       Start
       ------------------------------------------------------- */
  
    updateProgress();
  
    const preloadPromise =
      Promise.all(
        criticalImages.map(preloadImage)
      );
  
    const timeoutPromise =
      new Promise((resolve) => {
        setTimeout(resolve, MAX_WAIT);
      });
  
  
    Promise.race([
      preloadPromise,
      timeoutPromise
    ]).then(() => {
      finishLoader();
    });
  
  })();
