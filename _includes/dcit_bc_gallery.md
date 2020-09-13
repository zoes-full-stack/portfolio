
<div markdown="0">
    <div class ="border_img">
        <div class="row_img">
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(1)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit16.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(2)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/dcit_hi.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(3)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit10.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(4)" class="hover-shadow cursor">
            </div>
        </div>
        <div class="row_img">
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit14.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(5)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/bob.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(6)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit8.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(7)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit15.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(8)" class="hover-shadow cursor">
            </div>
        </div>
        <div id="myModal" class="modal">
        <span class="close cursor" onclick="closeModal()">&times;</span>
        <div class="modal-content">
            <div class="mySlides">
            <div class="numbertext">1 / 8</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit.jpg" alt="Curie the Bot!" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">2 / 8</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit16.jpg" alt="Bob the Bot!" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">3 / 8</div>
            <img src="/images/projects/dcit_bootcamp/dcit_hi.jpg" alt="Curie the Curious Bot :)" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">4 / 8</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit10.jpg" alt="Oh Hi Mark!" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">5 / 8</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit14.jpg" alt="Bots ready for battle!" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">6 / 8</div>
            <img src="/images/projects/dcit_bootcamp/project_page/bob.jpg" alt="Make way for the first Bot for the BootCamp, Bob!" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">7 / 8</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit8.jpg" alt="Make way for the Bot King" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">8 / 8</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit15.jpg" alt="Bot Army!" class="gallery demo" style="width:100%">
            </div>
            <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
            <a class="next" onclick="plusSlides(1)">&#10095;</a>
            <div class="caption-container">
            <p id="caption"></p>
            </div>
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

 <!-- <div class="column_img">
            <img class="gallery demo cursor" src="i/images/projects/dcit_bootcamp/dcit_curie.jpg" style="width:100%" onclick="currentSlide(1)" alt="Nature and sunrise">
            </div>
            <div class="column_img">
            <img class="gallery demo cursor" src="/images/projects/dcit_bootcamp/dcit_curie.jpg" style="width:100%" onclick="currentSlide(2)" alt="Snow">
            </div>
            <div class="column_img">
            <img class="gallery demo cursor" src="/images/projects/dcit_bootcamp/dcit_curie.jpg" style="width:100%" onclick="currentSlide(3)" alt="Mountains and fjords">
            </div>
            <div class="column_img">
            <img class="gallery demo cursor" src="/images/projects/dcit_bootcamp/dcit_curie.jpg" style="width:100%" onclick="currentSlide(4)" alt="Northern Lights">
            </div> -->