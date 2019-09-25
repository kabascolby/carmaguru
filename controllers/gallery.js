const fs = require('fs');
const Stream = require('stream');

const ImageClass = require('../models/imagesDb');
const path = require('path');
const create_UUID = require('../utility/util').create_UUID;
// const tempId = 'd3a9a91e-d4ed-11e9-85d5-0242ac110002';

// create unique identifer of an image


exports.getGallery = (req, res, next) => {
    ImageClass.fetchBinary(req.session.userId, userImgs => {
        res.render('gallery', {
            pageTitle: 'Gallery Studio',
            pagePath: '/gallery',
            imgs: userImgs,
            edit: undefined,
            isAuth: req.session.isLoggedIn
        });
    })
};

exports.postImages = (req, res, next) => {

    /*
	TODO: return the username form the cookies 
	*/

    var buff = [];

    req.on('data', (chunk) => {
        buff.push(chunk);
    })

    req.on('end', () => {

        var imgPath = path.join(
            path.dirname(process.mainModule.filename),
            'data',
            'img',
            `img${Math.random(4).toString()}`.replace('0.', '') + '.png'
        );

        buff = Buffer.concat(buff).toString();
        buff = JSON.parse(buff);
        buff.data = buff.data.split(';base64,').pop();

        createImg(buff.data, imgPath, (data => {
            delete buff.data;
            if (data === null) {
                console.log('error----------------->')
                return res.send(null);
            }

            const imgInfos = {
                imgId: create_UUID(),
                userId: buff.userId,
                modification: Date.now(),
                path: imgPath,
                fname: buff.status === 1 ? //save the filename later
                    'img' + (Math.random().toString()).replace('0.', '') + '.png' : buff.name
            }

            const imagesDb = new ImageClass(imgInfos);
            imagesDb.save()
                .then((data, fieldData) => {
                    if (!data[0].warningStatus) {
                        res.send({
                            id: imgInfos.imgId,
                            fname: imgInfos.fname
                        });
                    } else {
                        res.send(null);
                    }
                })
                .catch(e => console.log(e));
        }));
    });
}

exports.putImageUpdate = (req, res, next) => {
    /*
    	Here the logic is to update the images metadata and the filter 
    */
    var buff = [];
    req.on('data', (chunk) => {
        buff.push(chunk);
    })

    req.on('end', () => {
        buff = Buffer.concat(buff).toString();
        buff = JSON.parse(buff);
        // console.log(buff.id, buff.userId);
        Promise.all([ImageClass.fetchImage(buff.userId, buff.id), ImageClass.updateImg(buff.userId, buff.id)])
            .then(([
                [
                    [{ path }]
                ], fieldData
            ]) => { //crazy destructuring
                createImg(buff.data.split(';base64,').pop(), path, response => {
                    if (!response) res.send(res);
                    res.send({});
                })
            })
            .catch(e => console.error(e));
    });
}

exports.deleteImage = (req, res, next) => {

    var buff = [];
    req.on('data', (chunk) => {
        buff.push(chunk);
    })

    req.on('end', () => {
        buff = Buffer.concat(buff).toString();
        buff = JSON.parse(buff);
        ImageClass.deleteImg(buff.userId, buff.id, delPromises => {
            Promise.all(delPromises)
                .then(([data, fieldData]) => {
                    // console.log('--------------data----------->\n', data); /* It's possible to return the path here */
                    res.send({});
                })
                .catch(e => console.error(new Error('Failed to delete in the DataBase', e)));
        })
    });
}


exports.postImageEdit = (req, res, next) => {
    const imgId = req.body.imgId;
    /* 
    	Giving the userId
     */
    ImageClass.fetchBinary(req.session.userId, userImgs => {
        let img = userImgs.find(img => img.id === imgId);
        // let toEdit = `<img src=data:image/png;base64,${img.path} id=${img.id} class="thumbnail" alt={img.fname}>`;
        if (img) {
            res.render('gallery', {
                pageTitle: 'Update Images',
                pagePath: '/gallery',
                imgs: userImgs,
                edit: img,
                isAuth: req.session.isLoggedIn
            });
        } else {
            res.redirect('/404');
        }
    })
}


function createImg(imgB64, p, cb) {
    fs.writeFile(p, imgB64, { encoding: 'base64' }, (err) => {
        if (err) {
            cb(null);
        }
        cb('OK');
        console.log('image created');
    });
}