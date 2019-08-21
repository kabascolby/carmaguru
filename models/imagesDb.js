const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'images.json'
);


function getImages(cb) {
    fs.readFile(p, (err, images) => {
        if (err) {
            console.log('error readding file or empty DB', err);
            cb({});
        } else {
            cb(JSON.parse(images));
        }
    })

}

module.exports = class Images {
    constructor(id, image, create, username, id) {
        this.id = id;
        this.data = image;
        this.createDate = create;
        this.username = username;
    }

    save() {
        getImages(imgsDb) {
            imgsDb[this.id] = this;
            console.log(imgsDb);
            fs.writeFile(p, JSON.stringify(imgsDb), (err) => {
                if (err) console.log('Error writting file.', err);
            });
        }
    }

    fetchAll(cb) {
        getImages(cb);
    }
}