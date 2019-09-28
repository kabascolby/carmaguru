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
				UUID(),
				'2', 
				'${this.firstName}',
				'${this.lastName}',
				'${this.userName}',
				'${this.em}',
				'${this.passWord}'
			)`
        console.log(this);
        return db.execute(credentials);
    }

    static getUserNames() {
        return db.execute(`SELECT username FROM users`);
    }

    static fetchUser(userName) {
        return db.execute(`Select *
			FROM users
				WHERE username = '${userName}'
		`);
    }

    static updatePassword(userId, newPassword) {
        return db.execute(`UPDATE users SET password=? WHERE id=?`, [newPassword, userId])
    }

    static fetchAll() {
        return db.execute(`SELECT * FROM users`);
    }
};