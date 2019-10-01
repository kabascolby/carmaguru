const comments = document.getElementById('add-comment');
const mainImg = document.getElementById('current');
let previousMainId = mainImg.dataset.id;
const commentList = document.getElementById('list-comments');

import {
    api
} from './utils.js';

function addComments(btn) {
    const comment = btn.parentNode.querySelector('[name=comment-data]').value;
    const userId = btn.dataset.id;
    const mainImgId = mainImg.dataset.id;


    if (comment && comment.length > 1 && comment.length < 250) {
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                userId: userId,
                imgId: mainImgId,
                comment: comment
            }),
        }

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


document.getElementById('main-box').addEventListener('click', (e) => {



    if (e.target.className == 'thumbnail' && previousMainId !== e.target.id) {
        previousMainId = e.target.id;
        refrechComments(e.target.id);
    }

}, false)


function refrechComments(imgId) {
    let options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }

    api('/images/comments?fetch=' + imgId, options, (err, result) => {
        if (err) {
            alert(err);
        }

        if (!result.length) {
            commentList.innerHTML = '';
            renderComment('no-comment', '', 'Be the first to write something');
        } else {
            commentList.innerHTML = '';
            for (let i of result) {
                renderComment(i.id, i.name, i.message);
            }
        }
    })
}

function renderComment(id, name, comment) {
    commentList.insertAdjacentHTML('afterbegin',
        `<div class="comment_body">
			<p id=${id}><span class="user">${name}:</span>${comment}</p>
		</div>`
    );
}

comments !== undefined && comments.addEventListener('click', (e) => addComments(e.target));