// Global vars

let width = 500,
    height = 0,
    filter = 'none',
    streaming = false;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photos = document.getElementById('photos');
const photoButton = document.getElementById('photo-button');
const clearButton = document.getElementById('clear-button');
const photoFilter = document.getElementById('photo-filter');

// Media Stream

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
        /* Link to the video src */
        video.srcObject = stream;
        /* Play the video */
        video.play();
    })
    .catch(e => console.log('Error:' + e));

/* Play when ready */
video.addEventListener('canplay', function(e) {
    if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width)
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        streaming = true;
    }
}, false)


/* Photo button event */
photoButton.addEventListener('click', function(e) {
    takePicture();
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
    photos.innerHTML = '';

    /* change back filter to normal */
    filter = 'none';
    /* set video filter to default*/
    video.style.filter = filter;
    /* reset Select list */
    photoFilter.selectedIndex = 0;
    e.preventDefault();
})

/* Take picture from canvas */
function takePicture() {
    const context = canvas.getContext('2d');

    if (width && height) {
        canvas.width = width;
        canvas.height = height;

        /* Draw an image of the video on the canvas */
        context.drawImage(video, 0, 0, width, height);

        /* Create image from the canvas */
        const imgUrl = canvas.toDataURL('image/png');

        /* Create img element */
        const img = document.createElement('img');

        /* Set img src */
        img.setAttribute('src', imgUrl);

        img.style.filter = filter;

        /* Add img to photos */
        photos.appendChild(img);
    }
}