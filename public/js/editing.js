//ToDo grab the userName
import {
    api,
    renderThumbmail,
    resetElements,
    state,
    ImgToSend,
    currentImg
} from './utils.js';
const uid = 'd3a9a91e-d4ed-11e9-85d5-0242ac110002';

const preview = document.querySelector('.capture>img');

var activeTbn = null; //active thumbnail

// work on here--------------------------------------------
function deleteImg(e) {
    const img = e.nextElementSibling;
    const options = {
        method: 'DELETE',

        body: JSON.stringify({
            userId: uid, //Todo grab username
            id: img.id
        }),

        header: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    }

    api('/gallery', options, (err, result) => {
        if (err) {
            console.log(err);
        }
    })
}

/* TODO
	replace the image in the database
	replace the image edited in the tumbnail;
 */

function editImage(img) {
    highlightActive(img);
    resetElements('inline', 'none', 'none', false);
    if (state.value)
        player.srcObject.getVideoTracks().forEach(track => track.stop());
    preview.src = img.src;
    if (img.src.length) {
        Object.assign(currentImg, new ImgToSend(img.name, img.src, 1));
    }
    state.value = 0;
}


function highlightActive(e) {
    if (activeTbn) {
        activeTbn.classList.remove('highlight');
    }
    activeTbn = e.closest('div'); //another way:  activeTbn = e.target.offsetParent;
    activeTbn.classList.add('highlight');
}

document.getElementById('img-grid').addEventListener('click', (e) => {
    if (e.target.className == 'del_img') {
        e.target.closest('div').remove()
        e.target.addEventListener('click', deleteImg(e.target))
    }
    if (e.target.className == 'thumbnail') {
        editImage(e.target);
    }
}, false)

// https://javascript.info/event-delegation this is the path