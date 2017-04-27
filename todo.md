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
    - songs endpoints also need to return the artist/album info
  - relationships should be defined by the folder structure

# TODO
  - create endpoints to:
    - add songs to playlist
  - create endpoints to:
    - /play/playlist/:id
  - create a simple web form to add songs to playlists
  - make backups when updating the DB
  - should allow a _info.json file inside songs/artists/albums to allow custom names

- current playlist modal ios app
- add cover
- download music to local
- remote player controls
  - fix remote slider
  - fix next song not playing automatically in background. (Posible solution is to use AVQueuePlayer)
- shuffle and repeat music should be outside the player

# NOTES
- the player should only concern about playing the playlist, showing the song ifno
  and no more  (no shuffle functionality, add music to playlist, etc)

- gonna rely on a local server to serve the music files since i can't find a free good
  solution for cloud storage for static files
- https://profreehost.com/account/
  pass: iknowwhichismyname

# DONE
- show the name of the song in the player
