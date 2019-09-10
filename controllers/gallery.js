const ImageClass = require('../models/imagesDb');
const fs = require('fs');
const path = require('path');


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


exports.getGallery = (req, res, next) => {
    ImageClass.fetchBinary('brianbixby0@gmail.com', userImgs => {
        res.render('gallery', {
            pageTitle: 'Gallery Studio',
            pagePath: '/gallery',
            imgs: userImgs,
            edit: undefined,
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

                const imagesDb = new ImageClass(username, id, fname, p, creation);
                imagesDb.save(() => {
                    /*
						I'm deleting the image file here
						cause I dont need it when I'll we use DB  it's will be
						not included in the querry
					*/

                    res.send({
                        username,
                        id,
                        fname,
                        creation
                    });
                })
            })
            .catch(err => res.send(Error(err)))
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
        ImageClass.fetchBinary('brianbixby0@gmail.com', userImgs => {
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
        ImageClass.deleteImg(buff.username, buff.id, dataImg => {
            res.send({});
        })
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


exports.postImageEdit = (req, res, next) => {
    const imgId = req.body.imgId;
    ImageClass.fetchBinary('brianbixby0@gmail.com', userImgs => {
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