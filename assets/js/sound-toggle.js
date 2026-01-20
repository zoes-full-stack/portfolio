const soundToggle = document.querySelector('.sound-toggle');
let isMuted = false;

soundToggle.addEventListener('click', () => {
    isMuted = !isMuted;

    // Update text & icon
    soundToggle.querySelector('span').textContent = isMuted ? 'Sound Off' : 'Sound On';
    soundToggle.querySelector('i').className = isMuted ? 'icon-volume-off' : 'icon-volume';

    // Update aria-pressed for accessibility
    soundToggle.setAttribute('aria-pressed', isMuted);

    // Mute/unmute all audio in the page or specific lightbox
    document.querySelectorAll('audio, video').forEach(el => el.muted = isMuted);
});
