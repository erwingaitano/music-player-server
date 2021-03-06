#! /usr/bin/env node

require('./removeFiles');
require('./validations');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const mysqlPromise = require('mysql2/promise');
const Bluebird = require('bluebird');

const projectRootPath = path.join(__dirname, '../');
const helpers = require.main.require(path.join(projectRootPath, 'src/_helpers'));
const dbConfig = JSON.parse(fs.readFileSync(path.join(projectRootPath, 'src/database/config.json'), 'utf8'));

const keynameSeparator = helpers.keynameSeparator;
const mediaDir = helpers.mediaDir;
const dbCredentials = dbConfig.development;
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

function getChildFiles(dirPath) {
  try {
    const dirContent = fs.readdirSync(dirPath);
    return dirContent
      .filter(el => fs.statSync(path.join(dirPath, el)).isFile())
      .filter(el => el[0] !== '.');
  } catch (err) {
    return [];
  }
}

function getArtists() {
  return getChildDirs(mediaDir + '/_artists');
}

function getAlbums(artistKeyname) {
  return getChildDirs(mediaDir + '/_artists/' + artistKeyname + '/_albums');
}

function getIndependentSongs() {
  return getChildDirs(mediaDir).filter(el => el !== '_artists' && el !== '_covers');
}

function getArtistSongs(artistKeyname) {
  return getChildDirs(mediaDir + '/_artists/' + artistKeyname)
    .filter(el => el !== '_albums' && el !== '_covers');
}

function getAlbumSongs(albumKeyname) {
  const artistAndAlbum = albumKeyname.split(keynameSeparator);
  return getChildDirs(mediaDir + '/_artists/' + artistAndAlbum[0] + '/_albums/' + artistAndAlbum[1])
    .filter(el => el !== '_albums' && el !== '_covers');
}

function getArrayDifference(array1, array2, predicateFn) {
  return array1.reduce((total, el) => {
    if (!array2.some(el2 => predicateFn(el, el2))) total.push(el);
    return total;
  }, []);
}

function getCovers(fullpath) {
  const pathRelativeToMedia = fullpath.substring(mediaDir.length + 1);
  return getChildFiles(path.join(fullpath, '_covers'))
    .map(el => `/${pathRelativeToMedia}/_covers/${el}`);
}

function getArtistCovers(artistKeyname) {
  const fullpath = path.join(`${mediaDir}/_artists/${artistKeyname}`);
  return getCovers(fullpath);
}

function getSongCovers(fullpath) {
  return getCovers(fullpath);
}

function getAlbumCovers(albumKeyname) {
  const artistAndAlbum = albumKeyname.split(keynameSeparator);
  const fullpath = path.join(`${mediaDir}/_artists/${artistAndAlbum[0]}/_albums/${artistAndAlbum[1]}`);
  return getCovers(fullpath);
}

function updateSongs(songs) {
  if (!songs.length) return null;

  songs = songs.map(song => {
    const artistId = (song.artist && song.artist.id) ? mysql.escape(song.artist.id) : 'NULL';
    const albumId = (song.album && song.album.id) ? mysql.escape(song.album.id) : 'NULL';
    const name = mysql.escape(song.name);
    let keyname = song.keyname;
    if (artistId !== 'NULL') { keyname = song.artist.keyname + keynameSeparator + song.keyname; }
    if (albumId !== 'NULL') { keyname = song.album.keyname + keynameSeparator + song.keyname; }

    const songFolderInfo = helpers.getSongFolderInfo(keyname);
    const covers = mysql.escape(JSON.stringify(getSongCovers(path.join(songFolderInfo.path))));
    const fileExtension = mysql.escape(helpers.getParsedInfoSongWithSongKeyname(keyname).ext);
    keyname = mysql.escape(keyname);

    return `(${keyname}, ${name}, ${covers}, ${artistId}, ${albumId}, ${fileExtension})`;
  });

  return dbConnection
  .then(dbc => dbc.execute(`
    INSERT INTO Songs (keyname, name, covers, artist_id, album_id, fileExtension)
      VALUES ${songs}
      ON DUPLICATE KEY UPDATE
      name=VALUES(name),
      covers=VALUES(covers),
      fileExtension=VALUES(fileExtension)
  `));
}

function updateArtistAlbums(artistKeyname) {
  const artistSongs = getArtistSongs(artistKeyname);
  const albums = getAlbums(artistKeyname);

  return dbConnection
  .then(dbc => dbc.execute(`
    SELECT id, keyname FROM Artists
      WHERE keyname = ${mysql.escape(artistKeyname)}
  `))
  .then(results => results[0][0])
  .tap(artistFromDB => dbConnection.then(dbc => {
    if (!albums.length) return [[]];

    const albumValues = albums
      .map(album => {
        const keyname = mysql.escape(`${artistFromDB.keyname}${keynameSeparator}${album}`);
        const name = mysql.escape(album);
        const covers = mysql.escape(JSON.stringify(getAlbumCovers(`${artistFromDB.keyname}${keynameSeparator}${album}`)));
        const artistId = mysql.escape(artistFromDB.id);

        return `(${keyname}, ${name}, ${covers}, ${artistId})`;
      })
      .join(', ');

    return dbc.execute(`
      INSERT INTO Albums (keyname, name, covers, artist_id)
      VALUES ${albumValues}
      ON DUPLICATE KEY UPDATE
      name=VALUES(name),
      covers=VALUES(covers)
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
        const albumSongs = getAlbumSongs(album.keyname)
          .map(name => ({
            name, keyname: name, album: { id: album.id, keyname: album.keyname }
          }));

        promises.push(updateSongs(albumSongs));
      });
    }

    if (artistSongs.length) {
      const noAlbumSongs = artistSongs
        .map(name => ({
          name, keyname: name, artist: { id: artistFromDB.id, keyname: artistKeyname }
        }));

      promises.push(updateSongs(noAlbumSongs));
    }

    return Bluebird.all(promises);
  });
}

function updateArtists() {
  const artistDirs = getArtists();
  const valuesToDB = artistDirs
    .map(keyname => {
      const covers = mysql.escape(JSON.stringify(getArtistCovers(keyname)));
      keyname = mysql.escape(keyname);
      return `(${keyname}, ${keyname}, ${covers})`;
    })
    .join(', ');

  return dbConnection
  .then(dbc => dbc.execute(`
    INSERT INTO Artists (name, keyname, covers)
      VALUES ${valuesToDB}
      ON DUPLICATE KEY UPDATE
      name=VALUES(name),
      covers=VALUES(covers)
  `))
  .then(() =>
    Bluebird.all(artistDirs.map(artistKeyname => updateArtistAlbums(artistKeyname)))
  );
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

      if (!corruptedArtistsIds || !corruptedArtistsIds.length) return null;
      return dbc.execute(`DELETE FROM Artists WHERE id IN (${corruptedArtistsIds})`);
    })
  );
}

function cleanAlbums() {
  return dbConnection.then(dbc => dbc.execute('SELECT id, keyname FROM Albums')
    .then(results => results[0])
    .then(albumsFromDB => {
      const allAlbumsKeynames = getArtists().reduce((result, artist) => {
        getAlbums(artist).forEach(album => { result.push(`${artist}${keynameSeparator}${album}`); });
        return result;
      }, []);

      const corruptedAlbumsIds =
        getArrayDifference(albumsFromDB, allAlbumsKeynames, (el1, el2) => el1.keyname === el2)
        .map(el => mysql.escape(el.id))
        .join(', ');

      if (!corruptedAlbumsIds || !corruptedAlbumsIds.length) return null;
      return dbc.execute(`DELETE FROM Albums WHERE id IN (${corruptedAlbumsIds})`);
    })
  );
}

function cleanSongs() {
  return dbConnection.then(dbc => dbc.execute('SELECT id, keyname FROM Songs')
    .then(results => results[0])
    .then(songsFromDB => {
      const allSongsKeynames = getArtists().reduce((result, artist) => {
        getAlbums(artist).forEach(album => {
          const songsKeynames = getAlbumSongs(`${artist}${keynameSeparator}${album}`)
            .map(song => `${artist}${keynameSeparator}${album}${keynameSeparator}${song}`);
          result = result.concat(songsKeynames);
        });

        return result.concat(getArtistSongs(artist).map(song => `${artist}${keynameSeparator}${song}`));
      }, [])
      .concat(getIndependentSongs());

      const corruptedSongsIds =
        getArrayDifference(songsFromDB, allSongsKeynames, (el1, el2) => el1.keyname === el2)
        .map(el => mysql.escape(el.id))
        .join(', ');

      if (!corruptedSongsIds || !corruptedSongsIds.length) return null;
      return dbc.execute(`DELETE FROM Songs WHERE id IN (${corruptedSongsIds})`);
    })
  );
}

function updateSongsWithNoAlbumArtist() {
  return updateSongs(getIndependentSongs());
}

// Init

console.log('Updating Database...');

cleanArtists()
.then(cleanAlbums)
.then(cleanSongs)
.then(updateSongsWithNoAlbumArtist)
.then(updateArtists)
.then(() => { console.log('Database Updated'); })
.then(() => { process.exit(0); })
.catch(err => {
  console.error(err);
  process.exit(1);
});
