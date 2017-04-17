module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SongAuthor', {
      song_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Song', key: 'id' }
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Author', key: 'id' }
      }
    });
    // .then(() => {
    //   return queryInterface.sequelize.query(`
    //     INSERT INTO Author
    //       (name, createdAt, updatedAt)
    //     VALUES
    //       ('Keane', '2010-12-31 23:59:59', '2010-12-31 23:59:59'),
    //       ('Muse', '2010-12-31 23:59:59', '2010-12-31 23:59:59');
    //   `);
    // })
    // .then(() => {
    //   return queryInterface.sequelize.query(`
    //     INSERT INTO Song
    //       (name, filepath, createdAt, updatedAt)
    //     VALUES
    //       ('Bedshaped', '~/music/bedshaped.m4a', '2010-12-31 23:59:59', '2010-12-31 23:59:59'),
    //       ('Muscle Museum', '~/music/musclemuseum.m4a', '2010-12-31 23:59:59', '2010-12-31 23:59:59');
    //   `);
    // })
    // .then(() => {
    //   return queryInterface.sequelize.query(`
    //     INSERT INTO SongAuthor
    //       (song_id, author_id)
    //     VALUES
    //       (1, 1),
    //       (1, 2);
    //   `);
    // });
    // .then(() => {
    //   return queryInterface.sequelize.query(`
    //     ALTER TABLE SongAuthor
    //     ADD UNIQUE unique_index(song_id, author_id)
    //   `);
    // });
  },

  down: queryInterface => {
    return queryInterface.dropTable('SongAuthor');
  }
};
