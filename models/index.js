/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const includes = require('lodash/includes');
const replace = require('lodash/replace');
const sequelize = require('../configs/db');

const basename = path.basename(__filename);
const db = {};

let fileDefined = '';
fs.readdirSync(__dirname)
  /* eslint-disable-next-line */
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const fullPath = path.join(__dirname, file);
    const isAssociate = includes(file, '.associate.js');
    if (isAssociate) {
      const repFile = replace(file, '.associate', '');
      const associateModel = require(fullPath)(sequelize, path.join(__dirname, repFile));
      fileDefined = repFile;
      db[associateModel.name] = associateModel;
    }

    if (!isAssociate && fileDefined !== file) {
      const model = sequelize.import(fullPath);
      db[model.name] = model;
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
