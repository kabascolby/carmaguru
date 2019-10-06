const current = document.querySelector('#current');
const imgs = document.querySelectorAll('.imgs img');
const opacity = 0.6;
let prev_image;
let count = 0

/* 
	set firt image opacity;
	imgs return a NodeList of all the image selector but It's not an array
	see mozilla doc for more details https://developer.mozilla.org/en-US/docs/Web/API/NodeList
	that's why i'm using a for loop instead of find with ES6 
*/
let first;
for (let i of imgs) {
    if (i.id === current.dataset.id) {
        first = i;
        break;
    }
}

first.style.opacity = opacity;
prev_image = first;

imgs.forEach(img => img.addEventListener('click', imgClick));

function imgClick(e) {
    // reset the opacity the opacity of the previous image
    prev_image.style.opacity = 1;
    //change click image to current image;
    current.src = e.target.src;
    current.dataset.id = e.target.id;
    current.alt = e.target.alt;

    //add fade in class
    current.classList.add('fade-in');

    //remove fadeIn class
    setTimeout(() => current.classList.remove('fade-in'), 500);

    //change the opacity of the selected image
    e.target.style.opacity = opacity;
    prev_image = e.target;

}

// https://www.youtube.com/watch?v=afoxd5b0bJo