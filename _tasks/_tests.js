const { getChildDirs, getChildFiles } = require('/Users/erwin/Projects/node-helpers/file');
const path = require('path');
const assert = require('assert');

const mediaPath = '/Users/erwin/MEGAsync/music-player-files/_media';

// all dirs
(function init() {
  const hasBadDirs = getChildDirs(mediaPath, { recursive: true }).some(el => el.includes('~'));
  assert.equal(hasBadDirs, false, 'Dirs must not contain ~ in their name');
}());

// _artists dirs
(function init() {
  const artists = getChildDirs(path.join(mediaPath, '_artists')).map(el => el.split('/').pop());
  const files = getChildFiles(path.join(mediaPath, '_artists'));

  assert.equal(artists.some(el => el[0] === '_'), false, 'it should not have underscore dirs');
  assert(artists.length >= 1, 'it should have one or more dirs');
  assert.equal(files.length, 0, 'it should not have files');
}());

// artists dirs
(function init() {
  const artistsDirs = getChildDirs(path.join(mediaPath, '_artists'));
  artistsDirs.forEach(el => {
    const dirs = getChildDirs(el);
    const files = getChildFiles(el);

    const hasBadDirs = dirs.some(el => {
      const dirName = el.split('/').pop();
      if (dirName[0] !== '_') return false;
      if (dirName === '_covers' || dirName === '_albums') return false;
      return true;
    });

    const hasGoodFiles = files.length === 0 ? true : (files.length === 1 && files[0].split('/').pop() === '.DS_Store');

    assert(dirs.length >= 1, 'should have dirs');
    assert(!hasBadDirs, 'can only contain song, _covers/_albums dirs');
    assert(hasGoodFiles, 'should not have files or at least only have .DS_Store');
  });
}());

// _albums dirs
(function init() {
  const albumsDirs = getChildDirs(path.join(mediaPath, '_artists'), { recursive: true })
    .filter(el => el.split('/').pop() === '_albums');

  albumsDirs.forEach(el => {
    const dirs = getChildDirs(el);
    const files = getChildFiles(el);
    const hasBadDirs = dirs.some(el => el.split('/').pop()[0] === '_');
    const hasGoodFiles = files.length === 0 ? true : (files.length === 1 && files[0].split('/').pop() === '.DS_Store');

    assert(!hasBadDirs, 'can only contain album dirs');
    assert(hasGoodFiles, 'should not have files or at least only have .DS_Store');
  });
}());

// album dirs
(function init() {
  const albumsDirs = getChildDirs(path.join(mediaPath, '_artists'), { recursive: true })
    .filter(el => el.split('/').pop() === '_albums');

  albumsDirs.forEach(el => {
    const dirs = getChildDirs(el);

    dirs.forEach(el => {
      const dirs = getChildDirs(el);
      const files = getChildFiles(el);
      const hasBadDirs = dirs.some(el => {
        const dirName = el.split('/').pop();
        if (dirName[0] !== '_') return false;
        if (dirName === '_covers') return false;
        return true;
      });
      const hasGoodFiles = files.length === 0 ? true : (files.length === 1 && files[0].split('/').pop() === '.DS_Store');

      assert(!hasBadDirs, 'can only contain _covers dir and song dirs');
      assert(hasGoodFiles, 'should not have files or at least only have .DS_Store');
    });
  });
}());

// song dirs
(function init() {
  const songDirs = getChildDirs(mediaPath, { recursive: true })
    .filter(el => {
      const dirEls = el.split('/');
      const dirName = dirEls[dirEls.length - 1];
      const dirParentName = dirEls[dirEls.length - 2];

      if (dirName[0] === '_') return false;
      if (dirParentName === '_albums' || dirParentName === '_artists') return false;
      return true;
    });

  songDirs.forEach(el => {
    const dirs = getChildDirs(el);
    const files = getChildFiles(el).map(el => el.split('/').pop());

    const mediaFilesCount = files
      .filter(el => (el === '_file.mp3' || el === '_file.m4a')).length;

    const hasBadDirs = dirs.some(el => el.split('/').pop() !== '_covers');

    const hasBadFiles = files.some(name => {
      if (name === '_file.mp3' || name === '_file.m4a') {
        return false;
      }

      if (name === 'revisedBestAudio' ||
          name === '_lyrics.txt' ||
          name === '.DS_Store') {
        return false;
      }
      return true;
    });

    assert.equal(mediaFilesCount, 1, 'must contain 1 _file.[mp3|m4a]');
    assert(!hasBadFiles, 'can contain 1 _lyrics.txt file, can contain .DS_Store file');
    assert(!hasBadDirs, 'can only contain _covers dir');
  });
}());

// cover dirs
(function init() {
  const coverDirs = getChildDirs(mediaPath, { recursive: true })
    .filter(el => el.split('/').pop() === '_covers');

  coverDirs.forEach(el => {
    const dirs = getChildDirs(el);
    const files = getChildFiles(el).map(el => el.split('/').pop()).filter(el => el !== '.DS_Store');

    const hasBadFiles = files.some(el => !(/\.jpg$/.test(el)));
    assert(dirs.length === 0, 'must not contain dirs');
    assert(!hasBadFiles, 'must have 1 or more jpg files and can contain .DS_Store');
  });
}());
