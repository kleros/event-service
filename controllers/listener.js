const db = require('../models')

const newListener = async (projectId, address, eventName, callback) => {
  const item = await db.Listeners.create({
      projectId,
      contractAddress: address,
      eventName,
      callback
  })

  // start listener
  try {
    const app = require('../index')
    await app.get('botFactory').startBot(address)
  } catch (err) {
    console.log(err)
  }

  return item
}

const getListener = async (projectId, address, eventName) => db.Listeners.findOne({
    where: {
      projectId,
      contractAddress: address,
      eventName
    }
  })

const deleteListener = async (projectId, address, eventName) => {
  const items = await db.Listeners.destroy({
    where: {
      projectId,
      contractAddress: address,
      eventName
    }
  })

  // restart listener
  return true
}

module.exports = {
  newListener,
  getListener,
  deleteListener
}
