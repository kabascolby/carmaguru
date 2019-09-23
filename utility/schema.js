const db = require('./database');
const server = {
    userStatus: 1,
    imgStatus: 1

};

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

    db.execute(sql).then(data => data[0].warningStatus === 0 ?
        console.log('Users table Created') : server.userStatus = 0
    ).catch(e => console.log(e));
}

function createImageTable() {
    const sql = `CREATE TABLE IF NOT EXISTS images(
		id varchar(36) NOT NULL PRIMARY KEY,
		user_id varchar(36) NOT NULL,
		fname varchar(100) NOT NULL,
		path varchar(255) NOT NULL,
		modif_date TIMESTAMP(2) DEFAULT CURRENT_TIMESTAMP(2) ON UPDATE CURRENT_TIMESTAMP(2),
		create_date TIMESTAMP(2) DEFAULT CURRENT_TIMESTAMP(2)
	)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`
    db.execute(sql).then(data => data[0].warningStatus === 0 ?
        console.log('image table Created', data[0]) : server.imgStatus = 0
    ).catch(e => console.log(e));
}

if (server.userStatus) {
    createUserstable();
}

if (server.imgStatus) {
    createImageTable();
}

// http://www.mysqltutorial.org/mysql-uuid/
// https://stackoverflow.com/questions/2187593/can-mysql-convert-a-stored-utc-time-to-local-timezone
// https://stackoverflow.com/questions/409286/should-i-use-the-datetime-or-timestamp-data-type-in-mysql?rq=1