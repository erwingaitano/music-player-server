const express = require('express');
const mysql = require('mysql');
const mysqlPromise = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const Bluebird = require('bluebird');

const helpers = require.main.require(path.join(__dirname, '../../_helpers'));
const router = new express.Router();
const songPossibleExtensions = ['m4a', 'mp3'];
const songAttrs = `
  Songs.id as song_id,
  Songs.name as song_name,
  Songs.covers as song_covers,
  Songs.createdAt as song_createdAt,
  Songs.updatedAt as song_updatedAt
`;

const artistAttrs = `
  Artists.id as artist_id,
  Artists.name as artist_name,
  Artists.covers as artist_covers,
  Artists.createdAt as artist_createdAt,
  Artists.updatedAt as artist_updatedAt
`;

const albumAttrs = `
  Albums.id as album_id,
  Albums.name as album_name,
  Albums.covers as album_covers,
  Albums.createdAt as album_createdAt,
  Albums.updatedAt as album_updatedAt
`;

const songArtistAlbumAttrs = `${songAttrs}, ${artistAttrs}, ${albumAttrs}`;

const queryGetSongs = `
  SELECT ${songArtistAlbumAttrs} FROM Songs
      LEFT JOIN Albums ON Songs.album_id = Albums.id
      LEFT JOIN Artists ON Artists.id = Songs.artist_id OR Artists.id = Albums.artist_id
`;

const dbConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/config.json'), 'utf8'));

const dbConnection = mysqlPromise.createConnection({
  host: dbConfig[process.env.NODE_ENV].host,
  user: dbConfig[process.env.NODE_ENV].username,
  password: dbConfig[process.env.NODE_ENV].password,
  database: dbConfig[process.env.NODE_ENV].database,
  Promise: Bluebird
});

function fileExists(path) {
  try {
    return fs.statSync(path).isFile();
  } catch (err) {
    return false;
  }
}

function getParsedInfoSong(songFromDB) {
  const songFolderInfo = helpers.getSongFolderInfo(songFromDB.keyname);

  return songPossibleExtensions.reduce((result, ext) => {
    if (result) return result;

    const songPath = path.join(songFolderInfo.path, `file.${ext}`);

    if (!fileExists(songPath)) return result;
    const songPathInfo = path.parse(songPath);

    return {
      fileDir: path.join(songPathInfo.dir, songPathInfo.base),
      fileName: songFolderInfo.independentKeyname,
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

// Routes

router.get('/songs', (req, res) => {
  dbConnection
  .then(dbc => dbc.execute(queryGetSongs))
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
  .then(dbc => dbc.execute(`SELECT ${artistAttrs} FROM Artists`))
  .then(response => { res.json(response[0]); });
});

router.get('/artists/:id/songs', (req, res) => {
  const artistId = mysql.escape(req.params.id);
  dbConnection
  .then(dbc => dbc.execute(`
    ${queryGetSongs}
      WHERE Artists.id = ${artistId} OR Albums.artist_id = ${artistId} AND Songs.album_id = Albums.id
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/artists/:id/albums', (req, res) => {
  const artistId = mysql.escape(req.params.id);

  dbConnection
  .then(dbc => dbc.execute(`
    SELECT ${albumAttrs} FROM Albums
    INNER JOIN Artists
    WHERE Artists.id = ${artistId} AND Albums.artist_id = Artists.id
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/artists/:id/albums/:albumId/songs', (req, res) => {
  const albumId = mysql.escape(req.params.albumId);

  dbConnection
  .then(dbc => dbc.execute(`
    ${queryGetSongs}
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
    ${queryGetSongs}
    INNER JOIN PlaylistSongs
    WHERE PlaylistSongs.playlist_id = ${playlistId} AND PlaylistSongs.song_id = Songs.id
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/covers/*', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  const file = path.join(helpers.mediaDir, req.params[0]);
  res.download(file, path.parse(file).base);
});

module.exports = router;
