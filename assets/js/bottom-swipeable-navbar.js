const navbar = document.querySelector('.bottom-navbar');
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
