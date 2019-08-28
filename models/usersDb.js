const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'users.json'
);

var getUsersData = cb => {
    fs.readFile(p, (err, data) => {
        if (err) {
            console.log('empty database or Error readding file', err);
            cb({});
        } else
            cb(JSON.parse(data || {}));
    });
}

module.exports = class User {
    constructor(userData) {
        this.user = userData;
    }

    save() {
        getUsersData((userDb) => {
            userDb[this.user.username] = this.user;
            console.log(userDb);
            fs.writeFile(p, JSON.stringify(userDb, null, '\t'), (err) => {
                if (err)
                    console.log('Error writting file.', err);
            });
        })
    }

    static fetchAll(cb) {
        getUsersData(cb)
    }
};