---
layout: page
title: PiDronics
sitemap: false
---


<div markdown="0">
  <header>
    <div class ="row_project">
      <div class="column_project_l">
        <div class="post-date"> 
          <time datetime="2020-05-31T00:00:00+00:00">22 Dec 2018</time> in <a href="/projects/" class="flip-title">Projects</a>
        </div>
      </div>
      <div class="column_project_l2">
        <a href="https://pidronics.firebaseapp.com/" target="_blank" class="external heading flip-title">PiDronics WebApp</a> |
        <a href="https://github.com/PiDronics" target="_blank" class="external heading flip-title">Source Code</a>
      </div>
    </div>
    <div class="lead aspect-ratio flip-project-img"> 
      <video width="864" height="500" poster="/images/projects/pidronics/pidronics_img.png" autoplay loop muted playsinline>
        <source src="/images/projects/pidronics/PiDronics_intro.mp4" type="video/mp4">
        <!-- <source src="movie.ogg" type="video/ogg"> -->
        Your browser does not support the video tag.
      </video>
    </div>
    <p class="note-sm" title="PiDronics"> PiDronics: Automated Hydroponics Monitoring System</p>
  </header>
</div>


We aim to ease farmer's lives by building an automatic hydroponics system that takes little to no prior knowledge to use and with a low cost of entry.
{:.lead}

Hydroponics is a compact and efficient alternative to soil agriculture. One of the major challenges faced by hydroponics farmers is measuring important values from their system and making the necessary adjustments. This is time consuming and sometimes can be costly. 

Our main goals are:
- To make hydroponics easier for farmers
- To help farmers better understand the needs of their crops
- To encourage more people to get involved in hydroponics

This project was developed alongside team members [Michael Ali](https://www.linkedin.com/in/michael-ali-79531932/){:target="_blank"}{:.heading.flip-title}, [Qarun Bissoondial](https://www.linkedin.com/in/qarun-qadir-bissoondial/){:target="_blank"}{:.heading.flip-title} and [Kristan Birbalsingh](https://www.linkedin.com/in/kristan-birbalsingh/){:target="_blank"}{:.heading.flip-title}.

- Table of Contents
{:toc .large-only}

## Technologies Used
`Python` | `Shell` | `Reactjs` | `Javascript` |`HTML` | `CSS` | `Firebase Database`
<!-- {:.faded} -->

<!-- get rest of sensors -->
## Hardware Used 
`Raspberry Pi` | `Temperature Sensor` | `Humidity Sensor` |`pH Sensor` 
<!-- {:.faded} -->

## How does it work?
The PiDronics application simply grabs sensor data from a hydroponics loop and displays it in a clean, intuitive interface. Some of the readings taken are as follows:

- Water temperature
- Nutrient concentration
- Dissolved Oxygen
- Humidity of the air
- pH of water

The data taken from these sensors are pushed to the web app/site, to determine if the data is at optimum levels. If not, the systems such as sun lamps, oxygen pumps, sprinklers etc will be triggered to act and get the humidity/temperature/pH/dissolved oxygen/nutrient solution to an optimum level.


## Features

|                                       | Completed      | To Do               |
|:--------------------------------------|:--------------:|:-------------------:|
| Authentication                        | &#x2714;       |                     |
| Hydroponics Remote Monitoring System  | &#x2714;       |                     |
| CRUD Farm System & Sensors            | &#x2714;       |                     |
| Plant Disease Recognition             | &#x2714;       |                     |
| Educational Tool                      | &#x2714;       |                     |
| Dashboard                             | &#x2714;       |                     |
| Time Series Graphs                    | &#x2714;       |                     |
| Live Video Monitoring                 |                | &#x2714;            |
| Note System                           |                | &#x2714;            |
| Reporting System                      |                | &#x2714;            |
| Notification System                   |                | &#x2714;            |
| Multiple Sensor Implementation        |                |                     |
| Source Code                           | [GitHub](https://github.com/PiDronics){:target="_blank"}{:.heading.flip-title}  |             |
{:.stretch-table.dl-table}
 

## Full Implementation

See Our
- [Project Video](https://youtu.be/EED9S3SFkr0){:target="_blank"}{:.heading.flip-title}. Audio to be added soon!
- [Product Manual](https://docs.google.com/document/d/1FWLsea7MBdXaazkmk156T1Quhn5-B72oxn0frQKcgs8/edit?usp=sharing){:target="_blank"}{:.heading.flip-title} to understand the usage of the system.
- [PiDronics Web App](https://pidronics.firebaseapp.com/){:target="_blank"}{:.heading.flip-title} for a demo of the system.
- [Project Document](https://docs.google.com/document/d/19n-Tqvua5BX2gGXPMfhZQK4Tw7byQBMCGW686ZdKLPQ/edit?usp=sharing){:target="_blank"}{:.heading.flip-title} for detailed features and information.
Maybe just glance at it to confirm that it is indeed a pretty long list.

### Updates Coming Soon... :relaxed:


<div markdown="0">
  <hr class="dingbat related">
  <aside class="about related mt4 mb4" role="complementary">
    <div class="author mt4"> 
      <img src="/images/gabieicon_128.png" srcset="/images/gabieicon_128.png 1x,/images/gabieicon_256.png 2x" alt="<Gabriela> <Sewdhan>" class="avatar" width="120" height="120" loading="lazy" style="opacity: 0;">
      <h2 class="page-title hr-bottom"> About</h2>
      <p>Gabriela Sewdhan: software engineer, robotics enthusiast and baker based in Trinidad.</p>
      <div class="sidebar-social"> <span class="sr-only">Social:</span>
        <ul>
          <li> 
            <a href="https://www.linkedin.com/in/gabriela-sewdhan-3ba495120" target="_blank" title="LinkedIn" class="no-mark-external"> <span class="icon-linkedin2"></span> <span class="sr-only">LinkedIn</span> </a>
          </li>
          <li> 
            <a href="https://github.com/GabrielaSewdhan" target="_blank" title="GitHub" class="no-mark-external"> <span class="icon-github"></span> <span class="sr-only">GitHub</span> </a>
          </li>
          <li> 
            <a href="mailto:gabiems13@gmail.com" target="_blank" title="Email" class="no-mark-external"> <span class="icon-mail"></span> <span class="sr-only">Email</span> </a>
          </li>
        </ul>
      </div>
    </div>
  </aside>
  <aside class="related mb4" role="complementary">
    <h2 class="hr-bottom">Other Projects</h2>
    <ul class="related-posts">
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
