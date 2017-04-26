const path = require('path');

const mediaDir = path.join('/Users/erwin/Music', 'music-player-files/_media');

module.exports = {
  mediaDir,
  getSongFolderInfo(songKeyname) {
    const keynames = songKeyname.split('.');
    const keynamesLength = keynames.length;
    let songpath;
    if (keynamesLength === 1) songpath = keynames[0];
    else if (keynamesLength === 2) songpath = `_artists/${keynames[0]}/${keynames[1]}`;
    else if (keynamesLength === 3) songpath = `_artists/${keynames[0]}/_albums/${keynames[1]}/${keynames[2]}`;

    return {
      pathFromRootMedia: songpath,
      path: path.join(mediaDir, songpath),
      independentKeyname: keynames[keynamesLength - 1]
    };
  }
};
