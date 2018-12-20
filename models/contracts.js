module.exports = (sequelize, DataTypes) => {
  const Contracts = sequelize.define('Contracts', {
    address: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    abi: DataTypes.JSON,
    lastBlock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {})
  Contracts.associate = function(models) {
    // associations can be defined here
  }
  return Contracts
}
