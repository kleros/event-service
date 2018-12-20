module.exports = (sequelize, DataTypes) => {
  const Listeners = sequelize.define('Listeners', {
    projectId: {
      type: DataTypes.INTEGER,
      references: 'Projects',
      referencesKey: 'projectId',
      primaryKey: true
    },
    contractAddress: {
      type: DataTypes.STRING,
      references: 'Contracts',
      referencesKey: 'address',
      primaryKey: true
    },
    eventName: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    callback: DataTypes.STRING
  }, {})
  Listeners.associate = function(models) {}
  return Listeners
}
