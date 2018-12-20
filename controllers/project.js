const db = require('../models')

const newProject = async (name) => db.Projects.create({name})

const getProject = async (name) => db.Projects.findOne({where: {name}})

const getProjects = async (req, res) => db.Projects.findAll()

module.exports = {
  newProject,
  getProject,
  getProjects
}
