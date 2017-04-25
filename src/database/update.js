#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const mysqlPromise = require('mysql2/promise');
const Bluebird = require('bluebird');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const dbConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json'), 'utf8'));

const mediaDir = path.join('/Users/erwin/Music', 'music-player-files/_media');

const dbCredentials = dbConfig[process.env.NODE_ENV];
const { username, password, database, host } = dbCredentials;
const dbConnection = mysqlPromise.createConnection({
  host, user: username, password, database, Promise: Bluebird
});

// Functions

function getChildDirs(dirPath) {
  try {
    const dirContent = fs.readdirSync(dirPath);
    return dirContent.filter(el => fs.statSync(path.join(dirPath, el)).isDirectory());
  } catch (err) {
    return [];
  }
}

function getArrayDifference(array1, array2, predicateFn) {
  return array1.reduce((total, el) => {
    if (!array2.some(el2 => predicateFn(el, el2))) total.push(el);
    return total;
  }, []);
}

function handleError(error) {
  console.log(error);
}

function updateSongs(songs) {
  songs = songs.map(song => {
    const artistId = (song.artist && song.artist.id) ? mysql.escape(song.artist.id) : 'NULL';
    const albumId = (song.album && song.album.id) ? mysql.escape(song.album.id) : 'NULL';
    const name = mysql.escape(song.name);
    let keyname = song.keyname;
    if (artistId !== 'NULL') { keyname = song.artist.keyname + '.' + song.keyname; }
    if (albumId !== 'NULL') { keyname = song.album.keyname + '.' + song.keyname; }

    return `(${mysql.escape(keyname)}, ${name}, ${artistId}, ${albumId})`;
  });

  return dbConnection
  .then(dbc => dbc.execute(`
    INSERT INTO Songs (keyname, name, artist_id, album_id)
      VALUES ${songs}
      ON DUPLICATE KEY UPDATE
      name=VALUES(name)
  `));
}

function updateArtistAlbums(artistFullDirPath, artistDirname) {
  const albumsAndNoAlbumSongs = getChildDirs(artistFullDirPath)
    .reduce((result, el) => {
      if (el === '_albums') {
        result.albums = getChildDirs(artistFullDirPath + '/_albums');
      } else {
        result.noAlbumSongs.push(el);
      }

      return result;
    }, { albums: [], noAlbumSongs: [] });

  return dbConnection
  .then(dbc => dbc.execute(`
    SELECT id, keyname FROM Artists
      WHERE keyname = ${mysql.escape(artistDirname)}
  `))
  .then(results => results[0][0])
  .tap(artistFromDB => dbConnection.then(dbc => {
    if (!albumsAndNoAlbumSongs.albums.length) return [[]];

    const albumValues = albumsAndNoAlbumSongs.albums
      .map(name =>
        '(' +
          `${mysql.escape(`${artistFromDB.keyname}.${name}`)}, ` +
          `${mysql.escape(name)}, ` +
          `${mysql.escape(artistFromDB.id)}` +
        ')'
      )
      .join(', ');

    return dbc.execute(`
      INSERT INTO Albums (keyname, name, artist_id)
      VALUES ${albumValues}
      ON DUPLICATE KEY UPDATE
      name=VALUES(name)
    `);
  }))
  .then(artistFromDB => dbConnection.then(dbc => [
    artistFromDB,
    dbc.execute(`
      SELECT id, keyname FROM Albums
      WHERE artist_id=${artistFromDB.id}
    `)
  ]))
  .spread((artistFromDB, artistAlbumsFromDB) => [artistFromDB, artistAlbumsFromDB[0]])
  .spread((artistFromDB, artistAlbumsFromDB) => {
    const promises = [];

    if (artistAlbumsFromDB.length) {
      artistAlbumsFromDB.forEach(album => {
        const albumSongs = getChildDirs(artistFullDirPath + '/_albums/' + album.keyname.match(/\.(.*)/)[1])
          .map(name => ({
            name, keyname: name, album: { id: album.id, keyname: album.keyname }
          }));

        promises.push(updateSongs(albumSongs));
      });
    }

    if (albumsAndNoAlbumSongs.noAlbumSongs.length) {
      const noAlbumSongs = albumsAndNoAlbumSongs.noAlbumSongs
        .map(name => ({
          name, keyname: name, artist: { id: artistFromDB.id, keyname: artistDirname }
        }));

      promises.push(updateSongs(noAlbumSongs));
    }

    return Bluebird.all(promises);
  });
}

function updateArtists() {
  const artistDirs = getChildDirs(mediaDir + '/_artists');
  const valuesToDB = artistDirs
    .map(name => `(${mysql.escape(name)}, ${mysql.escape(name)})`)
    .join(', ');

  return dbConnection
  .then(dbc => dbc.execute(`
    INSERT INTO Artists (name, keyname)
      VALUES ${valuesToDB}
      ON DUPLICATE KEY UPDATE
      name=VALUES(name);
  `))
  .then(() =>
    Bluebird.all(artistDirs.map(el => updateArtistAlbums(mediaDir + '/_artists/' + el, el)))
  );
}

function getArtists() {
  return getChildDirs(mediaDir + '/_artists');
}

function getAlbums(artistKeyname) {
  return getChildDirs(mediaDir + '/_artists/' + artistKeyname + '/_albums');
}

function cleanArtists() {
  return dbConnection.then(dbc => dbc.execute('SELECT id, keyname FROM Artists')
    .then(results => results[0])
    .then(artistsFromDB => {
      const artists = getArtists();
      const corruptedArtistsIds =
        getArrayDifference(artistsFromDB, artists, (el1, el2) => el1.keyname === el2)
        .map(el => mysql.escape(el.id))
        .join(', ');

      if (!corruptedArtistsIds.length) return null;
      return dbc.execute(`DELETE FROM Artists WHERE id IN (${corruptedArtistsIds})`);
    })
  );
}

function cleanAlbums() {
  return dbConnection.then(dbc => dbc.execute('SELECT id, keyname FROM Albums')
    .then(results => results[0])
    .then(albumsFromDB => {
      const allAlbumsKeynames = getArtists().reduce((result, artist) => {
        getAlbums(artist).forEach(album => { result.push(`${artist}.${album}`); });
        return result;
      }, []);

      const corruptedAlbumsIds =
        getArrayDifference(albumsFromDB, allAlbumsKeynames, (el1, el2) => el1.keyname === el2)
        .map(el => mysql.escape(el.id))
        .join(', ');

      if (!corruptedAlbumsIds.length) return null;
      return dbc.execute(`DELETE FROM Albums WHERE id IN (${corruptedAlbumsIds})`);
    })
  );
}

function updateSongsWithNoAlbumArtist() {
  const songs = getChildDirs(mediaDir)
  .filter(el => el !== '_artists')
  .map(name => ({ name, keyname: name }));

  return updateSongs(songs);
}

// Init

console.log('Updating Database...');

cleanArtists()
.then(cleanAlbums)
.then(updateSongsWithNoAlbumArtist)
.then(updateArtists)
.then(() => { console.log('Database Updated'); })
.catch(handleError)
.finally(() => { process.exit(0); });

