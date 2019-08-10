const current = document.querySelector('#current');
const imgs = document.querySelectorAll('.imgs img');
const opacity = 0.6;
// var prev_image = { target: { style: { opacity: 1 } } };
var prev_image;

var count = 0

// set firt image opacity;
imgs[0].style.opacity = opacity;
prev_image = imgs[0];

imgs.forEach(img => img.addEventListener('click', imgClick));

function imgClick(e) {
    // reset the opacity the opacity of the previous image
    prev_image.style.opacity = 1;
    //change click image to current image;
    current.src = e.target.src;

    //add fade in class
    current.classList.add('fade-in');

    //remove fadeIn class
    setTimeout(() => current.classList.remove('fade-in'), 500);

    //change the opacity of the selected image
    e.target.style.opacity = opacity;
    prev_image = e.target;

}

// https://www.youtube.com/watch?v=afoxd5b0bJo