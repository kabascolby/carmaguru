const captureButton = document.getElementById('capture');
const fileInput = document.getElementById('file-input');
var state = undefined;
const player = document.getElementById('player');
const preview = document.querySelector('.capture>img');
const canvas = document.getElementById('canvas');
const saveImg = document.getElementById('save-img');
var currentImg;

class ImgToSend {
    constructor(name, data, status) {
        this.name = name;
        this.data = data;
        this.status = status;
    }
}

function shoot() {
    if (state == 1) {
        resetElement('none', 'none', 'inline', false);
        const context = canvas.getContext('2d');
        context.drawImage(player, 0, 0, canvas.width, canvas.height);
        player.srcObject.getVideoTracks().forEach(track => track.stop());


        // Saving the current image info
        currentImg = new ImgToSend(
            '',
            canvas.toDataURL(),
            1
        );
        state = 0;
    } else {
        streamVideo();
    }
}

function resetElement(prev, play, canv, sav) {
    preview.style.display = prev;
    player.style.display = play;
    canvas.style.display = canv;
    saveImg.disabled = sav;
}

function placeImage(e) {
    resetElement('inline', 'none', 'none', false);
    player.srcObject.getVideoTracks().forEach(track => track.stop());
    if (fileInput.files[0] && (/\.(jpe?g|png|gif)$/i.test(fileInput.files[0].name))) {
        // Saving the current image info
        converTobinary(fileInput.files[0], reader => {
            preview.src = reader.result;

            // saving the current image 
            if (reader.result.length) {
                currentImg = new ImgToSend(
                    fileInput.files[0].name,
                    reader.result,
                    2
                );
            }
        })
        state = 0;
    } else {
        saveImg.disabled = true;
        alert('invalide file');
        // return;
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
    preview.style.display = 'none';
    player.style.display = "inline";
    canvas.style.display = 'none';
    const constraints = {
        video: true,
    };


    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            player.srcObject = stream;
        });
    state = 1;
}

function sendImage() {
    var response;
    // saveImg.disabled = true; //uncomment later

    if (Object.keys(currentImg).length) {
        response = JSON.stringify(currentImg);
    } else {
        response = '';
    }

    fetch('/gallery', {
            method: 'POST',
            body: response,
            header: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then(res => res.json())
        .then(userImgs => placeThumbmail(userImgs))
        .catch(err => console.log(err))
}
// 

function placeThumbmail(imgTab) {
    let thumb = document.querySelector('.thumbnail-grid');
    thumb.innerHTML = "";
    thumb.insertAdjacentHTML('beforeend', imgTab.map(img => `<div><svg class="close">
	<circle cx="12" cy="12" r="11" stroke="black" stroke-width="2" fill="white" />
	<path stroke="black" stroke-width="2" fill="none" d="M6.25,6.25,17.75,17.75" />
	<path stroke="black" stroke-width="2" fill="none" d="M6.25,17.75,17.75,6.25" />
</svg><img src=data:image/png;base64,${img.path}></div>`).join(''));
}

document.onload = streamVideo();
captureButton.addEventListener('click', shoot);
fileInput.addEventListener('change', (e) => placeImage(e));

saveImg.addEventListener('click', sendImage)


// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL