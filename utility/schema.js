const db = require('./database');
const server = { status: 1 };

// 0: normal user 1: manager  2: admin

function createUserstable() {
    const sql = `CREATE TABLE IF NOT EXISTS users (
		id BINARY(16),
		user_type ENUM('0','1','2') NOT NULL,
		firstname varchar(100) NOT NULL,
		lastname varchar(100) NOT NULL,
		username varchar(100) NOT NULL PRIMARY KEY,
		email varchar(50) NOT NULL,
		password varchar(100) NOT NULL,
		reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	  )`;

    db.execute(sql).then(data => data[0].warningStatus === 0 ?
        console.log('Users table Created') : server.status = 0
    ).catch(e => console.log(e));
}

if (server.status) {
    createUserstable();
}

// http://www.mysqltutorial.org/mysql-uuid/