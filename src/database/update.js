#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const dbConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json'), 'utf8'));

const songsRootDir = path.join('/Users/erwin/Music', 'music-player-files/songs');

// Functions

function getChildDirs(dirPath) {
  const dirContent = fs.readdirSync(dirPath);
  return dirContent.filter(el => fs.statSync(path.join(dirPath, el)).isDirectory());
}

function getArrayDifference(array1, array2, predicateFn) {
  return array1.reduce((total, el) => {
    if (!array2.some(el2 => predicateFn(el, el2))) total.push(el);
    return total;
  }, []);
}

// Init

const dbCredentials = dbConfig[process.env.NODE_ENV];
const { dialect, username, password, database, host } = dbCredentials;
const musicDirs = getChildDirs(songsRootDir);
const dbConnection = new Sequelize(`${dialect}://${username}:${password}@${host}:${3306}/${database}`, {
  logging: false
});

dbConnection.authenticate()
.then(() => { console.log('Updating Database...'); })
.then(() => dbConnection.define('Song', { name: Sequelize.STRING }, { freezeTableName: true }))
.then(Table => [Table, Table.findAll({ where: { name: { $in: musicDirs } } })])
.spread((Table, result) => [
  Table, getArrayDifference(musicDirs, result, (el1, el2) => el1 === el2.dataValues.name)
])
.spread((Table, newItems) => Table.bulkCreate(newItems.map(el => ({ name: el }))))
.then(() => { dbConnection.close(); })
.then(() => { console.log('Database Updated'); })
.catch(error => {
  console.log(error.errors);
});
