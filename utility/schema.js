const db = require('./database');
const server = {
    userStatus: 1,
    imgStatus: 1
};


createUserstable()
    .then(([data]) => {
        data.warningStatus === 0 ?
            console.log('Users table Created') : 0
        return createImageTable();
    })
    .then(([data]) => {
        data.warningStatus === 0 ?
            console.log('image table Created') : 0;
        return createCommentTable();
    })
    .then(([data]) => {
        data.warningStatus === 0 ?
            console.log('comments table Created') : 0;
        return createTokentable();
    })
    .then(([data]) => {
        data.warningStatus === 0 ?
            console.log('token table Created') : 0;
    })
    .catch(e => console.log(e));

// 0: normal user 1: manager  2: admin

function createUserstable() {
    const sql = `CREATE TABLE IF NOT EXISTS users (
		id varchar(36),
		user_type ENUM('0','1','2') NOT NULL,
		firstname varchar(100) NOT NULL,
		lastname varchar(100) NOT NULL,
		username varchar(100) NOT NULL PRIMARY KEY,
		email varchar(50) NOT NULL,
		password varchar(100) NOT NULL,
		reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	  )ENGINE=InnoDB DEFAULT CHARSET=utf8`;

    return db.execute(sql);
}

function createImageTable() {
    const sql = `CREATE TABLE IF NOT EXISTS images(
		id varchar(36) NOT NULL PRIMARY KEY,
		user_id varchar(36) NOT NULL,
		fname varchar(100) NOT NULL,
		path varchar(255) NOT NULL,
		n_likes INT DEFAULT 0,
		n_comments INT DEFAULT 0,
		meta varchar(255) DEFAULT '{}',
		modif_date TIMESTAMP(2) DEFAULT CURRENT_TIMESTAMP(2) ON UPDATE CURRENT_TIMESTAMP(2),
		create_date TIMESTAMP(2) DEFAULT CURRENT_TIMESTAMP(2)
	)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`
    return db.execute(sql);
}

function createCommentTable() {
    const sql = `CREATE TABLE IF NOT EXISTS comments(
		id varchar(36) NOT NULL PRIMARY KEY,
		user_id varchar(36) NOT NULL,
		img_id varchar(36) NOT NULL,
		message varchar(255) NOT NULL,
		modif_date TIMESTAMP(2) DEFAULT CURRENT_TIMESTAMP(2) ON UPDATE CURRENT_TIMESTAMP(2),
		create_date TIMESTAMP(2) DEFAULT CURRENT_TIMESTAMP(2)
	)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`
    return db.execute(sql);;
}


function createTokentable() {
    const sql = `CREATE TABLE IF NOT EXISTS tokens (
		token varchar(100) NOT NULL PRIMARY KEY,
		user_id varchar(36) NOT NULL,
		expire TIMESTAMP NOT NULL,
		reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	  )ENGINE=InnoDB DEFAULT CHARSET=utf8`;

    return db.execute(sql);;
}

// http://www.mysqltutorial.org/mysql-uuid/
// https://stackoverflow.com/questions/2187593/can-mysql-convert-a-stored-utc-time-to-local-timezone
// https://stackoverflow.com/questions/409286/should-i-use-the-datetime-or-timestamp-data-type-in-mysql?rq=1