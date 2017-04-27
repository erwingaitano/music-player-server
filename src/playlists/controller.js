const express = require('express');
const requestPromise = require('request-promise');
const Bluebird = require('bluebird');
const bodyParser = require('body-parser');

const router = new express.Router();

function getSpanTagForSong(song) {
  const artistName = song.artist_name ? ` - ${song.artist_name}` : '';
  return `<span>${song.song_name}${artistName}</span>`;
}

router.get('/', (req, res) => {
  // res.send(`<audio src="/api/songs/${req.params.songId}/file" controls></audio>`);
  requestPromise(req.protocoledHost + '/api/playlists')
  .then(response => res.send(`
    <h1>Playlists</h1>
    <ul>
      ${JSON.parse(response).map(el => `
        <li>
          <a href='/playlists/${el.id}'>${el.name}</a>
          <span>-</span>
          <form style='display: inline-block; margin: 0' method='post'>
            <input name='method' value='delete' hidden=true />
            <input name='id' value=${el.id} hidden=true />
            <button>Delete Playlist</button>
          </form>
        </li>
      `).join('')}
    </ul>

    <h1>Create playlist</h1>
    <form method='post'>
      <input name='method' value='post' hidden=true />
      <label>Name:</label>
      <input name='name' type='text' />
      <button>Create</button>
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
  }
  promise.then(() => { res.redirect(req.originalUrl.split('?')[0]); });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  Bluebird.join(
    requestPromise(req.protocoledHost + '/api/playlists/' + id + '/songs'),
    requestPromise(req.protocoledHost + '/api/songs')
  )
  .spread((playlistSongs, allSongs) => res.send(`
    <a href='/playlists'>Back to playlists</a>
    <h1>Playlist Songs</h1>
    <ul>
      ${JSON.parse(playlistSongs).map(el => `
        <li>
          ${getSpanTagForSong(el)}
          <span>-</span>
          <form style='display: inline-block; margin: 0' method='post'>
            <input name='method' value='delete' hidden=true />
            <input name='songId' value=${el.song_id} hidden=true />
            <button>Remove From Playlist</button>
          </form>
        </li>
      `).join('')}
    </ul>

    <h1>All Songs</h1>
    <ul>
      ${JSON.parse(allSongs).map(el => `
        <li>
          ${getSpanTagForSong(el)}
          ${(function init() {
            const repeated = JSON.parse(playlistSongs).filter(el2 => el2.song_id === el.song_id);
            const repeatedLength = repeated.length;
            if (!repeatedLength) return '';
            const timeLabel = repeatedLength === 1 ? 'time' : 'times';
            return `
              <span style='font-size: 12px; color: #888'>
                (Added ${repeatedLength} ${timeLabel})
              </span>
            `;
          }())}
          <span>-</span>
          <form style='display: inline-block; margin: 0' method='post'>
            <input name='method' value='post' hidden=true />
            <input name='songId' value=${el.song_id} hidden=true />
            <button>Add to Playlist</button>
          </form>
        </li>
      `).join('')}
    </ul>
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
