const db = require('../models')

const newContract = async (address, abi) => db.Contracts.create(
  {
    address,
    abi
  }
)

const getContract = async (address) => db.Contracts.findOne({address})

const getContractAddresses = async () => db.Contracts.findAll({
  attributes: ['address']
})

module.exports = {
  newContract,
  getContract,
  getContractAddresses
}
