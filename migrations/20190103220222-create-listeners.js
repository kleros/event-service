'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Listeners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contractAddress: {
        type: Sequelize.STRING,
        references: 'Contracts',
        referencesKey: 'address',
      },
      eventName: {
        type: Sequelize.STRING,
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

    queryInterface.addConstraint('Listeners', ['eventName', 'contractAddress'], {
      type: 'unique',
      name: 'contract_event_listener'
    });

    return queryInterface
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Listeners');
  }
};
