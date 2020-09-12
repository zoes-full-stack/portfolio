
<div markdown="0">
    <div class ="border_img">
        <div class="row_img">
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit19.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(1)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit20.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(2)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit21.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(3)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit22.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(4)" class="hover-shadow cursor">
            </div>
        </div>
        <div class="row_img">
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit1.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(5)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit3.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(6)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit9.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(7)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit6.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(8)" class="hover-shadow cursor">
            </div>
        </div>
        <div class="row_img">
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit7.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(9)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit4.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(10)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/dcit2.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(11)" class="hover-shadow cursor">
            </div>
            <div class="column_img">
                <img src="/images/projects/dcit_bootcamp/project_page/dcit12.jpg" class="gallery" style="width:100%" loading="lazy" onclick="openModal();currentSlide(12)" class="hover-shadow cursor">
            </div>
        </div>
        <div id="myModal" class="modal">
        <span class="close cursor" onclick="closeModal()">&times;</span>
        <div class="modal-content">
            <div class="mySlides">
            <div class="numbertext">1 / 12</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit19.jpg" alt="Curie the Bot!" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">2 / 12</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit20.jpg" alt="Bob the Bot!" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">3 / 12</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit21.jpg" alt="Make way for the Bot King" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">4 / 12</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit22.jpg" alt="Oh Hi Mark!" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">5 / 12</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit1.jpg" alt="Bots ready for battle!" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">6 / 12</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit3.jpg" alt="Top View of the bot army!" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">7 / 12</div>
            <img src="/images/projects/dcit_bootcamp/dcit9.jpg" alt="Curie :3" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">8 / 12</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit6.jpg" alt="Bot Army" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">9 / 12</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit7.jpg" alt="Bot Army" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">10 / 12</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit4.jpg" alt="Bot Army" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">11 / 12</div>
            <img src="/images/projects/dcit_bootcamp/dcit2.jpg" alt="Bot Army" class="gallery demo" style="width:100%">
            </div>
            <div class="mySlides">
            <div class="numbertext">12 / 12</div>
            <img src="/images/projects/dcit_bootcamp/project_page/dcit12.jpg" alt="Bot Army" class="gallery demo" style="width:100%">
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