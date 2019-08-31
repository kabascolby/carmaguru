//ToDo grab the userName
import { api } from './fetch.js';

//just for testing purpose this function has to be  in utility

function placeThumbmail(imgTab) {
    let thumb = document.querySelector('.thumbnail-grid');
    thumb.innerHTML = "";
    thumb.insertAdjacentHTML('beforeend', imgTab.map(img => `
		<div>
			<img src="https://image.flaticon.com/icons/svg/149/149147.svg" title="delete" class="del_img">
			<img src=data:image/png;base64,${img.path} id=${img.id} alt={img.fname}>
		</div>`).join(''));
}

function deleteImg(e) {
    const img = e.nextElementSibling;
    const options = {
        method: 'DELETE',

        body: JSON.stringify({
            username: 'brianbixby0@gmail.com',
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
        } else {
            placeThumbmail(result);
        }
    })
}


document.getElementById('img-grid').addEventListener('click', (e) => {
    if (e.target.className == 'del_img') {
        e.target.addEventListener('click', deleteImg(e.target))
    }
}, false)