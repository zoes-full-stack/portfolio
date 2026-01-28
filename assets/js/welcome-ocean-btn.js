const oceanBtn = document.querySelector('.welcome-ocean-button');

window.addEventListener('load', () => {
    oceanBtn.classList.add('is-loaded');
    
    // Remove the class after 4s (the length of your fish animation)
    // This resets the button so the :hover trigger still works perfectly later!
    setTimeout(() => {
        oceanBtn.classList.remove('is-loaded');
    }, 2700); 
});
