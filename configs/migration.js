const config = require('../config');

const db = {
  username: config.get('DB_USER'),
  password: config.get('DB_PASS'),
  database: config.get('DB_NAME'),
  host: config.get('DB_HOST'),
  dialect: config.get('DB_DIALECT'),
};

module.exports = db;
