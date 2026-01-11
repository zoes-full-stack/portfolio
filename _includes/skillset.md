<div class="skills-wrap" markdown="0">

  <h4>Product Design &amp; UX
  </h4>
  <p class="skill-chips">
    <span class="skill-chip">User Flows</span>
    <span class="skill-chip">Wireframing</span>
    <!-- <span class="skill-chip">Prototyping</span> -->
    <span class="skill-chip">Information Architecture</span>
    <span class="skill-chip">Interaction Design</span>
    <span class="skill-chip">Design Systems</span>
    <span class="skill-chip">Accessibility (a11y)</span>
    <span class="skill-chip">UX Writing &amp; Microcopy</span>
  </p>

  <h4>UI, Visual &amp; Graphic Design
  </h4>
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

  <h4>Web Platforms &amp; CMS
  </h4>
  <p class="skill-chips">
    <span class="skill-chip">Webflow</span>
    <span class="skill-chip">WordPress</span>
    <span class="skill-chip">Wix</span>
    <span class="skill-chip">Squarespace</span>
    <span class="skill-chip">SEO &amp; Analytics</span>
  </p>

  <h4>Frontend (Design → Build)
  </h4>
  <p class="skill-chips">
    <span class="skill-chip">HTML &amp; CSS</span>
    <span class="skill-chip">JavaScript</span>
    <span class="skill-chip">ReactJS</span>
    <!-- <span class="skill-chip">Vue.js</span> -->
    <span class="skill-chip">Responsive Design</span>
    <span class="skill-chip">Accessibility (a11y)</span>
    <span class="skill-chip">Design QA</span>
  </p>

  <h4>Motion &amp; Micro-interactions
  </h4>
  <p class="skill-chips">
    <span class="skill-chip">Rive</span>
    <span class="skill-chip">After Effects</span>
    <span class="skill-chip">Motion Principles</span>
    <span class="skill-chip">Micro-interactions</span>
    <span class="skill-chip">UI Animation</span>
    <span class="skill-chip">Delight with restraint</span>
  </p>

  <h4>Systems, Robotics &amp; Backend
  </h4>
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

  <h4>Automation &amp; DevOps
  </h4>
  <p class="skill-chips">
    <span class="skill-chip">Zapier</span>
    <span class="skill-chip">n8n</span>
    <span class="skill-chip">GoHighLevel</span>
    <span class="skill-chip">Git &amp; GitHub</span>
    <span class="skill-chip">Google Cloud</span>
  </p>

  <h4>Data, AI &amp; Analytics
  </h4>
  <div>
    <p class="skill-chips">
      <span class="skill-chip">Pandas</span>
      <span class="skill-chip">NumPy</span>
      <span class="skill-chip">Plotly</span>
    </p>
  </div>

  <div class="row_project">
    <div class="column_code2">
      <h3>Creative Interests</h3>
      <ul>
        <li><strong>Audio &amp; Voice:</strong> Incorporating music and singing into web and game projects.</li>
        <li><strong>Game Design:</strong> Creating concepts, logic, and art for interactive experiences.</li>
        <li><strong>Logic Puzzles:</strong> A love for “connecting the dots” and solving complex system issues.</li>
      </ul>

      <h3>Management</h3>
      <ul>
        <li>Project &amp; Team Management (Agile)</li>
        <li>Mentoring &amp; Facilitation</li>
        <li>Clear Documentation &amp; Communication</li>
      </ul>
    </div>

    <div class="column_code">
      <h3>Languages</h3>
      <b>English:</b>
      <span class="icon-star-full"></span><span class="icon-star-full"></span><span class="icon-star-full"></span>
      <br>
      <b>Spanish:</b>
      <span class="icon-star-full"></span><span class="icon-star-empty"></span><span class="icon-star-empty"></span>
      <!-- <br>
      <b>German:</b>
      <span class="icon-star-full"></span><span class="icon-star-empty"></span><span class="icon-star-empty"></span> -->
    </div>
  </div>

</div>

<style>
/* ===== Skills chips (match Work page tag vibe) ===== */
.skills-wrap .skill-chips{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin:.35rem 0 1rem;
}

.skills-wrap .skill-chip{
  display:inline-flex;
  align-items:center;
  padding:.35rem .6rem;
  border-radius:999px;

  font-size:13px;
  font-weight:750;
  line-height:1;

  color: rgba(22,52,66,.88);
  background: rgba(235,250,252,.95);
  border: 1px solid rgba(79,177,186,.35);

  box-shadow: inset 0 1px 0 rgba(255,255,255,.75);
  white-space: nowrap;
}

@media (hover:hover) and (pointer:fine){
  .skills-wrap .skill-chip{
    transition: transform .12s ease, box-shadow .2s ease, border-color .2s ease;
  }
  .skills-wrap .skill-chip:hover{
    border-color: rgba(79,177,186,.55);
    box-shadow: 0 10px 22px rgba(22,52,66,.10), inset 0 1px 0 rgba(255,255,255,.8);
    transform: translateY(-1px);
  }
}

@media (prefers-reduced-motion: reduce){
  .skills-wrap .skill-chip{ transition:none; transform:none; }
}

/* Optional: tighten spacing under h4 in this block */
.skills-wrap h4{ margin-bottom: .35rem; }
</style>
