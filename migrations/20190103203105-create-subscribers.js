'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Subscribers', {
      contractAddress: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Contracts',
          key: 'address'
        },
        primaryKey: true
      },
      eventName: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Listeners',
          key: 'eventName'
        },
        primaryKey: true
      },
      callback: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Listeners',
          key: 'callback'
        },
        primaryKey: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
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
    return queryInterface.dropTable('Subscribers');
  }
};
