'use strict';
module.exports = (sequelize, DataTypes) => {
  const Callbacks = sequelize.define('Callbacks', {
    listenerID: DataTypes.INTEGER,
    callback: DataTypes.STRING
  }, {});
  Callbacks.associate = function(models) {
    // associations can be defined here
  };
  return Callbacks;
};
