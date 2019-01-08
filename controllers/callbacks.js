const db = require('../models')

const newCallback = async (listenerID, callbackURI) => {
  const item = await db.Callbacks.create({
      listenerID,
      callback: callbackURI
  })

  return item
}

module.exports = {
  newCallback,
}
