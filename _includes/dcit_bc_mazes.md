<div markdown="0">
    <div class="slideshow-container">
        <video class="mySlides_vid" style="width:100%" loading="lazy" controls>
            <source alt="Successfully Completed the Maze!" class="demo_vids" src="/images/projects/dcit_bootcamp/videos/maze_success.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <video class="mySlides_vid" style="width:100%" loading="lazy" controls>
            <source alt="Another Success!" class="demo_vids" src="/images/projects/dcit_bootcamp/videos/maze_success2.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <video class="mySlides_vid" style="width:100%" loading="lazy" controls>
            <source alt="Creating it's own path!" class="demo_vids" src="/images/projects/dcit_bootcamp/videos/creating_path.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <video class="mySlides_vid" style="width:100%" loading="lazy" controls>
            <source alt="Going straight to the humans!" class="demo_vids" src="/images/projects/dcit_bootcamp/videos/bot_humans.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <button class="prev_vid" onclick="plusDivs(-1)">&#10094;</button>
        <button class="next_vid" onclick="plusDivs(1)">&#10095;</button>
        <div class="caption-container">
            <p id="caption_vids"></p>
        </div>
    </div>
</div>

<script>
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo_vids");
  var captionText = document.getElementById("caption_vids");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}
</script>
