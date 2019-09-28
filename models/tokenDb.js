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

    static fetchUserToken(token) {
        var sql = `SELECT id, token, firstname, lastname, email, expire
		FROM tokens t
		JOIN users u
		ON u.id = t.user_id
		WHERE token=? AND expire > NOW()`
        return db.execute(sql, [token]);
    }

    static fetchUserAndToken(token, userId) {
        var sql = `SELECT id, token, firstname, lastname, email, expire
		FROM tokens t
		JOIN users u
		ON u.id = t.user_id
		WHERE token=? AND id=? AND expire > NOW()`
        return db.execute(sql, [token, userId]);
    }

    // static fetchUser(userName) {
    //     return db.execute(`Select *
    // 		FROM tokens
    // 			WHERE username = '${userName}'
    // 	`);
    // }

    static destroy(token) {
        return db.execute(`DELETE FROM tokens WHERE token=?`, [token]);
    }
}