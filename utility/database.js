const mysql = require('mysql2');
const options = require('./options');

const pool = mysql.createPool(options);

module.exports = pool.promise();