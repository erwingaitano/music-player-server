const express = require('express');
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const port = 3000;
const app = express();
const apiController = require.main.require(path.join(__dirname, '/src/api/controller/index'));

app.use('/api/', apiController);

app.get('/play/:songId', (req, res) => {
  res.send(`<audio src="/api/songs/${req.params.songId}/file" controls></audio>`);
});

app.listen(port, () => {
  console.log('Listening in port %s', port);
});
