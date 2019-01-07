'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contracts = sequelize.define('Contracts', {
    address: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    abi: DataTypes.STRING,
    lastBlock: DataTypes.INTEGER
  }, {});
  Contracts.associate = function(models) {
    // associations can be defined here
  };
  return Contracts;
};
