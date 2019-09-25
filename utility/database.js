const mysql = require('mysql2');

const options = {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    database: 'camagru',
    password: 'Lamine@2019'
}

const pool = mysql.createPool(options);

module.exports = pool.promise();