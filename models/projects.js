module.exports = (sequelize, DataTypes) => {
  const Projects = sequelize.define('Projects', {
    projectId: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    }
  }, {})
  Projects.associate = function(models) {
    // associations can be defined here
  }
  return Projects
}
