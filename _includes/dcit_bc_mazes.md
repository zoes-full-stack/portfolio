
<div markdown="0">
    <div class ="border_img">
        <div class="row_img">
            <div class="column_img">
                <iframe class="gallery" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/maze_success.mp4" class="hover-shadow cursor">
                </iframe>
            </div>
            <div class="column_img">
                <iframe class="gallery" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/maze_success2.mp4" class="hover-shadow cursor">
                </iframe>
            </div>
            <div class="column_img">
                <iframe class="gallery" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/creating_path.mp4" class="hover-shadow cursor">
                </iframe>
            </div>
            <div class="column_img">
                <iframe class="gallery" style="width:100%" loading="lazy" src="/images/projects/dcit_bootcamp/videos/bot_humans.mp4" class="hover-shadow cursor">
                </iframe>
            </div>
        </div>
    </div>
</div>

<script>
function openModal() {
  document.getElementById("myModal").style.display = "block";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
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

<script>
var modal = document.getElementById('myModal');

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
</script>