import {
    api,
    renderThumbmail,
    resetElements,
    state,
    ImgToSend,
    currentImg
} from './utils.js';

let filter = 'none',
    width = 500,
    height = 0,
    streaming = false;

const captureButton = document.getElementById('capture');
const fileInput = document.getElementById('file-input');

const player = document.getElementById('player');
const preview = document.querySelector('.capture>img');
const canvas = document.getElementById('canvas');
const saveImg = document.getElementById('save-img');
const updateImg = document.getElementById('update-img');
const thumb = document.getElementById('img-grid');
const photoFilter = document.getElementById('photo-filter');
const layer = document.getElementById('imgs-layer');
let image = undefined;

function shoot() {
    if (state.value == 1 && image) {
        resetElements('none', 'none', 'inline', false);
        const context = canvas.getContext('2d');
        context.drawImage(player, 0, 0, width, height);
        console.log(image.width, image.height);
        context.drawImage(image, 0, 0, image.width, image.height);
        player.srcObject.getVideoTracks().forEach(track => track.stop());

        // Saving the current image info
        new ImgToSend('', canvas.toDataURL('image/png'), 1);
        Object.assign(currentImg, new ImgToSend('', canvas.toDataURL('image/png'), 1));
        state.value = 0;
    } else {
        streamVideo();
    }
}

function placeImage(e) {
    resetElements('inline', 'none', 'none', false);
    player.srcObject.getVideoTracks().forEach(track => track.stop());
    if (fileInput.files[0] && (/\.(jpe?g|png|gif)$/i.test(fileInput.files[0].name))) {
        // Saving the current image info
        converTobinary(fileInput.files[0], reader => {
            preview.src = reader.result;

            // saving the current image 
            if (reader.result.length) {
                Object.assign(currentImg, new ImgToSend(
                    fileInput.files[0].name,
                    reader.result,
                    2
                ));
            }
        })
        state.value = 0;
    } else {
        saveImg.disabled = true;
        alert('invalide file');
    }
}

function converTobinary(img, cb) {
    var reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = function() {
        cb(reader);
    }
}

function streamVideo() {
    resetElements('none', 'inline', 'none', true);

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            /* Link to the video src */
            player.srcObject = stream;
            /* Play the video */
            player.play();
        })
        .catch(e => console.log('Error:' + e));
    state.value = 1;
}

/*
	Send Image Data to the database;
 */
function displayImage() {

    let options = {
        method: 'POST',
        body: JSON.stringify(currentImg),
        header: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    }

    api('/gallery/meta-data', options, (err, userImgs) => {
        if (err) {
            alert('Ooops please retry again')
            console.log(err);
        } else {
            userImgs.data = currentImg.data;
            renderThumbmail(userImgs);
        }
    });

    /* TODO lock the save button when the image is save */
}


function updateImage() { // here I have to insert the new filter metadata
    const imgToUpdate = new ImgToSend('', preview.src, 1);
    imgToUpdate.id = preview.id;
    let options = {
        method: 'PUT',
        body: JSON.stringify(imgToUpdate),

        header: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    }

    api('/gallery/update', options, (err, data) => {
        if (err) {
            alert('Ooops please retry again')
            console.log(err);
        } else {
            console.log(data);
        }
    });
}

//Events

player.addEventListener('canplay', function(e) {
    if (!streaming) {
        var videoRatio = player.videoWidth / player.videoHeight;
        // The width and height of the video element
        width = player.offsetWidth;
        height = player.offsetHeight;
        // The ratio of the element's width to its height
        var elementRatio = width / height;
        // If the video element is short and wide
        if (elementRatio > videoRatio) width = height * videoRatio;
        // It must be tall and thin, or exactly equal to the original ratio
        else height = width / videoRatio;

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        canvas.width = width;
        canvas.height = height;

        streaming = true;
    }
}, false)



/* filter event */
photoFilter.addEventListener('change', function(e) {
    /* Set filter to chosen option */
    if (e.target.className === 'fitler') {
        filter = e.target.value;
        player.style.filter = filter;
        e.preventDefault();
    }
})

streamVideo();
captureButton.addEventListener('click', shoot);


///-------------------------test

layer.addEventListener('click', e => {
    image = e.target;

});

fileInput.addEventListener('change', (e) => placeImage(e));
saveImg ? saveImg.addEventListener('click', displayImage) : updateImg.addEventListener('click', updateImage)

// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL