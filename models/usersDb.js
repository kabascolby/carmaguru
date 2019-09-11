const fs = require('fs');
const path = require('path');
const db = require('../utility/database');

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
        this.firstName = userData.first;
        this.lastName = userData.last;
        this.userName = userData.username;
        this.em = userData.email;
        this.passWord = userData.psw;
    }

    save() {
        let credentials = `INSERT INTO users 
			(
				id,
				user_type,
				firstname,
				lastname,
				username,
				email,
				password
			)VALUES(
				UUID_TO_BIN(UUID()),
				'2', 
				'${this.firstName}',
				'${this.lastName}',
				'${this.userName}',
				'${this.em}',
				'${this.passWord}'
			)`
        console.log(this);
        db.execute(credentials)
            .catch(e => console.error(e));
    }

    static getUserNames() {
        return db.execute(`SELECT username FROM users`);
    }

    static fetchAll() {
        return db.execute(`SELECT * FROM users`);
    }
};