const nodeHelpers = require('node-helpers');
const fs = require('fs-extra');
const { mediaPath } = require('./vars');

nodeHelpers.file.getChildFiles(mediaPath, { recursive: true })
  .filter(el => el.split('/').pop() === '.DS_Store')
  .forEach(fs.removeSync);
