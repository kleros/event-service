const db = require('../models')

const newCallback = async (listenerID, callbackURI) => {
  const item = await db.Callbacks.create({
      listenerID,
      callback: callbackURI
  })

  // start listener
  // try {
  //   const app = require('../index')
  //   await app.get('botFactory').startBot(item.id)
  // } catch (err) {
  //   console.log(err)
  // }

  return item
}

module.exports = {
  newCallback,
}
