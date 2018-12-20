'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Listeners', {
      eventName: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      projectId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Projects',
          key: 'projectId'
        },
        primaryKey: true
      },
      contractAddress: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Contracts',
          key: 'address'
        },
        primaryKey: true
      },
      callback: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Listeners');
  }
};
