
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">

<div markdown="0">
    <div class="w3-content w3-display-container">
        <iframe class="mySlides_vid" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/maze_success.mp4">
        </iframe>
        <iframe class="mySlides_vid" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/maze_success2.mp4">
        </iframe>
        <iframe class="mySlides_vid" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/creating_path.mp4">
        </iframe>
        <iframe class="mySlides_vid" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/bot_humans.mp4">
        </iframe>
        <button class="w3-button w3-black w3-display-left" onclick="plusDivs(-1)">&#10094;</button>
        <button class="w3-button w3-black w3-display-right" onclick="plusDivs(1)">&#10095;</button>
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

    <!-- <div class ="border_img">
        <div class="row_img">
            <div class="column_vid">
                <iframe style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/maze_success.mp4">
                </iframe>
            </div>
            <div class="column_vid">
                <iframe style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/maze_success2.mp4">
                </iframe>
            </div>
        </div>
    </div>
    <div class ="border_img">
        <div class="row_img">
            <div class="column_vid">
                <iframe style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/creating_path.mp4">
                </iframe>
            </div>
            <div class="column_vid">
                <iframe style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/bot_humans.mp4">
                </iframe>
            </div>
        </div>
    </div> -->