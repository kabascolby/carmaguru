const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '192.168.99.100',
    port: '3308',
    user: 'root',
    database: 'camagru',
    password: 'lamine19'
});

module.exports = pool.promise();