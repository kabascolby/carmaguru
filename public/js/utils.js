const player = document.getElementById('player');
const preview = document.querySelector('.capture>img');
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
				<img src="${imgObj.data}" class="thumbnail" id="${imgObj.id}" alt=${imgObj.fname}>
			</div>`
        );
    }
}

export function resetElements(prev, play, canv, status) {
    preview.style.display = prev;
    player.style.display = play;
    canvas.style.display = canv;
    saveImg ? saveImg.disabled = status : 0;
}

export class ImgToSend {
    constructor(name, data, status) {
        this.userId = 'd3a9a91e-d4ed-11e9-85d5-0242ac110002';
        this.name = name;
        this.data = data;
        this.status = status;
    }
}