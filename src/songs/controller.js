const express = require('express');
const path = require('path');
const requestPromise = require('request-promise');

const router = new express.Router();
const helpers = require.main.require(path.join(__dirname, '../_helpers'));

router.get('/', (req, res) => {
  requestPromise(`${req.protocoledHost}/api/songs`, { json: true })
  .then(songs => res.send(`
    ${helpers.pageStyles}
    <a href='/'>Back to index</a>
    ${helpers.getUlListHtmlForAllSongs(songs)}
  `));
});

router.get('/play/:id', (req, res) => {
  res.send(`
    ${helpers.pageStyles}
    <audio src="/api/songs/${req.params.id}/file" autoplay=true controls></audio>
  `);
});

module.exports = router;
