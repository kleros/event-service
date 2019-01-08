const itemExistsError = "Item already exists."
const missingForeignKeyError = "Missing Foreign Key. Are you sure you contract has been created?"

module.exports.getSQLErrorMessage = err => {
  switch (err.name) {
    case "SequelizeUniqueConstraintError":
      return itemExistsError
    case "SequelizeForeignKeyConstraintError":
      return missingForeignKeyError
    default:
      return `There was an error interacting with the database: ${err}`
  }
}

module.exports.itemExistsError = itemExistsError
module.exports.missingForeignKeyError = missingForeignKeyError
