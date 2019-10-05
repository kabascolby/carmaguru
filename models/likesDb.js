const db = require('../utility/database');

module.exports = class Likes {
    constructor(id, userId, imgId) {
        this.id = id;
        this.userId = userId;
        this.imgId = imgId;
    }

    save() {
        let sql = `INSERT INTO likes 
			(id, user_id, img_id)
			VALUES(?, ?, ?)`
        return db.execute(sql, [this.id, this.userId, this.imgId]);
    }

    static addTotalLikes(imgId) {
        let sql = `UPDATE images
		SET n_likes=n_likes + 1
		WHERE id=?`
        return db.execute(sql, [imgId]);
    }

    static deductTotalLikes(imgId) {
        let sql = `UPDATE images
		SET n_likes=n_likes - 1
		WHERE id=?`;
        return db.execute(sql, [imgId]);
    }

    static deleteLikes(id) {
        let sql = `DELETE  FROM likes 
			WHERE id=?`;
        return db.execute(sql, [id]);
    }

    static likesByUser(imgId, userId) {
        let sql = `SELECT id FROM likes
		WHERE img_id=? AND user_id=?`;
        return db.execute(sql, [imgId, userId]);
    }

    static fetchLike(id) {
        let sql = `SELECT id FROM likes
		WHERE id=?`;
        return db.execute(sql, [id]);
    }
}