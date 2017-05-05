const path = require('path');
const fs = require('fs');

const mediaDir = path.join('/Users/erwin/Music', 'music-player-files/_media');

const keynameSeparator = '~';
const songPossibleExtensions = ['m4a', 'mp3'];

const pageStyles = `
  <style>
    body { font-size: 14px; }
    body { background-color: #000; color: #ddd; font-family: 'Helvetica Neue', Helvetica, Arial; }
    a { color: #ff7b9e; text-decoration: none; }

    .button {
      background: #3d8a5a;
      border-radius: 5px;
      border: 0;
      color: #fff;
      cursor: pointer;
      font-family: Helvetica Neue;
      font-size: 11px;
      display: inline-block;
      line-height: 1;
      padding: 9px 9px;
    }

    .button.is-delete { background: #962638; }
    .button.is-play { background: #737225; }

    input { border-radius: 4px; border: 0; height: 26px; padding: 10px; }

    li { padding: 2px; }
    li:hover { background-color: #222; }

    .secondary-color { color: #8b8bff; }
    .no-songs { font-style: italic; color: #aaa; }
  </style>
`;

function getSpanTagForSong(song) {
  const artistName =
    song.artist_name ? ` - <span class='secondary-color'>${song.artist_name}</span>` : '';

  return `<span>${song.song_name}${artistName}</span>`;
}

function getRepeatedSpanTagForPlaylist(song, playlistSongs) {
  const repeated = playlistSongs.filter(el => el.song_id === song.song_id);
  const repeatedLength = repeated.length;
  if (!repeatedLength) return '';
  const timeLabel = repeatedLength === 1 ? 'time' : 'times';
  return `
    <span style='font-size: 12px; color: #888'>
      (Added ${repeatedLength} ${timeLabel})
    </span>
  `;
}

function getSongFolderInfo(songKeyname) {
  const keynames = songKeyname.split(keynameSeparator);
  const keynamesLength = keynames.length;
  let songpath;
  if (keynamesLength === 1) songpath = keynames[0];
  else if (keynamesLength === 2) songpath = `_artists/${keynames[0]}/${keynames[1]}`;
  else if (keynamesLength === 3) songpath = `_artists/${keynames[0]}/_albums/${keynames[1]}/${keynames[2]}`;

  return {
    path: path.join(mediaDir, songpath),
    independentKeyname: keynames[keynamesLength - 1]
  };
}

function fileExists(path) {
  try {
    return fs.statSync(path).isFile();
  } catch (err) {
    return false;
  }
}

function getParsedInfoSongWithSongKeyname(songKeyname) {
  const songFolderInfo = getSongFolderInfo(songKeyname);

  return songPossibleExtensions.reduce((result, ext) => {
    if (result) return result;

    const songPath = path.join(songFolderInfo.path, `file.${ext}`);

    if (!fileExists(songPath)) return result;
    const songPathInfo = path.parse(songPath);

    return {
      fileDir: path.join(songPathInfo.dir, songPathInfo.base),
      fileName: songFolderInfo.independentKeyname,
      ext: songPathInfo.ext
    };
  }, null);
}

function getUlListHtmlForAllSongs(songs, options = {}) {
  return `
    <h1>${options.title || 'All Songs'}</h1>
    <ul>
      ${!songs.length ?
        '<li><span class="no-songs">No Songs found</span></li>' :
        songs.map(el => `
          <li>
            ${getSpanTagForSong(el)}
            ${options.playlist ? getRepeatedSpanTagForPlaylist(el, options.playlist.addedSongs) : ''}
            <a class='button is-play' href='/songs/play/${el.song_id}'>Play song</a>
            ${!options.playlist ? '' :
              `<form style='display: inline-block; margin: 0' method='post'>
                <input name='method' value='post' hidden=true />
                <input name='songId' value=${el.song_id} hidden=true />
                <button class='button'>Add to Playlist</button>
              </form>`
            }
            ${!options.removePlaylist ? '' :
              `<form style='display: inline-block; margin: 0' method='post'>
                  <input name='method' value='delete' hidden=true />
                  <input name='songId' value=${el.song_id} hidden=true />
                  <button class='button is-delete'>Remove From Playlist</button>
                </form>`
            }
          </li>
        `).join('')
      }
    </ul>
  `;
}

module.exports = {
  keynameSeparator,
  mediaDir,
  getSpanTagForSong,
  pageStyles,
  getSongFolderInfo,
  getParsedInfoSongWithSongKeyname,
  getUlListHtmlForAllSongs
};
