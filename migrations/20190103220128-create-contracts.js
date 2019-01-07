'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Contracts', {
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      abi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastBlock: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Contracts');
  }
};
