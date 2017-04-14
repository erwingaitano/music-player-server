module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn('Song', 'filepath');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Song', 'filepath', {
      allowNull: false,
      type: Sequelize.STRING
    });
  }
};
