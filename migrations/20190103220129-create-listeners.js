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
        references: {
          model: 'Contracts',
          key: 'address'
        }
      },
      eventName: {
        type: Sequelize.STRING,
        allowNull: false
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

    return queryInterface.addConstraint('Listeners', ['eventName', 'contractAddress'], {
      type: 'unique',
      name: 'contract_event_listener'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Listeners');
  }
};
