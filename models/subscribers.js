'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscribers = sequelize.define('Subscribers', {
    callbackID: DataTypes.INTEGER,
    address: DataTypes.STRING
  }, {});
  Subscribers.associate = function(models) {
    // associations can be defined here
  };
  return Subscribers;
};