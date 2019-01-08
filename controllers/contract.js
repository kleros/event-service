const db = require('../models')

const newContract = async (address, abi, lastBlock = 0) => {
  if (abi instanceof Array)
    abi = JSON.stringify(abi)

  return db.Contracts.create(
    {
      address,
      abi,
      lastBlock
    }
  )
}

const getContract = async (address) => db.Contracts.findOne({
    where: {
      address
    }
  })

const getContractAddresses = async () => db.Contracts.findAll({
  attributes: ['address']
})

module.exports = {
  newContract,
  getContract,
  getContractAddresses
}
