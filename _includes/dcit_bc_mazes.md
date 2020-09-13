<div markdown="0">
    <div class="slideshow-container">
        <div class="mySlides_vid">
            <video style="width:100%" loading="lazy" controls>
                <source src="/images/projects/dcit_bootcamp/videos/maze_success.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p>Test</p>
        </div>
        <div class="mySlides_vid">
            <video style="width:100%" loading="lazy" controls>
                <source src="/images/projects/dcit_bootcamp/videos/maze_success2.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p>Test2</p>
        </div>
        <div class="mySlides_vid">
            <video style="width:100%" loading="lazy" controls>
                <source src="/images/projects/dcit_bootcamp/videos/creating_path.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p>Test3</p>
        </div>
        <div class="mySlides_vid">
            <video style="width:100%" loading="lazy" controls>
                <source src="/images/projects/dcit_bootcamp/videos/bot_humans.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p>Test4</p>
        </div>
        <button class="prev_vid" onclick="plusDivs(-1)">&#10094;</button>
        <button class="next_vid" onclick="plusDivs(1)">&#10095;</button>
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
