const oceanBtn = document.querySelector('.welcome-ocean-button');

window.addEventListener('load', () => {
    const isSmall = window.matchMedia('(max-width: 767px)').matches;
    if (isSmall) return; // skip auto animation on mobile
    oceanBtn.classList.add('is-loaded');
    setTimeout(() => oceanBtn.classList.remove('is-loaded'), 2700);
});
