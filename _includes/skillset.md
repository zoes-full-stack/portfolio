<!-- ===== Skills as Ocean Cards (FULL HTML) ===== -->
<div class="skills-ocean" id="skillsOcean" markdown="0">

  <div class="skills-grid">
    <!-- 1 -->
    <section class="ocean-tilt">
      <div class="ocean-card ocean-skill-card">
        <h4 class="skill-title">Product Design &amp; UX</h4>
        <p class="skill-chips">
          <span class="skill-chip">User Flows</span>
          <span class="skill-chip">Wireframing</span>
          <span class="skill-chip">Information Architecture</span>
          <span class="skill-chip">Interaction Design</span>
          <span class="skill-chip">Design Systems</span>
          <span class="skill-chip">Accessibility (a11y)</span>
          <span class="skill-chip">UX Writing &amp; Microcopy</span>
        </p>
      </div>
    </section>

    <!-- 2 -->
    <section class="ocean-tilt">
      <div class="ocean-card ocean-skill-card">
        <h4 class="skill-title">UI, Visual &amp; Graphic Design</h4>
        <p class="skill-chips">
          <span class="skill-chip">Layout &amp; Composition</span>
          <span class="skill-chip">Typography</span>
          <span class="skill-chip">Color &amp; Contrast</span>
          <span class="skill-chip">Visual Hierarchy</span>
          <span class="skill-chip">Brand-friendly UI</span>
          <span class="skill-chip">Illustration &amp; Visual Storytelling</span>
          <span class="skill-chip">Canva</span>
          <span class="skill-chip">Figma</span>
          <span class="skill-chip">Adobe Photoshop</span>
        </p>
      </div>
    </section>

    <!-- 3 -->
    <section class="ocean-tilt">
      <div class="ocean-card ocean-skill-card">
        <h4 class="skill-title">Web Platforms &amp; CMS</h4>
        <p class="skill-chips">
          <span class="skill-chip">Webflow</span>
          <span class="skill-chip">WordPress</span>
          <span class="skill-chip">Wix</span>
          <span class="skill-chip">Squarespace</span>
          <span class="skill-chip">SEO &amp; Analytics</span>
        </p>
      </div>
    </section>

    <!-- 4 -->
    <section class="ocean-tilt">
      <div class="ocean-card ocean-skill-card">
        <h4 class="skill-title">Frontend (Design → Build)</h4>
        <p class="skill-chips">
          <span class="skill-chip">HTML &amp; CSS</span>
          <span class="skill-chip">JavaScript</span>
          <span class="skill-chip">ReactJS</span>
          <span class="skill-chip">Responsive Design</span>
          <span class="skill-chip">Accessibility (a11y)</span>
          <span class="skill-chip">Design QA</span>
        </p>
      </div>
    </section>

    <!-- 5 -->
    <section class="ocean-tilt">
      <div class="ocean-card ocean-skill-card">
        <h4 class="skill-title">Motion &amp; Micro-interactions</h4>
        <p class="skill-chips">
          <span class="skill-chip">Rive</span>
          <span class="skill-chip">After Effects</span>
          <span class="skill-chip">Motion Principles</span>
          <span class="skill-chip">Micro-interactions</span>
          <span class="skill-chip">UI Animation</span>
          <span class="skill-chip">Delight with restraint</span>
        </p>
      </div>
    </section>

    <!-- 6 -->
    <section class="ocean-tilt">
      <div class="ocean-card ocean-skill-card">
        <h4 class="skill-title">Systems, Robotics &amp; Backend</h4>
        <p class="skill-chips">
          <span class="skill-chip">Unity</span>
          <span class="skill-chip">C#</span>
          <span class="skill-chip">Python</span>
          <span class="skill-chip">Golang</span>
          <span class="skill-chip">REST APIs</span>
          <span class="skill-chip">SQL (PostgreSQL / MySQL)</span>
          <span class="skill-chip">Firebase / Firestore</span>
          <span class="skill-chip">Google Cloud Functions</span>
          <span class="skill-chip">Serverless Architectures</span>
          <span class="skill-chip">Webhooks</span>
        </p>
      </div>
    </section>

    <!-- 7 -->
    <section class="ocean-tilt">
      <div class="ocean-card ocean-skill-card">
        <h4 class="skill-title">Automation &amp; DevOps</h4>
        <p class="skill-chips">
          <span class="skill-chip">Zapier</span>
          <span class="skill-chip">n8n</span>
          <span class="skill-chip">GoHighLevel</span>
          <span class="skill-chip">Git &amp; GitHub</span>
          <span class="skill-chip">Google Cloud</span>
        </p>
      </div>
    </section>

    <!-- 8 -->
    <section class="ocean-tilt">
      <div class="ocean-card ocean-skill-card">
        <h4 class="skill-title">Data, AI &amp; Analytics</h4>
        <p class="skill-chips">
          <span class="skill-chip">Pandas</span>
          <span class="skill-chip">NumPy</span>
          <span class="skill-chip">Plotly</span>
        </p>
      </div>
    </section>
  </div>

</div>

<style>
  /* ===== Fonts (optional) ===== */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;600;700&display=swap");

/* ===== Skills as Ocean Cards (FULL CSS) ===== */
:root{
  --ocean-tint: rgba(38, 167, 186, 0.18);
  --ocean-border: rgba(255, 255, 255, 0.95);
  --ocean-ink: rgba(10, 40, 55, 0.92);
  --shadow-card: 0 0 20px rgba(0, 0, 0, 0.12);
}

.skills-ocean{
  padding: 0.6rem 0 1.2rem;
}

/* grid that feels like your masonry “rows of cards” */
.skills-ocean .skills-grid{
  width: min(1200px, 100%);
  max-width: 100%;
  margin: 0.8rem auto;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem;
}

@media (max-width: 900px){
  .skills-ocean .skills-grid{ grid-template-columns: 1fr; }
}

/* same wrapper concept as the gallery */
.skills-ocean .ocean-tilt{
  display: flex;
  perspective: 600px;
}

/* Base “ocean-card” (matches your gallery card vibe) */
.skills-ocean .ocean-card{
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--ocean-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;

  position: relative;
  transform-style: preserve-3d;
  transform-origin: 50% 50% -50px;

  will-change: transform;
  backface-visibility: hidden;

  transition: box-shadow 0.8s ease;
  background-color: rgba(255, 255, 255, 0.02);

  /* subtle ocean glass */
  background-image:
    radial-gradient(1200px 420px at 10% 0%, rgba(38,167,186,0.14), transparent 55%),
    linear-gradient(to bottom, transparent, rgba(38, 167, 186, 0.12));
}

/* inner “shrink border” like your gallery */
.skills-ocean .ocean-card::before{
  content: "";
  position: absolute;
  top: -1px;
  left: -1px;
  width: 100%;
  height: 100%;
  border: 1px solid var(--ocean-border);
  border-radius: 8px;
  transform-origin: center;
  transition: 0.2s ease;
  pointer-events: none;
  z-index: 2;
}

/* hover effects like the gallery */
@media (hover:hover) and (pointer:fine){
  .skills-ocean .ocean-card:hover{
    cursor: pointer;
  }
  .skills-ocean .ocean-card:hover::before{
    transform: scale(0.94, 0.96);
    border-radius: 2px;
  }
  .skills-ocean .ocean-tilt:hover .ocean-card{
    box-shadow: 0 0 28px rgba(0,0,0,0.16);
  }
}

/* Skill-card-specific sizing and padding (NO forced poster aspect ratio) */
.skills-ocean .ocean-skill-card{
  aspect-ratio: auto;
  min-height: 210px;
  padding: 18px 18px 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
}

/* Title */
.skills-ocean .skill-title{
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  letter-spacing: 0.25px;
  color: var(--ocean-ink);
  font-size: 1.05rem;
}

/* Chips layout */
.skills-ocean .skill-chips{
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
}

/* Chips style (very close to your existing chips) */
.skills-ocean .skill-chip{
  display: inline-flex;
  align-items: center;
  padding: 0.38rem 0.62rem;
  border-radius: 999px;

  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;

  color: rgba(22,52,66,0.88);
  background: rgba(235,250,252,0.92);
  border: 1px solid rgba(79,177,186,0.35);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.75);

  white-space: nowrap;
}

@media (hover:hover) and (pointer:fine){
  .skills-ocean .skill-chip{
    transition: transform 0.12s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .skills-ocean .skill-chip:hover{
    border-color: rgba(79,177,186,0.55);
    box-shadow: 0 10px 22px rgba(22,52,66,0.10), inset 0 1px 0 rgba(255,255,255,0.8);
    transform: translateY(-1px);
  }
}

@media (prefers-reduced-motion: reduce){
  .skills-ocean .skill-chip{ transition: none; transform: none; }
  .skills-ocean .ocean-card{ transition: none; }
}

</style>