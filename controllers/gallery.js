const ImageClass = require('../models/imagesDb');
const fs = require('fs');
const path = require('path');
exports.getGallery = (req, res, next) => {
    ImageClass.fetchBinary('brianbixby0@gmail.com', userImgs => {
        res.render('gallery', {
            pageTitle: 'Gallery Studio',
            pagePath: '/gallery',
            imgs: userImgs
        });
    })
};

exports.postImages = (req, res, next) => {
    // req.setTimeout(0);
    /*
    	TODO: return the username form the cookies 
     */
    var buff = [];
    req.on('data', (chunk) => {
        buff.push(chunk);
    })

    req.on('end', () => {

        buff = Buffer.concat(buff).toString();
        if (buff.length) {
            const id = create_UUID();
            const username = 'brianbixby0@gmail.com';
            const creation = Date.now();
            const p = path.join(
                path.dirname(process.mainModule.filename),
                'data',
                'img',
                `img${Math.random(4).toString()}.png`
            );

            createImg(buff, p)
                .then(response => {
                    const fname = response.status === 1 ? //save the filename later
                        username + Math.random(4).toString() :
                        response.name;
                    // username, id, imgPath, createDate
                    const imagesDb = new ImageClass(username, id, fname, p, creation);
                    imagesDb.save(() => {
                        ImageClass.fetchBinary(username, data => {
                            res.send(data);
                        })
                    })
                })
                .catch(err => res.send(Error(err)))
        } else {
            res.send('Invalide Image');
        }
    });
}

function createImg(imgObj, path) {
    let buff = JSON.parse(imgObj);
    return new Promise((resolve, reject) => {
        buff.data = (buff.data).split(';base64,').pop()
        fs.writeFile(path, buff.data, { encoding: 'base64' }, (err) => {
            if (err) {
                reject(Error(err));
            }
            delete buff.data;
            console.log('image created');
            resolve(buff)
        });
    });
}

// create unique identifer of an image
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}