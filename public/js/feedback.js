const comments = document.getElementById('add-comment');

import {
    api
} from './utils.js';

function addComments(btn) {
    const comment = btn.parentNode.querySelector('[name=comment-data]').value;
    const userId = btn.dataset.id;
    const imgId = document.getElementById('current').dataset.id;

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
        rendercomment(comment);
        api('/images/comments', options, (err, result) => {
            if (err) {
                console.log(err)
                alert('Oups Error Server try later');
            }
            console.log(result);
            btn.parentNode.querySelector('[name=comment-data]').value = '';
        })
    }
}

function rendercomment(comment) {
    const commentList = document.getElementById('list-comments');
    commentList.insertAdjacentHTML('afterbegin',
        `<div class="comment_body">
			<p>${comment}</p>
		</div>`
    );
}

comments !== undefined && comments.addEventListener('click', (e) => addComments(e.target));