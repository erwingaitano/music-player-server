const express = require('express');
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const port = 3000;
const app = express();
const apiController = require.main.require(path.join(__dirname, '/src/api/controller'));
const playlistsController = require.main.require(path.join(__dirname, '/src/playlists/controller'));

app.use((req, res, next) => {
  req.protocoledHost = `${req.protocol}://${req.get('host')}`;
  next();
});

app.use('/api/', apiController);
app.use('/playlists', playlistsController);

app.get('/play/songs', (req, res) => {
  res.send('LUL');
});

app.listen(port, () => {
  console.log('Listening in port %s', port);
});
