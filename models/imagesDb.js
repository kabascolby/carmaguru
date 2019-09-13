const fs = require('fs');
const db = require('../utility/database');

// const p = path.join(
//     path.dirname(process.mainModule.filename),
//     'data',
//     'images.json'
// );


module.exports = class Images {
    constructor(imgInfos) {
        this.username = imgInfos.username;
        this.uId = imgInfos.userId;
        this.fname = imgInfos.fname;
        this.path = imgInfos.path;
        this.modification = imgInfos.modification;
    }

    save() {
        const sql = `INSERT INTO images
			(id, user_id, fname, path, modif_date)
			VALUES(
				UUID(),
				'${this.uId}',
				'${this.fname}',
				'${this.path}',
				'${this.modification}'
			)
		`
        return db.execute(sql);

    }

    static fetchByUser(userId) {
        const sql = `SELECT *
			FROM images
			WHERE user_id = '${userId}'
		`
        return db.execute(sql);
    }

    static fetchBinary(userId, cb) {
            this.fetchByUser(userId)
                .then(([userImgs, fieldData]) => {
                    let imgsPromises = [];

                    for (var imgProm of userImgs) {
                        imgsPromises.push(getConvert64(imgProm))
                    }

                    Promise.all(imgsPromises)
                        .then(imgs => cb(imgs))
                        .catch(e => cb([]));
                })
                .catch(e => console.log(e));
        }
        // work on here----------------------------------------------
    static deleteImg(uId, imgId, cb) {
        let sql = `SELECT path FROM images
			WHERE user_id = '${uId}' AND id = '${imgId}'`
        db.execute(sql)
            .then(([data, fieldData]) => {
                fs.unlinkSync(data[0].path);
                let sql = `DELETE FROM images WHERE user_id = '${uId}' AND id = '${imgId}`
                db.execute(sql)
                    .catch(e => console.error(new Error('Failed to delete in the DataBase', e)));
            }).catch(e => console.log(e));
    }
}

function getConvert64(img) {
    return converToB64(img);
}

function converToB64(image) {
    return new Promise((resolve, reject) => {
        fs.readFile(image.path, { encoding: 'base64' }, (err, binary) => {
            if (err) {
                resolve('');
                console.error(new Error('Invalide Path', err));
            }
            image.path = binary;
            resolve(image);
        });
    })
}


// function getImages(p) {
//     return new Promise((resolve, reject) => {
//         var stream = fs.createReadStream(p);
//         var imgsDb = [];

//         stream.on('error', function() {
//             resolve({});
//         })

//         stream.on('data', function(chunk) {
//             imgsDb.push(chunk)
//         })

//         stream.on('end', () => {
//             resolve(JSON.parse(Buffer.concat(imgsDb)));
//         })
//     });
// }


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