const mysql = require('mysql2');

const options = {
    host: '192.168.99.100',
    port: '3308',
    user: 'root',
    database: 'camagru',
    password: 'lamine19'
}

const pool = mysql.createPool(options);

module.exports = pool.promise();