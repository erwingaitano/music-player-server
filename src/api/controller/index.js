const express = require('express');
const mysql = require('mysql');
const mysqlPromise = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const Bluebird = require('bluebird');

const helpers = require.main.require(path.join(__dirname, '../../_helpers'));
const router = new express.Router();
const songPossibleExtensions = ['m4a', 'mp3'];
const attrsToReturnFromSongs = 'Songs.id, Songs.name, Songs.covers, Songs.createdAt, Songs.updatedAt';
const attrsToReturnFromArtists = 'Artists.id, Artists.name, Artists.covers, Artists.createdAt, Artists.updatedAt';
const attrsToReturnFromAlbums = 'Albums.id, Albums.name, Albums.covers, Albums.createdAt, Albums.updatedAt';

const dbConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/config.json'), 'utf8'));

const dbConnection = mysqlPromise.createConnection({
  host: dbConfig[process.env.NODE_ENV].host,
  user: dbConfig[process.env.NODE_ENV].username,
  password: dbConfig[process.env.NODE_ENV].password,
  database: dbConfig[process.env.NODE_ENV].database,
  Promise: Bluebird
});

function getParsedInfoSong(songFromDB) {
  const songFolderInfo = helpers.getSongFolderInfo(songFromDB.keyname);

  return songPossibleExtensions.reduce((result, ext) => {
    if (result) return result;

    const songPathInfo = path.parse(path.join(songFolderInfo.path, `file.${ext}`));

    if (!songPathInfo.name) return result;
    return {
      fileDir: path.join(songPathInfo.dir, songPathInfo.base),
      fileName: songFolderInfo.indepentendKeyname,
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
  .then(dbc => dbc.execute(`SELECT ${attrsToReturnFromSongs} FROM Songs`))
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
  .then(dbc => dbc.execute(`SELECT ${attrsToReturnFromArtists} FROM Artists`))
  .then(response => { res.json(response[0]); });
});

router.get('/artists/:id/songs', (req, res) => {
  const artistId = mysql.escape(req.params.id);

  dbConnection
  .then(dbc => dbc.execute(`
    SELECT ${attrsToReturnFromSongs} FROM Artists
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
    SELECT ${attrsToReturnFromAlbums} FROM Albums
    JOIN Artists
    WHERE Artists.id = ${artistId} AND Albums.artist_id = Artists.id
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/artists/:id/albums/:albumId/songs', (req, res) => {
  const albumId = mysql.escape(req.params.albumId);

  dbConnection
  .then(dbc => dbc.execute(`
    SELECT ${attrsToReturnFromSongs} FROM Albums
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

// router.post('/playlists', (req, res) => {
  // TODO:
  // dbConnection
  // .then(dbc => dbc.execute('SELECT id, name, createdAt, updatedAt FROM Playlists'))
  // .then(response => { res.json(response[0]); });
// });

router.get('/playlists/:id/songs', (req, res) => {
  const playlistId = mysql.escape(req.params.id);

  dbConnection
  .then(dbc => dbc.execute(`
    SELECT ${attrsToReturnFromSongs} FROM PlaylistSongs JOIN Songs
    WHERE playlist_id = ${playlistId} AND PlaylistSongs.song_id = Songs.id
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/covers/*', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  const file = path.join(helpers.mediaDir, req.params[0]);
  res.download(file, path.parse(file).base);
});

module.exports = router;
