const path = require('path');

const mediaDir = path.join('/Users/erwin/Music', 'music-player-files/_media');

const pageStyles = `
  <style>
    body { font-size: 14px; }
    body { background-color: #000; color: #ddd; font-family: 'Helvetica Neue', Helvetica, Arial; }
    a { color: #ff7b9e; text-decoration: none; }

    button {
      background: #3d8a5a;
      color: #fff;
      cursor: pointer;
      font-family: Helvetica Neue;
      border: 0;
      border-radius: 5px;
      padding: 8px;
    }

    button.is-delete { background: #962638; }

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

module.exports = {
  mediaDir,
  getSpanTagForSong,
  pageStyles,
  getSongFolderInfo(songKeyname) {
    const keynames = songKeyname.split('.');
    const keynamesLength = keynames.length;
    let songpath;
    if (keynamesLength === 1) songpath = keynames[0];
    else if (keynamesLength === 2) songpath = `_artists/${keynames[0]}/${keynames[1]}`;
    else if (keynamesLength === 3) songpath = `_artists/${keynames[0]}/_albums/${keynames[1]}/${keynames[2]}`;

    return {
      path: path.join(mediaDir, songpath),
      independentKeyname: keynames[keynamesLength - 1]
    };
  },

  getUlListHtmlForAllSongs(songs, options = {}) {
    return `
      <h1>All Songs</h1>
      <ul>
        ${songs.map(el => `
          <li>
            ${getSpanTagForSong(el)}
            ${options.playlist ? getRepeatedSpanTagForPlaylist(el, options.playlist.addedSongs) : ''}
            ${options.playlist ?
              `<form style='display: inline-block; margin: 0' method='post'>
                <input name='method' value='post' hidden=true />
                <input name='songId' value=${el.song_id} hidden=true />
                <button>Add to Playlist</button>
              </form>`
              :
              ''
            }
          </li>
        `).join('')}
      </ul>
    `;
  }
};
