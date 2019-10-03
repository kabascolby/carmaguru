const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  mailkey: process.env.API_KEY,
  masterKey: process.env.API_KEY,
  port: process.env.PORT
};