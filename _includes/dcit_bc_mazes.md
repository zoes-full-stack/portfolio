<div markdown="0">
    <div class="slideshow-container">
        <iframe class="mySlides_vid" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/maze_success.mp4">
        </iframe>
        <iframe class="mySlides_vid" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/maze_success2.mp4">
        </iframe>
        <iframe class="mySlides_vid" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/creating_path.mp4">
        </iframe>
        <iframe class="mySlides_vid" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/bot_humans.mp4">
        </iframe>
        <button class="prev" onclick="plusDivs(-1)">&#10094;</button>
        <button class="next" onclick="plusDivs(1)">&#10095;</button>
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
  var x = document.getElementsByClassName("mySlides_vid");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}
</script>
