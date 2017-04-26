const express = require('express');
const mysql = require('mysql');
const mysqlPromise = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const Bluebird = require('bluebird');

const router = new express.Router();
const songPossibleExtensions = ['m4a', 'mp3'];

const dbConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/config.json'), 'utf8'));
const mediaDir = path.join('/Users/erwin/Music/music-player-files/_media');

const dbConnection = mysqlPromise.createConnection({
  host: dbConfig[process.env.NODE_ENV].host,
  user: dbConfig[process.env.NODE_ENV].username,
  password: dbConfig[process.env.NODE_ENV].password,
  database: dbConfig[process.env.NODE_ENV].database,
  Promise: Bluebird
});

function getParsedInfoSong(songFromDB) {
  const keynames = songFromDB.keyname.split('.');
  const keynamesLength = keynames.length;
  let songpath;
  if (keynamesLength === 1) songpath = keynames[0];
  else if (keynamesLength === 2) songpath = `_artists/${keynames[0]}/${keynames[1]}`;
  else if (keynamesLength === 3) songpath = `_artists/${keynames[0]}/_albums/${keynames[1]}/${keynames[2]}`;

  return songPossibleExtensions.reduce((result, ext) => {
    if (result) return result;

    const songPathInfo = path.parse(path.join(mediaDir, songpath, `file.${ext}`));

    if (!songPathInfo.name) return result;
    return {
      fileDir: path.join(songPathInfo.dir, songPathInfo.base),
      fileName: keynames[keynamesLength - 1],
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
  res.status(500).send(err.message);
}

router.get('/songs', (req, res) => {
  dbConnection
  .then(dbc => dbc.execute('SELECT id, name, createdAt, updatedAt FROM Songs'))
  .then(response => { res.json(response[0]); });
});

router.get('/songs/:id/file', (req, res) => {
  const songId = mysql.escape(req.params.id);

  dbConnection
  .then(dbc => dbc.execute(`SELECT name, keyname FROM Songs WHERE id = ${songId}`))
  .then(getSongFromDBResults)
  .then(songFromDB => {
    const newSong = getParsedInfoSong(songFromDB);
    res.set('Cache-Control', 'no-cache');
    res.download(newSong.fileDir, `${newSong.fileName}${newSong.ext}`);
  })
  .catch(handleError.bind(null, res));
});

router.get('/artists', (req, res) => {
  dbConnection
  .then(dbc => dbc.execute('SELECT id, name, createdAt, updatedAt FROM Artists'))
  .then(response => { res.json(response[0]); });
});

router.get('/artists/:id/songs', (req, res) => {
  const artistId = mysql.escape(req.params.id);

  dbConnection
  .then(dbc => dbc.execute(`
    SELECT Songs.id, Songs.name FROM Artists
    JOIN Songs, Albums
    WHERE Artists.id = ${artistId} AND
      (Artists.id = Songs.artist_id OR (Albums.artist_id = ${artistId} AND Songs.album_id = Albums.id))
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/artists/:id/albums', (req, res) => {
  const artistId = mysql.escape(req.params.id);

  dbConnection
  .then(dbc => dbc.execute(`
    SELECT Albums.id, Albums.name FROM Artists
    JOIN Albums
    WHERE Artists.id = ${artistId} AND Albums.artist_id = Artists.id
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/artists/:id/albums/:albumId/songs', (req, res) => {
  const albumId = mysql.escape(req.params.albumId);

  dbConnection
  .then(dbc => dbc.execute(`
    SELECT Songs.id, Songs.name FROM Albums
    JOIN Songs
    WHERE Albums.id = ${albumId} AND Songs.album_id = Albums.id
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/playlists', (req, res) => {
  dbConnection
  .then(dbc => dbc.execute('SELECT id, name, createdAt, updatedAt FROM Playlists'))
  .then(response => { res.json(response[0]); });
});

router.post('/playlists', (req, res) => {
  // TODO:
  // dbConnection
  // .then(dbc => dbc.execute('SELECT id, name, createdAt, updatedAt FROM Playlists'))
  // .then(response => { res.json(response[0]); });
});

router.get('/playlists/:id/songs', (req, res) => {
  const playlistId = mysql.escape(req.params.id);

  dbConnection
  .then(dbc => dbc.execute(`
    SELECT Songs.id, Songs.name FROM PlaylistSongs JOIN Songs
    WHERE playlist_id = ${playlistId} AND PlaylistSongs.song_id = Songs.id
  `))
  .then(response => { res.json(response[0]); });
});

module.exports = router;
