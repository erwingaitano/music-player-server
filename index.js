const express = require('express');
const mysql = require('mysql');
const mysqlPromise = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const Bluebird = require('bluebird');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const dbConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './src/database/config.json'), 'utf8'));
const songsDirPath = path.join('/Users/erwin/Music/music-player-files/songs');

const port = 3000;
const app = express();
const router = new express.Router();
const songPossibleExtensions = ['m4a', 'mp3'];

const dbConnection = mysqlPromise.createConnection({
  host: dbConfig[process.env.NODE_ENV].host,
  user: dbConfig[process.env.NODE_ENV].username,
  password: dbConfig[process.env.NODE_ENV].password,
  database: dbConfig[process.env.NODE_ENV].database,
  Promise: Bluebird
});

function getSongParsedInfo(songFromDB) {
  return songPossibleExtensions.reduce((result, ext) => {
    if (result) return result;

    const songPathInfo = path.parse(path.join(songsDirPath, songFromDB.dirPath, `file.${ext}`));

    if (!songPathInfo.name) return result;

    return {
      fileDir: path.join(songPathInfo.dir, songPathInfo.base),
      fileName: songFromDB.dirPath,
      ext: songPathInfo.ext
    };
  }, null);
}

function getSongFromDBResults(results) {
  const song = results[0][0];
  if (!song) throw new Error('Fuck you, this song doesn\'t exist!');
  return song;
}

function handleError(res, err) {
  console.log(err.stack);
  res.status(500).send(err.message);
}

// API

router.get('/', (req, res) => {
  dbConnection
  .then(dbc => dbc.execute('SELECT id, name, createdAt, updatedAt FROM Song'))
  .then(response => { res.send(response[0]); });
});

router.get('/play/:songId', (req, res) => {
  const songId = mysql.escape(req.params.songId);

  dbConnection
  .then(dbc => dbc.execute(`SELECT dirPath FROM Song WHERE id = ${songId}`))
  .then(getSongFromDBResults)
  .then(() => {
    res.send(`<audio src="/song-files/${req.params.songId}" controls></audio>`);
  })
  .catch(handleError.bind(null, res));
});

router.get('/song-files/:songId', (req, res) => {
  const songId = mysql.escape(req.params.songId);

  dbConnection
  .then(dbc => dbc.execute(`SELECT name, dirPath FROM Song WHERE id = ${songId}`))
  .then(getSongFromDBResults)
  .then(songFromDB => {
    const newSong = getSongParsedInfo(songFromDB);
    res.set('Cache-Control', 'no-cache');
    res.download(newSong.fileDir, `${newSong.fileName}${newSong.ext}`);
  })
  .catch(handleError.bind(null, res));
});

app.use(router);

app.listen(port, () => {
  console.log('Listening in port %s', port);
});
