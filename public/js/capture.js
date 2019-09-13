import {
    api,
    renderThumbmail,
    resetElements,
    state,
    ImgToSend,
    currentImg
} from './utils.js';

const captureButton = document.getElementById('capture');
const fileInput = document.getElementById('file-input');

const player = document.getElementById('player');
const preview = document.querySelector('.capture>img');
const canvas = document.getElementById('canvas');
const saveImg = document.getElementById('save-img');
const updateImg = document.getElementById('update-img');
const thumb = document.getElementById('img-grid');

function shoot() {
    if (state.value == 1) {
        resetElements('none', 'none', 'inline', false);
        const context = canvas.getContext('2d');
        context.drawImage(player, 0, 0, canvas.width, canvas.height);
        player.srcObject.getVideoTracks().forEach(track => track.stop());

        // Saving the current image info
        new ImgToSend('', canvas.toDataURL(), 1);
        Object.assign(currentImg, new ImgToSend('', canvas.toDataURL(), 1));
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

    const constraints = {
        video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            player.srcObject = stream;
        });
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
    let options = {
        method: 'PUT',
        body: JSON.stringify({
            id: preview.id,
            userId: tempId,
            data: preview.src,
        }),

        header: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    }

    api('/gallery/update', options, (err, data) => {
        if (err) {
            alert('Ooops please retry again')
            console.log(err);
        }
    });
}

window.onload = function() {
    if (preview.getAttribute('src') !== '') {
        resetElements('inline', 'none', 'none', false);
    } else {
        streamVideo();
    }
}
captureButton.addEventListener('click', shoot);
fileInput.addEventListener('change', (e) => placeImage(e));
saveImg ? saveImg.addEventListener('click', displayImage) : updateImg.addEventListener('click', updateImage)

// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
// "647b1c57-d4af-11e9-853a-0242ac110002"