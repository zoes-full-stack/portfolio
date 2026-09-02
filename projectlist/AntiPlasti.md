---
layout: page
title: AntiPlasti
liquid: true
sitemap: false
---

{::nomarkdown}
{% include status-update.html
  label="Status update"
  tone="ocean"
  title="WiseOceans update"
  date="2026-01-10"
  body='My team and I have picked this project back up with <a href="https://wiseoceans.com/" target="_blank" rel="noopener">WiseOceans</a>. Updates coming soon ✅'
%}
{:/nomarkdown}

<div markdown="0" class="mt-30">
  <header>
    <div class ="row_project">
      <div class="column_project_l">
        <div class="post-date"> 
          <time datetime="2020-05-31T00:00:00+00:00">10 Feb 2019</time> in <a href="/projects/" class="flip-title">Projects</a>
        </div>
      </div>
      <div class="column_project_l2">
        <a href="https://github.com/antiplasti" target="_blank" class="external heading flip-title">Source Code</a>
      </div>
    </div>
    <div class="lead aspect-ratio sixteen-nine flip-project-img"> 
      <img src="/images/projects/antiplasti/antiplasti_large.jpg" alt="AntiPlasti" width="864" height="486" loading="lazy">
    </div>
    <p class="note-sm" title="AntiPlasti"> AntiPlasti: Reducing Oceanic Pollutants</p>
  </header>
</div>

Reducing the plastics surrounding islands, along with weather prediction, resulting in climate change resilience and environment well-being, one step at a time.
{:.lead}

This project was developed alongside team members [Michael Ali](https://www.linkedin.com/in/michael-ali-79531932/){:target="_blank"}{:.heading.flip-title} and [Qarun Bissoondial](https://www.linkedin.com/in/qarun-qadir-bissoondial/){:target="_blank"}{:.heading.flip-title} for the DadliHack 2.0 Hackathon.


## Technologies and Hardware Used
`Python` | `Digital Ocean` | `Raspberry Pi` |  `Nodejs` | `Reactjs` | `Firebase Database` | `Javascript` | `HTML` | `CSS`
<!-- {:.faded} -->


## How does it work?
There are three parts to this system. 
- The [image recognition model](https://github.com/antiplasti/Plastic-Detection-Model){:target="_blank"}{:.heading.flip-title} was built to  detect plastics, glass, paper, rubbish, metal and cardboard in the ocean. 
- [Digital Ocean](https://github.com/antiplasti/Anti-Plasti-System){:target="_blank"}{:.heading.flip-title} is used as a server to install the necessary requirements, and train the image recognition model. 
- A **raspberry pi**, mounted with a camera, wrapped in a buoy, uses the server to send images and calls on the image recognition model to detect oceanic pollution. 

The image and location of that pollution is sent to the **AntiPlasti** web app via the **Firebase Database**. 

This will notify the government and community where the pollution occurs and result in the removal of this pollution leading to cleaner, safer areas and also reducing climate change via reducing the emission of greenhouse gases from the breakdown of plastics.

## Features

|                               | Completed      | To Do               |
|:------------------------------|:--------------:|:-------------------:|
| Object Detection              | &#x2714;       |                     |
| Oceanic Pollution Monitoring  | &#x2714;       |                     |
| Location Tracking             | &#x2714;       |                     |
| Google Maps Integration       | &#x2714;       |                     |
| Push Notifications            | &#x2714;       |                     |
| Testing                       | &#x2714;       |                     |
| Physical Deployment           |                | &#x2714;            |
| Source Code                   | [GitHub](https://github.com/antiplasti){:target="_blank"}{:.heading.flip-title}   |                   |
{:.stretch-table.dl-table}

<div markdown="0">
  <aside class="related mb4" role="complementary">
    <h2 class="hr-bottom">Other Projects</h2>
    <ul class="related-posts">
      <li class="h4"> 
        <li class="h4"> 
        <a href="/projectlist/FAAIR/" class="flip-title"><span>FAAIR</span></a> <time class="faded fine" datetime="2021-05-30T00:00:00+00:00">2023 - 2025</time>
      </li>
        <a href="/projectlist/RigidAprilTagBundleTracking//" class="flip-title"><span>Rigid AprilTag Bundle Tracking</span></a> <time class="faded fine" datetime="2021-05-30T00:00:00+00:00">May 2021</time>
      </li>
      <li class="h4"> 
        <a href="/projectlist/QuickRental/" class="flip-title"><span>QuickRental</span></a> <time class="faded fine" datetime="2020-07-03T00:00:00+00:00">31 May 2019</time>
      </li>
      <li class="h4"> 
        <a href="/projectlist/PiDronics/" class="flip-title"><span>PiDronics</span></a> <time class="faded fine" datetime="2018-06-01T00:00:00+00:00">22 Dec 2018</time>
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
