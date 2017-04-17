module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Song', 'dirpath', {
      allowNull: false,
      type: Sequelize.STRING
    })
    .then(() =>
      queryInterface.sequelize.query(`
        UPDATE Song
        SET dirpath = name;
      `)
    )
    .then(() =>
      queryInterface.addIndex('Song', ['dirpath'], { indicesType: 'UNIQUE' })
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Song', 'dirpath');
  }
};
