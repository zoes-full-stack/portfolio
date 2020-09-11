---
layout: page
title: MetOracle
sitemap: false
---


<div markdown="0">
  <header>
    <div class ="row_project">
      <div class="column_project_l">
        <div class="post-date"> 
          <time datetime="2020-05-31T00:00:00+00:00">31 October 2017</time> in <a href="/portfolio/projects_test/" class="flip-title">Projects</a>
        </div>
      </div>
      <div class="column_project_l2">
        <a href="https://comp3613-pisynthesis.firebaseapp.com/" target="_blank" class="external heading flip-title">MetOracle</a> |
        <a href="https://github.com/irontarkus95/MET-Oracle-lstm-time-series-weather-prediction" target="_blank" class="external heading flip-title">Source Code</a>
      </div>
    </div>
    <div class="lead aspect-ratio sixteen-nine flip-project-img"> 
      <img src="/portfolio/images/projects/metOracle/weather.gif" alt="metoracle" width="864" height="486" loading="lazy">
    </div>
    <p class="note-sm" title="metoracle"> Project intro goes here...</p>
  </header>
</div>


Convienient, efficient and quick yet thorough apartment searching. All you need in just one place!
{:.lead}

Within Trinidad and Tobago, there has been a severe problem concerning flooding in many boroughs and water shortages due to droughts. This is due to poor planning from a lack of awareness to the changes in our country's climate due to climate change. 

People may know of Global Warming, and attribute every hot day to it, but we have found a way to show the quantifiable effects of global warming in order to raise awareness, and to more accurately predict the changes in weather to better prepare farmers, city planners and everyday citizens. 

Our main goals are:
- To prepare our city planners and everyday citizens for the trials ahead due to the extreme weather events that result from climate change.

**MET-Oracle** is a tool to improve the lives of citizens and increase infrastructure's resilience, in Trinidad and Tobago, by helping us predict and prepare for adverse weather conditions brought on by Global Warming, and quantifying the effect it will have on our country's climate. It is a linear regression model built in Python using Tensorflow and our web interface uses the Google Maps API.

This project was developed alongside team members [Michael Ali](https://www.linkedin.com/in/michael-ali-79531932/){:target="_blank"}{:.heading.flip-title} and [Qarun Bissoondial](https://www.linkedin.com/in/qarun-qadir-bissoondial/){:target="_blank"}{:.heading.flip-title}.


- Table of Contents
{:toc .large-only}


## Technologies Used
`Python` | `C` | `Tensorflow` | `Google Maps API` | `JavaScript` | `HTML` | `CSS` | `Firebase Database`
{:.faded}


## How does it work?
Our implementation uses AI, in the form of a model using **tensorflow**, as well as an **array of sensors** at strategic locations to better understand the long term effects that global warming will have on our country's climate and thus to adequately prepare. 

A **central server** collects predictions from tensorflow and real-time data from sensors and makes a comparison between the two values. 

Once they are within a margin of error and the data follows a particular weather pattern, the pi receives a response from the server and takes appropriate action. 

A **web app** is also used to view the real-time data at a particular sensor.

As this system grows and continues to improve over time, the accuracy and reliability will also increase and will better be able to benefit Trinidad and Tobago from an infrastructural and economic standpoint.


## Features

|                               | Completed      | To Do               |
|:------------------------------|:--------------:|:-------------------:|
| Web Scraping                  | &#x2714;       |                     |
| Weather Prediction            | &#x2714;       |                     |
| Live Graph Data               | &#x2714;       |                     |
| Monitoring WebApp             | &#x2714;       |                     |
| Source                        | [GitHub](https://github.com/irontarkus95/MET-Oracle-lstm-time-series-weather-prediction){:target="_blank"}  |             |
{:.stretch-table.dl-table}
 
## Future Implementation

= It was planned to use neural networks and supplied river levels to predict and help prepare for flooding, however, it was not feasible in the timeframe. 
- In addition, Google Cloud Computing was the first choice for implementing the neural network so that users can directly interact with the model. For example, being able to enter a future date and then shown both curve plots and a geographical representation. Google Cloud has a free solution which we hoped and prepared to implement, however, our credit cards were refused during signup.

### Updates Coming Soon...

<div markdown="0">
  <hr class="dingbat related">
  <aside class="about related mt4 mb4" role="complementary">
    <div class="author mt4"> 
      <img src="/portfolio/images/gabieicon_128.png" srcset="/portfolio/images/gabieicon_128.png 1x,/portfolio/images/gabieicon_256.png 2x" alt="<Gabriela> <Sewdhan>" class="avatar" width="120" height="120" loading="lazy" style="opacity: 0;">
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
        <a href="/portfolio/projectlist/QuickRental/" class="flip-title"><span>QuickRental - Appartment Rental App (something)</span></a> <time class="faded fine" datetime="2020-07-03T00:00:00+00:00">31 May 2019</time>
      </li>
      <li class="h4"> 
        <a href="/portfolio/projectlist/AntiPlasti/" class="flip-title"><span>AntiPlasti</span></a> <time class="faded fine" datetime="2018-06-01T00:00:00+00:00">10 Feb 2019</time>
      </li>
      <li class="h4"> 
        <a href="/portfolio/projectlist/PiDronics/" class="flip-title"><span>PiDronics - Automated Hydroponics Monitoring System</span></a> <time class="faded fine" datetime="2017-11-23T00:00:00+00:00">22 Dec 2018</time>
      </li>
      <li class="h4"> 
        <a href="/portfolio/projectlist/dcitCamp-2017-2018/" class="flip-title"><span>DCIT Robotics BootCamp</span></a> <time class="faded fine" datetime="2017-11-23T00:00:00+00:00">July 2017/2018</time>
      </li>
    </ul>
  </aside>
</div>
