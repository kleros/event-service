const db = require('../models')

const newListener = async (address, eventName) => {
  const item = await db.Listeners.create({
      contractAddress: address,
      eventName
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

const getListener = async (address, eventName) => db.Listeners.findOne({
    where: {
      contractAddress: address,
      eventName
    }
  })

const getListenersForContract = async (address) => {
  const events = await db.Listeners.findAll({
    where: {
      contractAddress: address
    }
  })

  return await Promise.all(events.map(async event => {
    const callbacks = await db.Callbacks.findAll({
      where: {
        listenerID: event.id
      }
    })

    const callbackURI = await Promise.all(callbacks.map(callback => callback.callback))

    return {
      [event.eventName]: callbackURI
    }
  }))
}

const getListenersForContractByCallbackURI = async (address) => {
  const events = await db.Listeners.findAll({
    where: {
      contractAddress: address
    }
  })

  return await Promise.all(events.map(async event => {
    const callbacks = await db.Callbacks.findAll({
      where: {
        listenerID: event.id
      }
    })

    const callbackURI = await Promise.all(callbacks.map(callback => callback.callback))

    return {
      [event.eventName]: callbackURI
    }
  }))
}

const deleteCallback = async (address, eventName, callbackURI) => {
  const listener = await getListener(address, eventName)

  return db.Callbacks.destroy({
    where: {
      listenerID: listener.id,
      callback: callbackURI
    }
  })
}

module.exports = {
  newListener,
  getListener,
  deleteCallback
}
