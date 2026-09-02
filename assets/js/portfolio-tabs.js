

function switchArtTab(section) {
    const btnProjects = document.getElementById('btn-projects');
    const btnDesigns = document.getElementById('btn-designs');

    const projectsContent = document.getElementById('content-projects');
    const designsContent = document.getElementById('content-designs');

    if (section === 'projects') {
        btnProjects.classList.add('active');
        btnDesigns.classList.remove('active');

        projectsContent.style.display = 'block';
        designsContent.style.display = 'none';

        // CLEANS THE URL: Removes the #hash without reloading the page
        history.replaceState(null, null, window.location.pathname + window.location.search);

    } else if (section === 'designs') {
        btnDesigns.classList.add('active');
        btnProjects.classList.remove('active');

        designsContent.style.display = 'block';
        projectsContent.style.display = 'none';

        // RESTORES THE URL: Looks at the user's saved tab, or defaults to illustrations
        const savedTab = localStorage.getItem('lastDesignTab') || 'illustrations';
        history.replaceState(null, null, '#' + savedTab);
    }
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Check if there is a hash in the URL (e.g., "#baking")
  const currentHash = window.location.hash;

  // 2. Make a list of the IDs that belong to your Designs tab
  // (Make sure these match the actual IDs on your HTML containers!)
  const designCategories = ['#baking', '#editorial', '#print', '#illustrations'];

  if (currentHash) {
    // 3. If the URL hash matches one of our Design categories...
    if (designCategories.includes(currentHash)) {
      
      // Step A: Switch to the Designs tab!
      switchArtTab('designs');
      
      // Step B: Wait a tiny millisecond for the tab to become visible, 
      // then smoothly scroll the user right to their chosen section.
      setTimeout(() => {
        const targetElement = document.querySelector(currentHash);
        if (targetElement) {
          // Adjust 'start' to 'center' if you want it to scroll to the middle of the screen
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        }
      }, 50);
      
    } else {
      // (Optional) If it's a Project hash, ensure Projects is open and scroll to it
      switchArtTab('projects');
      
      setTimeout(() => {
        const targetElement = document.querySelector(currentHash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        }
      }, 50);
    }
  }
});
