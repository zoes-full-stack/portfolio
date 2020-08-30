---
layout: page
title: Skills
description: >
  There are two ways of adding third party scripts.
  Embedding is ideal for one-off scripts, while global scripts are loaded on every page.
hide_description: true
sitemap: false
---

## SkillSet

```html
<!-- file: `_includes/my-scripts.html` -->
<script>
  document.getElementById('_pushState').addEventListener('hy-push-state-load', function() {
    // <your init code>
  });
</script>
```

{% include skills.md %}

Continue with [Experience](experience.md){:.heading.flip-title}
{:.read-more}
