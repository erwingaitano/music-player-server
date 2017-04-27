const express = require('express');
const requestPromise = require('request-promise');
const Bluebird = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');

const helpers = require.main.require(path.join(__dirname, '../_helpers'));
const router = new express.Router();

router.get('/', (req, res) => {
  requestPromise(`${req.protocoledHost}/api/playlists`, { json: true })
  .then(playlists => res.send(`
    ${helpers.pageStyles}
    <a href='/'>Back to index</a>
    <h1>Playlists</h1>
    <ul>
      ${playlists.map(el => `
        <li>
          <a href='/playlists/${el.id}'>${el.name}</a>
          <form style='display: inline-block; margin: 0' method='post'>
            <input name='method' value='delete' hidden=true />
            <input name='id' value=${el.id} hidden=true />
            <button class='button is-delete'>Remove Playlist</button>
          </form>
          <form style='display: inline-block; margin: 0 0 0 15px' method='post'>
            <input name='method' value='update' hidden=true />
            <input name='id' value=${el.id} hidden=true />
            <label>Rename: </label>
            <input type='text' name='name' value='${el.name.replace(/'/g, '&apos;')}' />
            <button class='button'>Rename</button>
          </form>
        </li>
      `).join('')}
    </ul>

    <h1>Create playlist</h1>
    <form method='post'>
      <input name='method' value='post' hidden=true />
      <label>Name:</label>
      <input name='name' type='text' />
      <button class='button'>Create</button>
    </form>
  `));
});

router.post('/', bodyParser.urlencoded({ extended: true }), (req, res) => {
  const method = req.body.method;
  let promise;

  if (method === 'post') {
    promise = requestPromise.post(`${req.protocoledHost}/api/playlists`, { body: { name: req.body.name }, json: true });
  } else if (method === 'delete') {
    promise = requestPromise.delete(`${req.protocoledHost}/api/playlists`, { body: { id: req.body.id }, json: true });
  } else if (method === 'update') {
    promise = requestPromise.patch(
      `${req.protocoledHost}/api/playlists`, { body: { id: req.body.id, name: req.body.name }, json: true }
    );
  }
  promise.then(() => { res.redirect(req.originalUrl.split('?')[0]); });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  Bluebird.join(
    requestPromise(`${req.protocoledHost}/api/playlists/${id}`, { json: true }),
    requestPromise(`${req.protocoledHost}/api/playlists/${id}/songs`, { json: true }),
    requestPromise(`${req.protocoledHost}/api/songs`, { json: true })
  )
  .spread((playlist, playlistSongs, allSongs) => res.send(`
    ${helpers.pageStyles}
    <a href='/playlists'>Back to playlists</a>
    ${helpers.getUlListHtmlForAllSongs(playlistSongs, {
      title: `Songs of Playlist <span class='secondary-color'>${playlist.name}`, removePlaylist: true
    })}
    ${helpers.getUlListHtmlForAllSongs(allSongs, { playlist: { addedSongs: playlistSongs } })}
  `));
});

router.post('/:id', bodyParser.urlencoded({ extended: true }), (req, res) => {
  const playlistId = req.params.id;
  const songId = req.body.songId;
  const method = req.body.method;
  let promise;

  if (method === 'post') {
    promise = requestPromise.post(`${req.protocoledHost}/api/playlists/${playlistId}/songs/${songId}`);
  } else if (method === 'delete') {
    promise = requestPromise.del(`${req.protocoledHost}/api/playlists/${playlistId}/songs/${songId}`);
  }

  promise.then(() => { res.redirect(req.originalUrl.split('?')[0]); });
});

module.exports = router;
