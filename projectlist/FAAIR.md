---
layout: page
title: FAAIR – AI for Agriculture & Climate Resilience
sitemap: false
---

<div markdown="0">
  <header>
    <div class ="row_project">
      <div class="column_project_l">
        <div class="post-date"> 
          <time datetime="2023-06-01T00:00:00+00:00">01 Jun 2023</time> in <a href="/projects/" class="flip-title">Projects</a>
        </div>
      </div>
      <div class="column_project_l2">
        <a href="https://www.dropbox.com/scl/fi/xdd3sw417480cskvwc1g3/AI-for-Agriculture-brief.pdf?rlkey=c9g1hwdh3uido8vn1xvbeyvil&e=1&dl=0" target="_blank" class="external heading flip-title">Project Brief (PDF)</a> |
        <a href="/assets/docs/infographs/FAAIR_Conference_Poster.pdf" target="_blank" class="external heading flip-title">Conference Poster</a>
      </div>
    </div>

    <div class="lead aspect-ratio flip-project-img"> 
      <a href="/assets/docs/infographs/FAAIR_Conference_Poster.pdf" target="_blank" rel="noopener">
        <img src="/images/infographs/FAAIR_Conference_Poster.jpg" alt="FAAIR Conference Poster">
      </a>
    </div>
    <p class="note-sm" title="FAAIR – AI for Agriculture & Climate Resilience">
      FAAIR: Using drones, vegetation indices and AI models to help small-island farming systems adapt to climate change.
    </p>
  </header>
</div>

FAAIR (Farming Adaptation & Artificial Intelligence for Resilience) is a research and applied AI project that uses drone imagery, vegetation indices, and machine learning to generate landscape-level insights on crop health, weeds and land use in Caribbean small-island farming systems.
{:.lead}

The project focuses on building climate resilience by turning high-resolution UAV imagery into actionable maps and metrics that can support farmers, agronomists and policymakers. FAAIR combines field data, sensor readings and annotated imagery to train models that detect weeds, assess crop performance and characterise land use / land cover across farms.

Our main goals are:
- To generate high-quality, open geospatial datasets for climate-smart agriculture in Small Island Developing States.
- To support better, evidence-based decisions on crop management, water use, and agroecological planning.
- To build local capacity by releasing models, code and documentation that can be reused across similar projects.

This project was developed with team members **Michael Ali**, **Keanu Nichols**, **Nidia Sahjara** and **Mindy Mohammed**.
{:.heading.flip-title}

- Table of Contents
{:toc .large-only}

## Technologies Used
`Python` | `Jupyter` | `NumPy` | `Pandas` | `OpenCV` | `scikit-learn` | `GIS` | `QGIS` | `GeoTIFF`  
`UAV / Drone Imagery` | `Multispectral Cameras` | `Vegetation Indices (NDVI, etc.)`

## Hardware Used
`UAV / Drone Platforms` | `Multispectral Camera` | `RGB Camera` | `Field Sensors (temperature, humidity, soil/moisture)`  

## How does it work?

The FAAIR pipeline uses UAV flights over experimental plots and farmer fields to collect high-resolution imagery of key crops (such as pepper and pak choi) across wet and dry seasons. The raw imagery is processed into orthomosaics and vegetation indices (e.g. NDVI), then combined with field and sensor measurements.

From there:

- Images are tiled and prepared as georeferenced rasters.
- Vegetation, weeds and land-cover types are manually annotated to build labelled datasets.
- Machine learning and computer vision models are trained to detect weeds, assess crop vigour and identify land use / land cover.
- The resulting maps and metrics are used to understand spatial patterns of stress, productivity and risk under changing climate conditions.

The project also emphasises open science: datasets, code and model weights are prepared for release so that other researchers and practitioners across the region can build on FAAIR.

## Features

|                                                             | Completed      | To Do               |
|:------------------------------------------------------------|:--------------:|:-------------------:|
| Multi-season UAV data collection                            | &#x2714;       |                     |
| Vegetation index computation (NDVI + related indices)       | &#x2714;       |                     |
| Weeds and crop annotation pipeline                          | &#x2714;       |                     |
| Prototype weed detection and land-cover models              | &#x2714;       |                     |
| Landscape-level maps for selected pilot sites               | &#x2714;       |                     |
| Documentation & project brief                               | &#x2714;       |                     |
| Open dataset packaging (for GeoNode / open platforms)       |                | &#x2714;            |
| Expanded crop and site coverage across the region           |                | &#x2714;            |
| Integration into decision-support tools for farmers         |                | &#x2714;            |
{:.stretch-table.dl-table}

## Key Outputs

See our:

- [AI for Agriculture Project Brief (PDF)](https://www.dropbox.com/scl/fi/xdd3sw417480cskvwc1g3/AI-for-Agriculture-brief.pdf?rlkey=c9g1hwdh3uido8vn1xvbeyvil&e=1&dl=0){:target="_blank"}{:.heading.flip-title} — overview of the project, methods and early findings.
- [FAAIR Conference Poster](/assets/docs/infographs/FAAIR_Conference_Poster.pdf){:target="_blank"}{:.heading.flip-title} — visual summary of the research and model pipeline.

<div markdown="0">
  <aside class="related mb4" role="complementary">
    <h2 class="hr-bottom">Other Projects</h2>
    <ul class="related-posts">
      <li class="h4"> 
        <a href="/projectlist/RigidAprilTagBundleTracking/" class="flip-title"><span>Accurate AprilGroup Tracking</span></a> <time class="faded fine" datetime="2021-05-30T00:00:00+00:00">May 2021</time>
      </li>
        <li class="h4"> 
        <a href="/projectlist/PiDronics/" class="flip-title"><span>PiDronics</span></a> <time class="faded fine" datetime="2018-12-22T00:00:00+00:00">22 Dec 2018</time>
      </li>
      <li class="h4"> 
        <a href="/projectlist/QuickRental/" class="flip-title"><span>QuickRental</span></a> <time class="faded fine" datetime="2020-07-03T00:00:00+00:00">31 May 2019</time>
      </li>
      <li class="h4"> 
        <a href="/projectlist/AntiPlasti/" class="flip-title"><span>AntiPlasti</span></a> <time class="faded fine" datetime="2018-06-01T00:00:00+00:00">10 Feb 2019</time>
      </li>
      <li class="h4"> 
        <a href="/projectlist/dcitCamp-2017-2018/" class="flip-title"><span>DCIT Robotics Boot Camp</span></a> <time class="faded fine" datetime="2017-11-23T00:00:00+00:00">July 2017/2018</time>
      </li>
      <li class="h4"> 
        <a href="/projectlist/MetOracle/" class="flip-title"><span>MetOracle</span></a> <time class="faded fine" datetime="2017-11-23T00:00:00+00:00">31 Oct 2017</time>
      </li>
    </ul>
  </aside>
</div>
