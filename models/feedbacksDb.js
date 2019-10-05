const db = require('../utility/database');
module.exports = class Comments {
    constructor(id, userId, imgId, comment) {
        this.id = id;
        this.userId = userId;
        this.imgId = imgId;
        this.comment = comment;
    }

    save() {
        let credentials = `INSERT INTO comments 
			(id, user_id, img_id, message)
			VALUES(?, ?, ?, ?)`
            // console.log(this);
        return db.execute(credentials, [this.id, this.userId, this.imgId, this.comment]);
    }

    static fetchCmtsByImages(imageId) {
        return db.execute(`
			SELECT c.id, user_id, concat(firstName, ' ', lastName) AS name, message
			FROM comments c
			JOIN users u
    			ON c.user_id = u.id
			WHERE c.img_id=? ORDER BY create_date DESC`, [imageId]);
    }

    static updateNcomment(imgId) {
        const sql = `UPDATE images
		SET n_comments = n_comments + 1
		WHERE id=?`;
        return db.execute(sql, [imgId]);
    }

    static fetchCmt(cmtId) {
        return db.execute(`SELECT * FROM comments
		WHERE id=?`, [cmtId]);
    }

    static fetchCmtAndUser(cmtId) {
        const sql = `SELECT firstName, lastName FROM comments c
		JOIN users u
		ON u.id = c.user_id
		WHERE c.id=?`
        return db.execute(sql, [cmtId]);
    }

    static totalComments(imgId) {
        return db.execute(`SELECT COUNT(id) as total 
		FROM comments WHERE img_id=?`, [imgId]);
    }
}