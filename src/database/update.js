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
const songDirs = getChildDirs(songsRootDir);

const dbConnection = mysqlPromise.createConnection({
  host, user: username, password, database, Promise: Bluebird
});

dbConnection
.tap(() => { console.log('Updating Database...'); })
.then(dbc => dbc.execute('SELECT id, dirPath FROM Song'))
.then(dbResults => dbResults[0])
.then(songsFromDB =>
  songDirs.map(dirPath => {
    const matchedSongInDB = songsFromDB.find(el2 => el2.dirPath === dirPath);
    return { id: matchedSongInDB ? matchedSongInDB.id : null, name: dirPath, dirPath };
  })
)
.then(updatedSongs => {
  const songsValues = updatedSongs
    .map(song => `(${mysql.escape(song.name)}, ${mysql.escape(song.dirPath)})`)
    .join(', ');

  return dbConnection.then(dbc => dbc.execute(`
    INSERT INTO Song (name, dirPath)
      VALUES ${songsValues}
      ON DUPLICATE KEY UPDATE
      name=VALUES(name);
  `));
})
.then(() => { console.log('Database Updated'); })
.catch(error => {
  console.log(error.message);
})
.finally(() => { process.exit(0); });
