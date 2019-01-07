'use strict';
module.exports = (sequelize, DataTypes) => {
  const Listeners = sequelize.define('Listeners', {
    contractAddress: DataTypes.STRING,
    eventName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Listeners.associate = function(models) {
    // associations can be defined here
  };
  return Listeners;
};
