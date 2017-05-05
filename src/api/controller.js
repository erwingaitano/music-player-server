const express = require('express');
const mysql = require('mysql');
const mysqlPromise = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const Bluebird = require('bluebird');

const helpers = require.main.require(path.join(__dirname, '../_helpers'));
const router = new express.Router();
const songAttrs = `
  Songs.id as song_id,
  Songs.keyname as song_keyname,
  Songs.name as song_name,
  Songs.covers as song_covers,
  Songs.fileExtension as song_fileExtension,
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

const playlistAttrs = 'id, name, createdAt, updatedAt';

const orderSongsBy = 'Artists.name ASC, Albums.name ASC, Songs.name ASC';

const songArtistAlbumAttrs = `${songAttrs}, ${artistAttrs}, ${albumAttrs}`;

const queryGetSongs = `
  SELECT ${songArtistAlbumAttrs} FROM Songs
      LEFT JOIN Albums ON Songs.album_id = Albums.id
      LEFT JOIN Artists ON Artists.id = Songs.artist_id OR Artists.id = Albums.artist_id
`;

const dbConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../database/config.json'), 'utf8'));

const dbConnection = mysqlPromise.createConnection({
  host: dbConfig[process.env.NODE_ENV].host,
  user: dbConfig[process.env.NODE_ENV].username,
  password: dbConfig[process.env.NODE_ENV].password,
  database: dbConfig[process.env.NODE_ENV].database,
  Promise: Bluebird
});

function getParsedInfoSong(songFromDB) {
  return helpers.getParsedInfoSongWithSongKeyname(songFromDB.keyname);
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
  .then(dbc => dbc.execute(`${queryGetSongs} ORDER BY ${orderSongsBy}`))
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
  .then(dbc => dbc.execute(`SELECT ${artistAttrs} FROM Artists ORDER BY Artists.name ASC`))
  .then(response => { res.json(response[0]); });
});

router.get('/artists/:id/songs', (req, res) => {
  const artistId = mysql.escape(req.params.id);
  dbConnection
  .then(dbc => dbc.execute(`
    ${queryGetSongs}
      WHERE Artists.id = ${artistId} OR Albums.artist_id = ${artistId} AND Songs.album_id = Albums.id
      ORDER BY ${orderSongsBy}
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
    ORDER BY Albums.name ASC
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/artists/:id/albums/:albumId/songs', (req, res) => {
  const albumId = mysql.escape(req.params.albumId);

  dbConnection
  .then(dbc => dbc.execute(`
    ${queryGetSongs}
    WHERE Albums.id = ${albumId} AND Songs.album_id = Albums.id
    ORDER BY ${orderSongsBy}
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/playlists', (req, res) => {
  dbConnection
  .then(dbc => dbc.execute(`SELECT ${playlistAttrs} FROM Playlists ORDER BY Playlists.name ASC`))
  .then(response => { res.json(response[0]); });
});

router.post('/playlists', bodyParser.json(), (req, res) => {
  const name = mysql.escape(req.body.name);

  dbConnection
  .then(dbc => dbc.execute(`
    INSERT INTO Playlists (name)
    VALUES (${name})
  `))
  .then(response => { res.json(response[0]); })
  .catch(handleError.bind(null, res));
});

router.patch('/playlists', bodyParser.json(), (req, res) => {
  const id = mysql.escape(req.body.id);
  const name = mysql.escape(req.body.name);

  dbConnection
  .then(dbc => dbc.execute(`
    UPDATE Playlists
    SET name=${name}
    WHERE id=${id}
  `))
  .then(response => { res.json(response[0]); })
  .catch(handleError.bind(null, res));
});

router.delete('/playlists', bodyParser.json(), (req, res) => {
  const id = mysql.escape(req.body.id);

  dbConnection
  .then(dbc => dbc.execute(`
    DELETE FROM Playlists
    WHERE Playlists.id=${id}
  `))
  .then(response => { res.json(response[0]); })
  .catch(handleError.bind(null, res));
});

router.get('/playlists/:id', (req, res) => {
  const id = mysql.escape(req.params.id);

  dbConnection
  .then(dbc => dbc.execute(`SELECT ${playlistAttrs} FROM Playlists WHERE id=${id}`))
  .then(response => { res.json(response[0][0]); });
});

router.get('/playlists/:id/songs', (req, res) => {
  const playlistId = mysql.escape(req.params.id);

  dbConnection
  .then(dbc => dbc.execute(`
    ${queryGetSongs}
    INNER JOIN PlaylistSongs
    WHERE PlaylistSongs.playlist_id = ${playlistId} AND PlaylistSongs.song_id = Songs.id
    ORDER BY ${orderSongsBy}
  `))
  .then(response => { res.json(response[0]); });
});

router.post('/playlists/:id/songs/:songId', (req, res) => {
  const playlistId = mysql.escape(req.params.id);
  const songId = mysql.escape(req.params.songId);

  dbConnection
  .then(dbc => dbc.execute(`
    INSERT INTO PlaylistSongs (playlist_id, song_id)
    VALUES (${playlistId}, ${songId})
  `))
  .then(response => { res.json(response[0]); })
  .catch(handleError.bind(null, res));
});

router.delete('/playlists/:id/songs/:songId', (req, res) => {
  const playlistId = mysql.escape(req.params.id);
  const songId = mysql.escape(req.params.songId);

  dbConnection
  .then(dbc => dbc.execute(`
    DELETE FROM PlaylistSongs
    WHERE playlist_id=${playlistId} AND song_id=${songId}
    LIMIT 1
  `))
  .then(response => { res.json(response[0]); });
});

router.get('/covers/*', (req, res) => {
  const file = path.join(helpers.mediaDir, req.params[0]);
  res.set({ 'Content-Type': 'image/jpeg' });
  res.sendFile(file);
});

module.exports = router;
