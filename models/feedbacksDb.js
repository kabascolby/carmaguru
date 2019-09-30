const db = require('../utility/database');
module.exports = class Comments {
    constructor(userId, imgId, comment) {
        this.userId = userId;
        this.imgId = imgId;
        this.comment = comment;
    }

    save() {
        let credentials = `INSERT INTO comments 
			(id, user_id, img_id, message)
			VALUES(UUID(), ?, ?, ?)`
        console.log(this);
        return db.execute(credentials, [this.userId, this.imgId, this.comment]);
    }

    static fetchCmtsByImages(imageId) {
        return db.execute(`SELECT * FROM comments
		WHERE imgId=? ORDER BY create_date DESC`, [imageId]);
    }

    static fetchCmt(cmtId) {
        return db.execute(`SELECT * FROM comments
		WHERE id=?`, [cmtId]);
    }

    static totalComments(imgId) {
        return db.execute(`SELECT COUNT(id) as total 
		FROM comments WHERE img_id=?`, [imgId]);
    }
}