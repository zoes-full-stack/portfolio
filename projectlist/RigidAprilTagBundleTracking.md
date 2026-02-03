---
layout: page
title: Rigid AprilTag Bundle Tracking
sitemap: false
---

<div markdown="0">
  <header>
    <div class ="row_project">
      <div class="column_project_l">
        <div class="post-date"> 
          <time datetime="2021-05-31T00:00:00+00:00">May 2021</time> in <a href="/projects/" class="flip-title">Projects</a>
        </div>
      </div>
      <div class="column_project_l2">
        <a href="https://github.com/Virtana/accurate-aprilgroup-tracking/tree/feature/pentip-calibration" target="_blank" class="external heading flip-title">Source Code</a>
        <!-- Optional: add demo video if you have one -->
        <!-- | <a href="TODO" target="_blank" class="external heading flip-title">Demo</a> -->
      </div>
    </div>

    <div class="lead aspect-ratio flip-project-img"> 
      <img src="/images/projects/apriltags/apriltags_cover.jpg" alt="Apriltag Tracking cover" loading="lazy">
    </div>

    <p class="note-sm" title="Apriltag Tracking">Accurate AprilGroup Tracking: pose estimation + optical flow + calibration workflows</p>
  </header>
</div>

A research-heavy robotics project focused on **improving AprilTag pose tracking accuracy** beyond “plain solvePnP”, then using those poses for **real-time calibration** (including pen-tip calibration).
{:.lead}

Instead of treating pose estimation as a one-shot calculation, this project explores a more robust pipeline: **better initial guesses, tracking between frames, outlier rejection, and tighter calibration constraints**, with careful attention to real-world noise (lighting, motion blur, occlusions, and camera quirks).

- Table of Contents
{:toc .large-only}

## What this project is

This system tracks **AprilTags arranged as an “AprilGroup”** (a rigid object with multiple tags), estimates the object pose in real time, and optionally uses those poses to calibrate a pen tip. The goal is **stable, accurate pose estimation** that holds up under motion and imperfect conditions.

## Why it mattered

Typical marker pipelines can be fragile:
- jittery pose estimates
- sudden flips when tags are partially visible
- drift when the camera moves quickly
- outliers poisoning calibration datasets

So the work here was about building a pipeline that’s not just mathematically correct, but **operationally reliable**.

## Tech + environment

**Languages:** `Python`  
**Core libs:** `OpenCV`, `AprilTag`, `NumPy` (plus the repo requirements)  
**Platform:** Ubuntu (tested)  
**Hardware used:** USB camera, chessboard for calibration, AprilTags, calibrated dodecahedron “AprilGroup” (rigid multi-tag target)

## High-level pipeline

1. **Camera calibration**
   - Capture chessboard images
   - Compute intrinsics and store them for reuse
2. **Tag detection**
   - Detect multiple tags per frame
3. **Pose estimation (baseline)**
   - solvePnP with detected corners
4. **Pose improvement / stabilization**
   - Better initial guesses (enhanced APE)
   - Optical flow between frames for more tracked points
   - Outlier rejection (OpenCV method or velocity-vector method)
5. **Calibration workflows**
   - Pen-tip calibration using collected pose data under constraints

## Milestones (what I actually built)

### 1) “Make it run cleanly” (build + reproducibility)
This project has a real-world setup burden: multiple native libs + Python deps.

What I did:
- documented the system dependencies clearly (Ubuntu, OpenCV, AprilTag, requirements.txt)
- created a consistent install path + folder structure
- added CLI flags so functionality can be enabled/disabled without editing code

What I learned:
- reproducibility is a feature. Your research code becomes “real” when someone else can run it.

### 2) Camera calibration + data paths
Calibration is the foundation. Bad intrinsics = everything downstream lies.

What I did:
- automated the “use existing intrinsics if found, otherwise calibrate” flow
- enforced a simple workflow: drop chessboard images into a folder, run main

How I adapted:
- treated calibration as a **first-class step** rather than an afterthought
- wrote notes on lighting/motion blur impact to reduce garbage inputs

### 3) Multi-tag pose estimation (AprilGroup concept)
A single tag can fail. Multiple tags gives robustness.

What I did:
- built support for using multiple detected tag IDs per frame
- structured the project so the “group” geometry can be provided as JSON

Constraint handled:
- the calibrated dodecahedron geometry JSON is omitted for confidentiality, so the code needed to still be understandable without it.

### 4) Optical flow tracking + outlier rejection
Optical flow increases point density and improves continuity between frames, but it also adds new failure modes.

What I did:
- integrated Lucas-Kanade pyramidal optical flow (toggleable via flag)
- supported different outlier rejection strategies:
  - OpenCV outlier method
  - velocity-vector method (based on referenced research approach)

What I learned:
- when you add a stabilizer (optical flow), you also add *new types of wrong*.
- outlier detection isn’t optional. It’s the seatbelt.

### 5) Pen-tip calibration workflows
Once pose is stable, calibration becomes usable.

What I did:
- implemented pen-tip calibration routines (Algebraic One / Two Step)
- added strict filtering guidance:
  - mean reprojection error < 1
  - only accept frames when ≥ 3 tags are detected
  - disable optical flow for tighter constraints (when needed)

What I learned:
- good calibration is about **data quality gates**, not just math.

## What went wrong (and how I handled it)

### Motion blur + lighting variability
Symptoms:
- pose jitter, inconsistent tag detection, occasional pose flips

Fixes / mitigation:
- added tighter data capture guidance
- constrained calibration dataset acceptance
- emphasized good capture conditions and filtering

### Library linking + environment complexity
Symptoms:
- OpenCV / apriltag imports failing depending on environment paths

Fixes:
- explicit linking steps documented for venv usage
- made setup notes pragmatic (“these were my paths, yours may differ”)
- kept requirements in `requirements.txt` and installation steps grouped

### “It works, but it’s not stable”
Symptoms:
- baseline solvePnP works but is noisy frame-to-frame

Fixes:
- improved the initial guess approach (enhanced APE option)
- optical flow for continuity
- outlier rejection strategies selectable via CLI

## What I learned

- **Applied computer vision pragmatically**: calibration, pose estimation, optical flow, outlier filtering
- **Built “research code” like production code**: flags, logging, clear setup steps, reproducible run path
- **Made tradeoffs intentionally**: stability vs sensitivity, tight constraints vs “more data”
- **Debugged real-world CV issues**: motion blur, lighting, drift, and noisy detections
- **Designed for future extension**: modular steps, configurable methods, swappable outlier strategies

<div markdown="0">
  <aside class="related mb4" role="complementary">
    <h2 class="hr-bottom">Other Projects</h2>
    <ul class="related-posts">
      <li class="h4"> 
        <a href="/projectlist/FAAIR/" class="flip-title"><span>FAAIR</span></a> <time class="faded fine" datetime="2021-05-30T00:00:00+00:00">2023 - 2025</time>
      </li>
      <li class="h4"> 
        <a href="/projectlist/QuickRental/" class="flip-title"><span>QuickRental</span></a> <time class="faded fine" datetime="2020-07-03T00:00:00+00:00">31 May 2019</time>
      </li>
      <li class="h4"> 
        <a href="/projectlist/AntiPlasti/" class="flip-title"><span>AntiPlasti</span></a> <time class="faded fine" datetime="2018-06-01T00:00:00+00:00">10 Feb 2019</time>
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

