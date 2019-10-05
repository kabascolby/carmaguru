const comments = document.getElementById('add-comment');
const mainImg = document.getElementById('current');
let previousMainId = mainImg.dataset.id;
const commentList = document.getElementById('list-comments');

import {
    api
} from './utils.js';

function addComments(btn) {
    const comment = btn.parentNode.querySelector('[name=comment-data]').value;
    const userId = btn.dataset.uid;
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
            })
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


/*----------------------- like btn implementation--------------------------------*/
likeBtn.addEventListener('click', e => toggle(e));
/* toggle like btn color on click */

function toggle(e) {
    e.preventDefault();
    var btn = e.target;
    // Getting loggued UserId from comments field
    const userId = comments.dataset.id;
    const mainImgId = mainImg.dataset.id;
    const owner = btn.dataset.id;
    // console.log(userId, mainImgId);
    if (btn.classList.contains("far")) {
        /* send action server Side */
        // post to server
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                owner,
                userId,
                imgId: mainImgId,
            })
        }

        api('/images/likes', options, (err, result) => {
            if (err) {
                console.log(err)
                alert('Oups Error Server try later');
            } else if (result.btnId) {
                btn.dataset.btn = result.btnId;
                btn.classList.remove('far');
                btn.classList.add('fas');
            } else {
                alert(result);
            }
        })
    } else {

        const id = btn.dataset.btn;
        let options = {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                imgId: mainImgId,
            })
        }

        api('/images/likes', options, (err, result) => {
            if (err) {
                alert('Oups Error Server try later');
            } else if (result == 'SUCCESS') {
                btn.classList.remove('fas');
                btn.classList.add('far');
            } else {
                alert(result);
            }
        });
    }
}