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

```python
skillset = ["Coding", "Baking", "Being Awesome"]
print(skillset)
```

```html
<!-- My Skillset -->
<script>
  document.getElementById('skillset').addEventListener('display-skills', function() {
    // <List of My Skills>
  });
</script>
```

{% include skills.md %}

&nbsp;
&nbsp;
&nbsp;

Continue with [Experience](experience.md){:.heading.flip-title}
{:.read-more}
