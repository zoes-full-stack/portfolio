function initBottomNavbar() {
  const navbar = document.querySelector('.bottom-navbar');
  const navItems = document.querySelector('.bottom-navbar-items');

  // Safety check: if there's no navbar on this page, stop right here
  if (!navbar || !navItems) return;

  // Safety check 2: Prevent attaching the events multiple times if the page re-renders
  if (navbar.dataset.navBound === "1") return;
  navbar.dataset.navBound = "1";

  let lastScrollY = window.scrollY;
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    // Shrink if scrolling down
    if (currentY > lastScrollY && currentY > 50) {
      navbar.classList.add('shrink');
    }

    // Expand if scrolling up
    if (currentY < lastScrollY) {
      navbar.classList.remove('shrink');
    }

    // Clear previous timeout
    clearTimeout(scrollTimeout);

    // Expand after user pauses for 1 second
    scrollTimeout = setTimeout(() => {
      navbar.classList.remove('shrink');
    }, 1000);

    lastScrollY = currentY;
  });

  // ------------------------------
  // Swipe hint behavior
  // ------------------------------
  function isHorizontallyScrollable(el) {
    return el.scrollWidth > el.clientWidth + 2;
  }

  function showHintIfNeeded() {
    const shouldShow = isHorizontallyScrollable(navItems);
    navbar.classList.toggle('hint-hidden', !shouldShow);
  }

  function hideHint() {
    navbar.classList.add('hint-hidden');
  }

  // show/hide on load + resize
  showHintIfNeeded();
  window.addEventListener('resize', showHintIfNeeded, { passive: true });

  // Hide only once they've actually scrolled the bar
  navItems.addEventListener('scroll', () => {
    if (navItems.scrollLeft > 8) hideHint();
  }, { passive: true });

  // Optional: hide if they click a link
  navItems.addEventListener('click', hideHint, { passive: true });
}

// ==========================================
// The Magic Hooks (Ensures it runs on SPA navigation)
// ==========================================
document.addEventListener("DOMContentLoaded", initBottomNavbar, { passive: true });
document.addEventListener("hy-push-state-load", initBottomNavbar, { passive: true });
document.addEventListener("turbo:load", initBottomNavbar, { passive: true });
