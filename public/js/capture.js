const captureButton = document.getElementById('capture');
const fileInput = document.getElementById('file-input');
var state = undefined;
const player = document.getElementById('player');
const preview = document.querySelector('.capture>img');
const canvas = document.getElementById('canvas');
const saveImages = document.getElementById('save-img');


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


//crete unique identifer of an image
// function create_UUID(){
//     var dt = new Date().getTime();
//     var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = (dt + Math.random()*16)%16 | 0;
//         dt = Math.floor(dt/16);
//         return (c=='x' ? r :(r&0x3|0x8)).toString(16);
//     });
//     return uuid;
// }

function sendImage() {
    // let img = new WeakMap();
    // var data = JSON.stringify({image: base64});
    // data = {
    //     img: canvas.toDataURL(fileInput.files[0]
    // };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/galery', true);
    xhr.setRequestHeader('Content-Type', 'application/upload')
    console.log(fileInput.files[0])
    xhr.send(JSON.stringify(fileInput.files[0]));
}


document.onload = streamVideo();
captureButton.addEventListener('click', shoot);
fileInput.addEventListener('change', (e) => placeImage(e.target.files));

saveImages.addEventListener('click', sendImage)

// preview the imgage
// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL