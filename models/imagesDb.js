const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'images.json'
);


function getImages() {
    return new Promise((resolve, reject) => {
        var stream = fs.createReadStream(p);
        var imgsDb = [];

        stream.on('error', function() {
            resolve({});
        })

        stream.on('data', function(chunk) {
            imgsDb.push(chunk)
        })

        stream.on('end', () => {
            resolve(JSON.parse(Buffer.concat(imgsDb)));
        })
    });
}

function converToB64(image) {
    return new Promise((resolve, reject) => {
        fs.readFile(image.path, { encoding: 'base64' }, (err, binary) => {
            if (err)
                reject(err);
            image.path = binary;
            resolve(image);
        });
    })
}

function getConvert64(path) {
    return converToB64(path);
}

module.exports = class Images {
    constructor(username, id, filename, imgPath, createDate) {
        this.username = username;
        this.id = id;
        this.fname = filename;
        this.path = imgPath;
        this.createDate = createDate;
    }

    save(cb) {
        getImages()
            .then(imgsDb => {
                imgsDb[this.username] = imgsDb[this.username] || [];
                imgsDb[this.username].unshift({
                    id: this.id,
                    fname: this.fname,
                    path: this.path,
                    createDate: this.createDate
                });

                fs.writeFile(p, JSON.stringify(imgsDb, null, '\t'), (err) => {
                    if (err) {
                        console.log('Error writting file.', err);
                    }
                    cb();
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    static fetchByUser(username, cb) {
        getImages()
            .then(imgsDb => {
                cb(imgsDb[username]);
            })
            .catch(e => console.log(e));
    }

    static fetchBinary(username, cb) {
        this.fetchByUser(username, imgsDb => {
            let imgsPromises = (imgsDb || []).map(objImg => getConvert64(objImg));
            Promise.all(imgsPromises)
                .then(imgs => cb(imgs))
                .catch(e => cb([]));
        });
    }

    static fetchAll(cb) {
        getImages()
            .then(imgsDb => {
                cb(imgsDb);
            })
            .catch(e => console.log(e));
    };

    // TODO remove duplicate code

    static deleteImg(username, imgId, cb) {
        this.fetchAll(imgsDb => {
            imgsDb[username].forEach((el, idx, tab) => {
                if (el.id === imgId) {
                    fs.unlinkSync(el.path);
                    tab.splice(idx, 1);
                    return;
                }

            });
            fs.writeFile(p, JSON.stringify(imgsDb, null, '\t'), (err) => {
                if (err) {
                    console.log('Error writting file.', err);
                }
                cb('sucess')
                    // this.fetchBinary(username, data => {
                    //     cb(data);
                    // })
            });
        });
    }
}

/*
	TODO
	comment table implementation
	comment id;
	user id;
	comment date;
	comment description;
 */

/*
	TODO
	likes table implementation
	likes id;
	user id;
	likes date;
	likes description;
 */