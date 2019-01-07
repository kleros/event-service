'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Callbacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      listenerID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Listeners',
          key: 'id'
        },
      },
      callback: {
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

    return queryInterface.addConstraint('Callbacks', ['callback', 'listenerID'], {
      type: 'unique',
      name: 'listener_callback'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Callbacks');
  }
};
