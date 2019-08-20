const captureButton = document.getElementById('capture');
const fileInput = document.getElementById('file-input');
var state = undefined;
const player = document.getElementById('player');
const preview = document.querySelector('.capture>img');
const canvas = document.getElementById('canvas');


function shoot() {
    if (state == 1) {
        preview.style.display = 'none';
        player.style.display = "none";
        canvas.style.display = 'inline';
        const context = canvas.getContext('2d');
        context.drawImage(player, 0, 0, canvas.width, canvas.height);
        player.srcObject.getVideoTracks().forEach(track => track.stop());
        state = 0;
    } else {
        streamVideo();
    }

}

function placeImage(file) {
    canvas.style.display = 'none';
    player.style.display = 'none';
    preview.style.display = 'inline';
    var reader = new FileReader();
    player.srcObject.getVideoTracks().forEach(track => track.stop());
    reader.addEventListener("load", () => {
        preview.src = reader.result;
    }, false);

    if (fileInput.files[0] && (/\.(jpe?g|png|gif)$/i.test(fileInput.files[0].name))) {
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        alert('invalide file')
    }
}


function streamVideo() {
    preview.style.display = 'none';
    player.style.display = "inline";
    canvas.style.display = 'none';
    const constraints = {
        video: {
            video: true,
            width: { max: 1280 },
            height: { max: 720 }
        }
    };
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            player.srcObject = stream;
        });
    state = 1;
}

document.onload = streamVideo();
captureButton.addEventListener('click', shoot);
fileInput.addEventListener('change', (e) => placeImage(e.target.files));