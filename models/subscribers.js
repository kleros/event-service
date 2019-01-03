'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscribers = sequelize.define('Subscribers', {
    contractAddress: {
      type: DataTypes.STRING,
      references: 'Contracts',
      referencesKey: 'address',
      primaryKey: true
    },
    eventName: {
      type: DataTypes.STRING,
      references: 'Listeners',
      referencesKey: 'eventName',
      primaryKey: true
    },
    callback: {
      type: DataTypes.STRING,
      references: 'Listeners',
      referencesKey: 'callback',
      primaryKey: true
    }
    address: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {});
  Subscribers.associate = function(models) {
    // associations can be defined here
  };
  return Subscribers;
};
