'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.addIndex('Song', ['name'], { indicesType: 'UNIQUE' });
  },

  down: (queryInterface) => {
    return queryInterface.removeIndex('Song', ['name']);
  }
};
