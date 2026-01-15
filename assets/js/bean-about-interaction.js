(() => {
  const root = document.querySelector(".about-bean");
  if (!root) return;

  const contentEl = root.querySelector("#aboutBeanContent");
  const tabs = [...root.querySelectorAll(".ab-tab")];

  const CONTENT = {
    profile: `
      <p><strong>Hi! I’m Gabby</strong>, a creator + developer (and co-owner of Scarlet Creative) based in Trinidad &amp; Tobago.</p>
      <p>I’m deeply passionate about helping people feel <strong>less overwhelmed</strong>, more supported, and more able to do the work that matters to them.</p>
    `,
    mission: `
      <p><strong>North Star:</strong> make things gentler.</p>
      <p>A lot of my perspective comes from navigating my own hard seasons and wanting to design tools that feel kinder for others.</p>
      <p>I care about giving a voice to the voiceless, raising awareness, and bringing communities together to help revive the Earth and our shared humanity.</p>
    `,
    values: `
      <ul>
        <li><strong>Kindness:</strong> reduce friction and stress.</li>
        <li><strong>Clarity:</strong> calm, readable, intuitive flows.</li>
        <li><strong>Care:</strong> people, animals, and environment.</li>
        <li><strong>Community:</strong> build connection and collective action.</li>
      </ul>
    `,
    interests: `
      <p><strong>I love diving into:</strong> design (UI/UX, graphic, motion), human–computer interaction, art for storytelling, psychology, software engineering, neuroscience, mycology, and botany.</p>
      <p>I’m fascinated by how we process emotion + information, and how we can design systems that feel kinder and more intuitive.</p>
      <p><strong>Also:</strong> water-baby. I adore the ocean, its ecosystems, and the stories it holds. 🐚</p>
    `,
    work: `
      <p><strong>I help NGOs and growing businesses build:</strong></p>
      <ul>
        <li>Human-centred brands and interfaces</li>
        <li>Thoughtful automation and AI tools</li>
        <li>Systems that feel calm, clear, and kind to use</li>
      </ul>
      <p><em>Optional:</em> add a small CTA button linking to your contact page.</p>
    `
  };

  const MODES = ["mode-hello","mode-northstar","mode-values","mode-curiosities","mode-build"];

  function setActive(key, modeClass){
    contentEl.innerHTML = CONTENT[key] || "";

    tabs.forEach(t => {
      const on = t.dataset.key === key;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });

    root.classList.remove(...MODES);
    if (modeClass) root.classList.add(modeClass);

    // Focus content for keyboard users
    contentEl.focus({ preventScroll: true });
  }

  tabs.forEach(btn => {
    btn.addEventListener("click", () => setActive(btn.dataset.key, btn.dataset.mode));

    btn.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const i = tabs.indexOf(btn);
      const next = e.key === "ArrowRight"
        ? (tabs[i + 1] || tabs[0])
        : (tabs[i - 1] || tabs[tabs.length - 1]);
      next.focus();
      setActive(next.dataset.key, next.dataset.mode);
    });
  });

  // Init
  setActive("profile", "mode-hello");
})();
