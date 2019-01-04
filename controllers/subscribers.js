const db = require('../models')

const newSubscriber = async (callbackID, address) => {
  const item = await db.Subscribers.create({
      callbackID,
      address
  })

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
