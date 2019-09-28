const db = require('../utility/database');

module.exports = class Token {
    constructor(token, userId) {
        this.token = token;
        this.userId = userId;
    }

    save() {
        var sql = `INSERT INTO tokens 
			(token, user_id, expire)
			VALUES(?, ?, NOW() + INTERVAL 1 HOUR)`
        return db.execute(sql, [this.token, this.userId]);
    }

    // static getUserNames() {
    //     return db.execute(`SELECT username FROM users`);
    // }

    // static fetchUser(userName) {
    //     return db.execute(`Select *
    // 		FROM tokens
    // 			WHERE username = '${userName}'
    // 	`);
    // }

    // static fetchAll() {
    //     return db.execute(`SELECT * FROM users`);
    // }
}