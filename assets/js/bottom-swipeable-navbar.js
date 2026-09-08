// ==========================================
// Bottom Navbar
// SPA-safe initialization + cleanup
// ==========================================

(function () {

  let cleanupBottomNavbar = null;

  function initBottomNavbar() {

    const navbar = document.querySelector('.bottom-navbar');
    const navItems = document.querySelector('.bottom-navbar-items');

    // No navbar on this page
    if (!navbar || !navItems) {
      return;
    }

    // ------------------------------------------
    // Clean up the previous navbar instance
    // ------------------------------------------

    if (typeof cleanupBottomNavbar === 'function') {
      cleanupBottomNavbar();
      cleanupBottomNavbar = null;
    }

    // ------------------------------------------
    // State
    // ------------------------------------------

    let lastScrollY = window.scrollY;
    let scrollTimeout = null;

    // ------------------------------------------
    // Window scroll
    // ------------------------------------------

    function handleWindowScroll() {

      const currentY = window.scrollY;

      // Scrolling down
      if (currentY > lastScrollY && currentY > 50) {
        navbar.classList.add('shrink');
      }

      // Scrolling up
      if (currentY < lastScrollY) {
        navbar.classList.remove('shrink');
      }

      // Reset previous timeout
      if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
      }

      // Expand navbar after scrolling stops
      scrollTimeout = setTimeout(function () {

        // Make sure this navbar still belongs to the current page
        if (document.body.contains(navbar)) {
          navbar.classList.remove('shrink');
        }

      }, 1000);

      lastScrollY = currentY;
    }

    // ------------------------------------------
    // Horizontal scrolling / swipe hint
    // ------------------------------------------

    function isHorizontallyScrollable(el) {

      return el.scrollWidth > el.clientWidth + 2;

    }

    function showHintIfNeeded() {

      // Make sure the elements still exist
      if (!document.body.contains(navbar)) {
        return;
      }

      if (!document.body.contains(navItems)) {
        return;
      }

      const shouldShow = isHorizontallyScrollable(navItems);

      navbar.classList.toggle('hint-hidden', !shouldShow);
    }

    function hideHint() {

      if (!document.body.contains(navbar)) {
        return;
      }

      navbar.classList.add('hint-hidden');
    }

    // ------------------------------------------
    // Nav items horizontal scroll
    // ------------------------------------------

    function handleNavScroll() {

      if (navItems.scrollLeft > 8) {
        hideHint();
      }

    }

    // ------------------------------------------
    // Nav item click
    // ------------------------------------------

    function handleNavClick() {

      hideHint();

    }

    // ------------------------------------------
    // Initial state
    // ------------------------------------------

    showHintIfNeeded();

    // ------------------------------------------
    // Event listeners
    // ------------------------------------------

    window.addEventListener(
      'scroll',
      handleWindowScroll,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      showHintIfNeeded,
      { passive: true }
    );

    navItems.addEventListener(
      'scroll',
      handleNavScroll,
      { passive: true }
    );

    navItems.addEventListener(
      'click',
      handleNavClick
    );

    // ------------------------------------------
    // Cleanup function
    // ------------------------------------------

    cleanupBottomNavbar = function () {

      // Stop pending timeout
      if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }

      // Remove window listeners
      window.removeEventListener(
        'scroll',
        handleWindowScroll
      );

      window.removeEventListener(
        'resize',
        showHintIfNeeded
      );

      // Remove navbar listeners
      navItems.removeEventListener(
        'scroll',
        handleNavScroll
      );

      navItems.removeEventListener(
        'click',
        handleNavClick
      );

    };

  }


  // ==========================================
  // SPA / Page-load hooks
  // ==========================================

  document.addEventListener(
    'DOMContentLoaded',
    initBottomNavbar
  );

  document.addEventListener(
    'hy-push-state-load',
    initBottomNavbar
  );

  document.addEventListener(
    'turbo:load',
    initBottomNavbar
  );


})();
