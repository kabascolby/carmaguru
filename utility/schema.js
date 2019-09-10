const db = require('./database');

var sql = 'CREATE TABLE customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))';

db.execute('SHOW tables').then(data => console.log(data[0]));

console.log('here')
    // http://www.mysqltutorial.org/mysql-uuid/