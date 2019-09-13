const fs = require('fs');
const Stream = require('stream');

const ImageClass = require('../models/imagesDb');
const path = require('path');
const tempId = 'd3a9a91e-d4ed-11e9-85d5-0242ac110002';

// create unique identifer of an image


exports.getGallery = (req, res, next) => {
    ImageClass.fetchBinary(tempId, userImgs => {
        res.render('gallery', {
            pageTitle: 'Gallery Studio',
            pagePath: '/gallery',
            imgs: userImgs,
            edit: undefined,
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
            `img${Math.random(4).toString()}.png`
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
                        res.send({});
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
        ImageClass.fetchBinary(tempId, userImgs => {
            let imgIdx = userImgs.findIndex(img => img.id === buff.id);
            /*
            	TODO: We have to update the file to the database after write to the file
            */
            if (imgIdx) {
                let imgInfo = {...userImgs[imgIdx] }
                res.send(imgInfo);
            } else {
                res.redirect('/404');
            }
        });

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
        ImageClass.deleteImg(buff.userId, buff.id, dataImg => {
            res.send({});
        })
    });
}


exports.postImageEdit = (req, res, next) => {
    const imgId = req.body.imgId;
    ImageClass.fetchBinary(tempId, userImgs => {
        let img = userImgs.find(img => img.id === imgId);
        // let toEdit = `<img src=data:image/png;base64,${img.path} id=${img.id} class="thumbnail" alt={img.fname}>`;
        if (img) {
            res.render('gallery', {
                pageTitle: 'Gallery Edit',
                pagePath: '/gallery',
                imgs: userImgs,
                edit: img
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