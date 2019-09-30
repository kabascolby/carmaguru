const comments = document.getElementById('add-comment');
const mainImg = document.getElementById('current');

import {
    api
} from './utils.js';

function addComments(btn) {
    const comment = btn.parentNode.querySelector('[name=comment-data]').value;
    const userId = btn.dataset.id;
    const imgId = mainImg.dataset.id;

    var data = new FormData();
    data.append("json", JSON.stringify({
        userId: userId,
        imgId: imgId,
        comment: comment
    }));

    let options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            userId: userId,
            imgId: imgId,
            comment: comment
        }),
    }

    if (comment && comment.length > 1 && comment.length < 250) {
        api('/images/comments', options, (err, result) => {
            if (err) {
                console.log(err)
                alert('Oups Error Server try later');
            }

            /*
            	Making sure I'm gonna have the firstName the LastName and the ID
            	In case I got an empty JSON or a case is Missing
             */

            if (Object.keys(result).length > 2) {
                const id = result.id;
                const name = result.firstName + ' ' + result.lastName;
                renderComment(id, name, comment);
                btn.parentNode.querySelector('[name=comment-data]').value = '';
            } else {
                alert('Oups Error Server try later');
            }
        })
    }
}

function refrechComments(e) {
    console.log('here');

}

function renderComment(id, name, comment) {
    const commentList = document.getElementById('list-comments');
    commentList.insertAdjacentHTML('afterbegin',
        `<div class="comment_body">
			<p id=${id}><span class="user">${name}:</span>${comment}</p>
		</div>`
    );
}

comments !== undefined && comments.addEventListener('click', (e) => addComments(e.target));
mainImg.value.addEventListener('change', e => refrechComments(e))