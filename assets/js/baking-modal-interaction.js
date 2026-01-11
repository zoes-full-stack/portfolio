function openModal_baking() {
  document.getElementById("baking_modal").style.display = "block";
}

function closeModal_baking() {
  document.getElementById("baking_modal").style.display = "none";
}

var slideIndex = 1;
showSlides_baking(slideIndex);

function plusSlides_baking(n) {
  showSlides_baking(slideIndex += n);
}

function currentSlide_baking(n) {
  showSlides_baking(slideIndex = n);
}

function showSlides_baking(n) {
  var i;
  var slides_baking = document.getElementsByClassName("mySlides_mentors");
  var dots_baking = document.getElementsByClassName("demo_mentors");
  var captionText_baking = document.getElementById("caption_mentors");
  if (n > slides_baking.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides_baking.length}
  for (i = 0; i < slides_baking.length; i++) {
      slides_baking[i].style.display = "none";
  }
  for (i = 0; i < dots_baking.length; i++) {
      dots_baking[i].className = dots_baking[i].className.replace(" active", "");
  }
  slides_baking[slideIndex-1].style.display = "block";
  dots_baking[slideIndex-1].className += " active";
  captionText_baking.innerHTML = dots_baking[slideIndex-1].alt;
}


var modal_baking = document.getElementById('baking_modal');

window.addEventListener("click", function(event_baking) {
    if (event_baking.target == modal_baking) {
    modal_baking.style.display = "none";
  }
});
