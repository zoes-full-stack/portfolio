---
layout: post
title: QuickRental
image: /images/projects/quickrental/apartmentapp2.png
description: >
  Version 9 is the most complete version of Hydejack yet.
  Modernized design, big headlines, and big new features.
# hide_description: true
sitemap: false
---

<!-- <p class="note" title="Attention">A custom label.</p> -->
<div markdown="0">
  <header>
    <!-- <h1 class="post-title flip-project-title"> QuickRental</h1> -->
    <div class="post-date"> 
      <time datetime="2020-05-31T00:00:00+00:00">31 May 2020</time> in <a href="/portfolio/projects_test/" class="flip-title">Projects</a>
    </div>
    <div class="lead aspect-ratio sixteen-nine flip-project-img"> 
      <img src="/portfolio/images/projects/quickrental/apartmentapp2.png" alt="QuickRental" width="864" height="486" loading="lazy">
    </div>
    <p class="note-sm" title="QuickRental"> Version 9 is the most complete version of Hydejack yet. Modernized design, big headlines, and big new features.</p>
  </header>
</div>

<!-- <header><h1 class="post-title flip-project-title" style="opacity: 1;"> Introducing Hydejack 9</h1><div class="post-date"> <time datetime="2020-07-03T00:00:00+00:00">03 Jul 2020</time> in <a href="/portfolio/example/" class="flip-title">Projects</a></div><div class="lead aspect-ratio sixteen-nine flip-project-img"> <img src="/portfolio/assets/img/blog/hydejack-9.jpg" alt="Introducing Hydejack 9" width="864" height="486" loading="lazy" style="opacity: 0;"></div><p class="note-sm"> Version 9 is the most complete version of Hydejack yet. Modernized design, big headlines, and big new features.</p></header> -->

Version 9 is the most complete version of Hydejack yet.
{:.lead}

[Modernized](#linking-in-style) [design](#whats-in-the-cards), [big headlines](#ready-for-the-big-screen), big new features: [Built-In Search](#built-in-search), [Sticky Table of Contents](#sticky-table-of-contents), and [Auto-Hiding Navbar](#auto-hiding-navbar). That [and more](#and-much-more) is Hydejack 9.

- Table of Contents
{:toc .large-only}

## Linking in Style

Ever since the introduction of Dark Mode, link styles have been a bit of an issue. Specifically, finding an accent color that worked on both light and dark backgrounds was the problem. With Hydejack 9, the [link style](#linking-in-style) has been revamped so that legibility is no longer tied to the choice of accent_color, giving you much more freedom in creating a unique design flavor for your site.
 
## Ready for the Big Screen

The theme on which Hydejack is based was designed for a different era of the web. Hydejack has inherited many of its limitations, but over time I've made adjustments, such as centering the content column for better reading ergonomics. 

With version 9, Hydejack takes full advantage of large displays. Whether it's design indulgences such as oversized headlines, or quality of life improvements such as a floating table of contents, Hydejack now finds use for all that extra screen real estate[^1]. 
 
## What's in the Cards?

Hydejack 9 now lets you use content cards for both projects and posts. 
The cards have been redesigned with a new hover style and drop shadows and they retain their unique transition-to-next-page animations, which now also work on the `blog` layout. The new `grid` layout lets you do that.

Good images are key to making the most out of content cards. For that reason, a [chapter on images](../../docs/basics.md#adding-images) has been added to the documentation.
 
## Built-In Search

Hydejack now has Built-In Search. It even works offline. I've been prototyping many approaches and eventually settled on a fully client-side, off-the-main thread solution that perfectly fits the use case of personal sites and shows surprisingly good results[^2]. 

The new search UI is custom made for Hydejack and shows beautiful previews of your posts and pages, right on top of your regular content.

Together with the Auto-Hiding Navbar, your entire content library is now only a couple of keystrokes away.
 
## Auto-Hiding Navbar

A navbar that's there when you need it, and disappears when you don't. Simple as that.
 
## Sticky Table of Contents

Already a staple on so many sites on the web, this pattern is now also available in Hydejack. 
What's unique about it is that it simply picks up the table of contents already created by kramdown's `{:toc}` tag and transparently upgrades it to a fully dynamic version.
 
## …and much more

Other noteworthy changes include:
- Support for Jekyll 4
- Choice between MathJax and KaTeX for math rendering
- Use of `jekyll-include-cache` for drastically improved page building speeds
- New variables configuration file — adjust content width, sidebar width, font size, etc...
- ...and the option to disable grouping projects by year.

Read the the [CHANGELOG](../../CHANGELOG.md){:.heading.flip-title} for the full scope of features and improvements made in Hydejack 9.
Maybe just glance at it to confirm that it is indeed a pretty long list.
 
## Even More to Come

New features for 9.1 are already lined up. Code block headers and code line highlights for even better technical blogging, as well as download buttons on the resume page for PDF, vCard, and Resume JSON are just around the corner.
 
## Get It Now
The Free Version of Hydejack is now availabe on [RubyGems](https://rubygems.org/gems/jekyll-theme-hydejack)
and for the first time also on [GitHub Packages](https://github.com/hydecorp/hydejack/packages). 
The source code is available on [GitHub](https://github.com/hydecorp/hydejack) as always.


<!-- 

[^1]: If you are a fan of the old two-column layout, or don't like modern design tropes such as mega headlines, Hydejack lets you revert these changes on a case-by-case basis via configuration options.

[^2]:
      Search was mainly tested for English and German. Please let me know about issues in other languages. 
      While I've tried to find a multi-language solution, most showed drastically worse  results for the English base case.
      If you're technically inclined, you can adopt the code located in `_includes/js/search-worker.js` to your needs. -->

<div markdown="0">
  <hr class="dingbat related">
  <aside class="about related mt4 mb4" role="complementary">
    <div class="author mt4"> 
      <img src="/portfolio/images/gabieicon_128.png" srcset="/portfolio/images/gabieicon_128.png 1x,/portfolio/images/gabieicon_256.png 2x" alt="<Gabriela> <Sewdhan>" class="avatar" width="120" height="120" loading="lazy" style="opacity: 0;">
      <h2 class="page-title hr-bottom"> About</h2>
      <p>Gabriela Sewdhan: curious software engineer and robotics enthusiast based in Trinidad.</p>
      <div class="sidebar-social"> <span class="sr-only">Social:</span>
        <ul>
          <li> 
            <a href="https://www.linkedin.com/in/gabriela-sewdhan-3ba495120" title="LinkedIn" class="no-mark-external"> <span class="icon-linkedin2"></span> <span class="sr-only">LinkedIn</span> </a>
          </li>
          <li> 
            <a href="https://github.com/GabrielaSewdhan" title="GitHub" class="no-mark-external"> <span class="icon-github"></span> <span class="sr-only">GitHub</span> </a>
          </li>
          <li> 
            <a href="mailto:gabiems13@gmail.com" title="Email" class="no-mark-external"> <span class="icon-mail"></span> <span class="sr-only">Email</span> </a>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</div>