const fs = require('fs');
const Stream = require('stream');
const fsPromises = fs.promises;

const ImageClass = require('../models/imagesDb');
const path = require('path');
const create_UUID = require('../utility/util').create_UUID;

// create unique identifer of an image


exports.getGallery = (req, res, next) => {
    ImageClass.fetchBinary(req.session.userId, userImgs => {
        res.render('gallery', {
            pageTitle: 'Gallery Studio',
            pagePath: '/gallery',
            imgs: userImgs,
            edit: undefined,
        });
    })
};

exports.postImages = (req, res, next) => {

    let data = req.body.data;
    const filter = req.body.filter;
    const name = 'img' + (Math.random().toString()).replace('0.', '') + '.png';

    var imgPath = path.join(
        path.dirname(process.mainModule.filename),
        'data',
        'img',
        name
    );

    data = data.split(';base64,').pop();



    createImg(data, imgPath, (data => {
        if (data === null) {
            return res.send(null);
        }

        const imgInfos = {
            imgId: create_UUID(),
            userId: req.session.userId,
            modification: Date.now(),
            path: imgPath,
            fname: name,
            filter
        }
        const imagesDb = new ImageClass(imgInfos);
        imagesDb.save()
            .then(([data]) => {
                if (!data.warningStatus) {
                    res.json({
                        id: imgInfos.imgId,
                        fname: imgInfos.fname
                    });
                } else {
                    res.json('Server error try later');
                }
            })
            .catch(e => console.log(e));
    }));








};

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
        // console.log(buff.id, req.session.userId);
        Promise.all([ImageClass.fetchImage(req.session.userId, buff.id), ImageClass.updateImg(req.session.userId, buff.id)])
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
};

exports.deleteImage = (req, res, next) => {

    const id = req.body.id;
    ImageClass.deleteImg(req.session.userId, id, delPromises => {
        Promise.all(delPromises)
            .then(([data, fieldData]) => {
                res.send({});
            })
            .catch(e => console.error(new Error('Failed to delete in the DataBase', e)));
    })

};


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
            });
        } else {
            res.redirect('/404');
        }
    })
};


function createImg(imgB64, p, cb) {
    var dir = path.join(
        path.dirname(process.mainModule.filename),
        'data',
        'img',
    );
    /* Using experimental fs promises */
    fsPromises.access(dir, fs.constants.R_OK | fs.constants.W_OK)
        .then(() => {

            fs.writeFile(p, imgB64, { encoding: 'base64' }, (err) => {
                if (err) {
                    cb(null);
                }
                cb('OK');
                console.log('image created');
            });
        })
        .catch(() => {
            console.error('cannot access')
            fs.mkdirSync(dir, { recursive: true });
        });
}