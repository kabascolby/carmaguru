// Global vars
import {
    LayerElements,
    streamVideo,
    api,
    renderThumbmail,
    resetElements,
    state,
    ImgToSend,
} from './utils.js';
let width = 500,
    height = 0,
    filter = 'none',
    streaming = false,
    image = undefined;



/* Dom elements */
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photos = document.getElementById('photos');
const photoButton = document.getElementById('capture');
const clearButton = document.getElementById('clear-button');
const photoFilter = document.getElementById('photo-filter');
const layer = document.getElementById('imgs-layer');
const loadImage = document.getElementById('file-input');
const mainImage = document.querySelector('.main_image');
const saveImg = document.getElementById('save-img');
let currentImg;

/* Play when ready */
video.addEventListener('canplay', function(e) {
    if (!streaming) {
        var videoRatio = video.videoWidth / video.videoHeight;
        // The width and height of the video element
        width = video.offsetWidth;
        height = video.offsetHeight;
        // The ratio of the element's width to its height
        var elementRatio = width / height;
        // If the video element is short and wide
        if (elementRatio > videoRatio) width = height * videoRatio;
        // It must be tall and thin, or exactly equal to the original ratio
        else height = width / videoRatio;
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        LayerElements.balls.height = height;
        LayerElements.balls.width = width;
        LayerElements.flower.height = LayerElements.border.height = height / 2;
        LayerElements.flower.width = LayerElements.border.width = height / 2;
        streaming = true;
    }
}, false)


/* --------------------------------------Take picture From source------------------------------------ */
function takePicture(source) {
    //Todo Save th e state of the image on save
    resetElements('block', 'none', false);
    // Draw image to the canvas
    const context = canvas.getContext('2d');
    // reading the name of the object
    let props = LayerElements[image.dataset.name];
    // console.log(props.width, props.height)

    // Draw an image source on the canvas
    context.drawImage(source, 0, 0, width, height);
    /* Draw layer to the canvas */
    context.drawImage(image, props.top, props.left, props.width, props.height);

    // Create image from the canvas
    const imgUrl = canvas.toDataURL('image/png');

    // Set img src
    mainImage.setAttribute('src', imgUrl);

    mainImage.style.filter = filter;

    currentImg = {
        data: mainImage.src,
        filter,
    }

    video.srcObject.getVideoTracks().forEach(track => track.stop())
        // reset image
    image = undefined;
    state.value == 0;
}
/* --------------------------------------------------------------------------------------------------------- */

/* ----------------------------- Load images from files --------------http://jsfiddle.net/kepd5d40/3/-------------------- */

function placeImage(e) {
    resetElements('none', 'none', '');
    // check if video is running stop it
    state.value && video.srcObject.getVideoTracks().forEach(track => track.stop());

    if (loadImage.files[0] && (/\.(jpe?g|png|gif)$/i.test(loadImage.files[0].name))) {
        var reader = new FileReader();
        var file = loadImage.files[0];
        var img = new Image();
        img.onload = function() {
            takePicture(img);
        }

        // this is to setup loading the image
        reader.onloadend = function() {
            img.src = reader.result;
        }

        // this is to read the file
        reader.readAsDataURL(file);
    } else {
        saveImg.disabled = true;
        alert('invalide file');
    }
}
/* --------------------------------------------------------------------------------------------------------- */


/* --------------------------------------Save image to the Database ------------------------------------ */
function saveImage() {
    let options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(currentImg)
    }

    api('/gallery/meta-data', options, (err, userImgs) => {
        if (err) {
            alert('Ooops please retry again')
            console.log(err);
        } else {
            userImgs.data = currentImg.data;
            userImgs.filter = filter;
            renderThumbmail(userImgs);
            image = undefined;
            state.value == 0;
            // saveImg.disabled = true; //remove comment later;
        }
    });

    /* TODO lock the save button when the image is save */
}


/* --------------------------------------------------------------------------------------------------------- */

/* --------------------------------------Delete image from the Database ------------------------------------ */
function deleteImg(e) {
    const img = e.nextElementSibling;
    const options = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },

        body: JSON.stringify({
            id: img.id
        })
    }

    api('/gallery', options, (err, result) => {
        if (err) {
            console.log(err);
        }
    })
}
/* --------------------------------------------------------------------------------------------------------- */




/* ----------------------------Event listeeners----------------------------------------------------------- */
layer.addEventListener('click', e => {
    /* getting the selected Layer */
    image = e.target;
});

loadImage.addEventListener('change', (e) => {
    if (image) {
        placeImage(e)
    } else {
        alert('You have to select a layer')
    }
});


/* Photo button event */
photoButton.addEventListener('click', function(e) {
    if (image && state.value === 1) {
        takePicture(video);
    } else if (!image) {
        alert('You have to select a layer');
        streamVideo();

    } else {
        streamVideo();
    }
    e.preventDefault();
}, false)


/* filter event */
photoFilter.addEventListener('change', function(e) {
    /* Set filter to chosen option */
    filter = e.target.value;
    video.style.filter = filter;
    e.preventDefault();
})

/* Clear Event */

clearButton.addEventListener('click', function(e) {
    /* clear photos */
    /* change back filter to normal */
    filter = 'none';
    /* set video filter to default*/
    video.style.filter = filter;
    /* reset Select list */
    photoFilter.selectedIndex = 0;
    e.preventDefault();
})

saveImg.addEventListener('click', saveImage);

document.getElementById('img-grid').addEventListener('click', (e) => {
        if (e.target.className == 'del_img') {
            e.target.closest('div').remove()
            e.target.addEventListener('click', deleteImg(e.target))
        }
    }, false)
    /* --------------------------------------------------------------------------------------------------------- */

/* First step start Streaming */
streamVideo();