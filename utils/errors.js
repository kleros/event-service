module.exports.getSQLErrorMessage = err => {
  switch (err.name) {
    case "SequelizeUniqueConstraintError":
      return "Item already exists."
    case "SequelizeForeignKeyConstraintError":
      return "Missing Foreign Key. Are you sure you contract and/or project have been created?"
    default:
      return `There was an error interacting with the database: ${err}`
  }
}
