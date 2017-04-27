const express = require('express');
const path = require('path');

const router = new express.Router();
const helpers = require.main.require(path.join(__dirname, '../_helpers'));

router.get('/', (req, res) => {
  res.send(`
    ${helpers.pageStyles}
    <h1>Music Player</h1>
    <ul>
      <li><a href='/songs'>Songs</a></li>
      <li><a href='/playlists'>Playlists</a></li>
    </ul>
  `);
});

module.exports = router;
