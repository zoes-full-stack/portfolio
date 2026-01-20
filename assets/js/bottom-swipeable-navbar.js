// const navbar = document.querySelector('.bottom-navbar');
// const navbarItems = document.querySelector('.bottom-navbar .bottom-navbar-items');

// // ===== Swipe/drag support for desktop + mobile =====
// let isDown = false;
// let startX;
// let scrollLeft;

// navbarItems.addEventListener('mousedown', (e) => {
//   isDown = true;
//   startX = e.pageX - navbarItems.offsetLeft;
//   scrollLeft = navbarItems.scrollLeft;
// });
// navbarItems.addEventListener('mouseleave', () => isDown = false);
// navbarItems.addEventListener('mouseup', () => isDown = false);
// navbarItems.addEventListener('mousemove', (e) => {
//   if(!isDown) return;
//   e.preventDefault();
//   const x = e.pageX - navbarItems.offsetLeft;
//   const walk = (x - startX) * 2; // scroll speed
//   navbarItems.scrollLeft = scrollLeft - walk;
// });

// // Mobile touch drag support
// navbarItems.addEventListener('touchstart', (e) => {
//   startX = e.touches[0].pageX - navbarItems.offsetLeft;
//   scrollLeft = navbarItems.scrollLeft;
// });
// navbarItems.addEventListener('touchmove', (e) => {
//   const x = e.touches[0].pageX - navbarItems.offsetLeft;
//   const walk = (x - startX) * 2;
//   navbarItems.scrollLeft = scrollLeft - walk;
// });

// // ===== Hide on scroll down / show on scroll up =====
// let lastScrollY = window.scrollY;
// window.addEventListener('scroll', () => {
//   if (window.scrollY > lastScrollY && window.scrollY > 50) {
//     // scrolling down
//     navbar.classList.add('hidden');
//   } else {
//     // scrolling up
//     navbar.classList.remove('hidden');
//   }
//   lastScrollY = window.scrollY;
// });

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
