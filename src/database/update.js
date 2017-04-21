#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const mysqlPromise = require('mysql2/promise');
const Bluebird = require('bluebird');

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
const { username, password, database, host } = dbCredentials;
const musicDirs = getChildDirs(songsRootDir);

const dbConnection = mysqlPromise.createConnection({
  host, user: username, password, database, Promise: Bluebird
});

// `
//   INSERT INTO Song (name, dirPath)
//   VALUES (${}), (3, 4)
// `
dbConnection
.tap(() => { console.log('Updating Database...'); })
.then(dbc => dbc.execute('SELECT dirPath FROM Song'))
.then(results => getArrayDifference(musicDirs, results[0], (el1, el2) => el1 === el2.dirPath))
.then(results => {
  const values = results
    .map(name => {
      const escapedName = mysql.escape(name);
      return `(${escapedName}, ${escapedName})`;
    })
    .join(', ');

  return dbConnection.then(dbc => dbc.execute(`
    INSERT INTO Song (name, dirPath) VALUES ${values}
  `));
})
.then(() => { console.log('Database Updated'); })
.catch(error => {
  console.log(error.message);
})
.finally(() => { process.exit(0); });
