const oceanBtn = document.querySelector('.welcome-ocean-button');

// If the button exists on the current page, add the event listener
if (oceanBtn) {
  window.addEventListener('load', () => {
    const isSmall = window.matchMedia('(max-width: 767px)').matches;
    if (isSmall) return; // skip auto animation on mobile
    
    oceanBtn.classList.add('is-loaded');
    setTimeout(() => oceanBtn.classList.remove('is-loaded'), 2700);
  });
}
