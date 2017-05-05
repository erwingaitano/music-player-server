
# TODO
- verify that the folders are in a consistent state (this probably should be a test)
- should allow adding genres to songs
- should allow a _info.json file inside songs/artists/albums to allow:
  - custom names
  - start/end song
  - volume (seems hard to do)
- should allow a _lyrics file for obvious reasons

# NOTES
- gonna rely on a local server to serve the music files since i can't find a good free one
  solution for cloud storage for static files.
  (Actually no, all the devices that wants to play, need to have the files save locally)
- https://profreehost.com/account/
  pass: iknowwhichismyname

# DONE
- response should be in alphabetical order
- allow rename playlists
- dont allow folder/filenames with a dot in their name
  (actually now the keynameSeparator is ~ so we can use dots again!)

- dismiss songs modal
- change db structure to be:
  - artists:
    - can have 0 or more albums
  - albums:
    - can have 0 or more songs
    - belongs to 1 artist
  - songs:
    - belongs to 0 or 1 album
    - belongs to 0 or 1 artist
    - cant belong to an album and artist at the same time
- update db should also verify there are no corrupted entries in the DB
  for example when u move a song folder from one album to another, and u run
  the update script, the song moved will have a new entry in the database with the
  a new keyname but the previous entry of that song will be left in the DB and needs
  to be removed
  - playlist table
    - it can have 0 or more songs
  - rename api endpoints to api/**
  - create api endpoints to:
    - /artists
    - /playlists
    - /playlists/:id/songs
    - /artists/:id/songs
    - /artists/:id/albums
    - /artists/:id/albums/:id/songs
    - /play/playlist
    - /play/songs
    - songs endpoints also need to return the artist/album info
  - relationships should be defined by the folder structure
  - create a simple web form to add songs to playlists
  - endpoint to add songs to playlist
  - make backups when updating the DB
- add cover

