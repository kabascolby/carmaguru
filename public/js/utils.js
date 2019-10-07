const video = document.getElementById('video');
const mainImage = document.querySelector('.main_image');
const canvas = document.getElementById('canvas');
const saveImg = document.getElementById('save-img');
const updateImg = document.getElementById('update-img');
let thumb = document.getElementById('img-grid');

export const state = { value: undefined };

export const currentImg = {};

export function api(route, options, callBack) {
    fetch(route, options)
        .then(result => {
            if (result.ok) {
                return result.json();
            } else {
                // console.log(result.text())
                throw result.text();
            }
        })
        .then(resJSON => callBack(null, resJSON))
        .catch((err) => {
            callBack(err);
        });
}

export function renderThumbmail(imgObj) {
    /*
    	it's better to check all the keys but nevermind
    */
    if (imgObj.hasOwnProperty('data')) {
        thumb.insertAdjacentHTML('afterbegin',
            `<div>
				<img src="https://image.flaticon.com/icons/svg/149/149147.svg" title="delete" class="del_img">
				<img src="${imgObj.data}" class="thumbnail" id="${imgObj.id}" alt=${imgObj.fname} style="filter: ${imgObj.filter}">
			</div>`
        );
    }
}

export function resetElements(imgState, videoState, status) {
    mainImage.style.display = imgState;
    video.style.display = videoState;
    saveImg.disabled = status;
}

export class ImgToSend {
    constructor(name, data, status) {
        this.name = name;
        this.data = data;
        this.status = status;
    }
}

export const LayerElements = {
    balls: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
    },

    cat: {
        width: 350,
        height: 350,
        top: 100,
        left: 150,
    },
    flower: {
        width: 350,
        height: 350,
        top: 0,
        left: 0,
    },
    border: {
        width: 450,
        height: 450,
        top: 0,
        left: 0,
    },
};


/* ----------------------Media Stream -------------------------------------*/
export function streamVideo() {
    resetElements('none', 'initial');
    state.value = 1;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            /* Link to the video src */
            video.srcObject = stream;
            /* Play the video */
            video.play();
        })
        .catch(e => console.log('Error:' + e));
}
/* ----------------------------------------------------------------------- */