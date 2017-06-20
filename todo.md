```bash
$ folderStructureChecker .
```

- all custom code should be inside the most inner component folder available
- when we have shared code, we send it up to the most common inner component between those who used
  the shared code

==================

  - plan to follow
  - only do the mobile part
  - get the 2 months payed

- Front-End web developer
https://www.toptal.com/front-end/job-description

Description:
Front-End Web Developer who is motivated to combine the art of design with the art of programming. Responsibilities will include translation of the UI/UX design wireframes to actual code that will produce visual elements of the application. You will work with the UI/UX designer and bridge the gap between graphical design and technical implementation, taking an active role on both sides and defining how the application looks as well as how it works.

Skills:
  - translation of the UI/UX design wireframes (Sketch/Photoshop) to actual code that will produce visual elements of the application.
  - Proficient understanding of web markup, including HTML5, CSS3
  - CSS pre-processing platforms, such as LESS and SASS
  - Good understanding of responsive web design
  - Proficient understanding of Javascript
  - Good understanding and experience with ReactJS, asynchronous request handling, partial page updates, and AJAX
  - Good understanding of client side building tools like Webpack
  - Proficient understanding of cross-browser compatibility issues and ways to work around them.
  - Understanding of SEO principles and ensuring that application will adhere to them
  - Knowledge about versioning tools like Git
  - Basic understanding of server-side (NodeJS)
  - Computer Science eng. or similar background is a plus

- ios developer
https://www.toptal.com/ios/job-description

Description:
iOS developer responsible for the development and maintenance of applications aimed at a range of iOS mobile devices. Your primary focus will be development of iOS applications and their integration with back-end services. You will be working alongside other engineers and developers working on different layers of the infrastructure. Therefore, a commitment to collaborative problem solving, sophisticated design, and the creation of quality products is essential.

Responsibilities:
  - Design and build applications for the iOS platform
  - Ensure the performance, quality, and responsiveness of applications
  - Collaborate with a team to define, design, and ship new features
  - Identify and correct bottlenecks and fix bugs
  - Help maintain code quality, organization, and automatization

Skills:
  - Proficient with the programming language Swift, and Cocoa Touch (Objective-C is a plus)
  - Experience with iOS frameworks such as Core Data, Core Animation, etc.
  - Experience with offline storage, threading, and performance tuning
  - Familiarity with RESTful APIs to connect iOS applications to back-end services
  - Knowledge of other web technologies and UI/UX standards
  - Understanding of Apple’s design principles and interface guidelines
  - Familiarity with cloud message APIs and push notifications
  - Proficient understanding of code versioning tools such as Git
  - Familiarity with continuous integration
  - Computer Science eng. or similar background is a plus


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

