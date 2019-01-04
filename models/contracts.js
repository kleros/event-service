'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contracts = sequelize.define('Contracts', {
    address: DataTypes.STRING,
    abi: DataTypes.STRING
  }, {});
  Contracts.associate = function(models) {
    // associations can be defined here
  };
  return Contracts;
};