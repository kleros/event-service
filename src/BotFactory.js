const db = require('../models')
const EventBot = require('./EventBot')

class BotFactory {
  constructor() {
    this.instantiated = false
    this.activeBots = []
    this.contractIndexes = {}
  }

  async start() {
    const contracts = await db.Contracts.findAll({
      attributes: ['address']
    })

    contracts.map(contract => {
      this.startListening(contract.address)
    })
  }

  async startListening(contractAddress) {
    let listenerCallbacks = {}

    // find all unique events for contract
    const listeners = await db.Listeners.findAll({
      attributes: ['id', 'eventName'],
      where: {
        contractAddress
      }
    })

    await Promise.all(listeners.map(async listener => {
      const callbacks = await db.Callbacks.findAll({
        attributes: ['callback'],
        where: {
          listenerID: listener.id
        }
      })

      const callbackURIs = await Promise.all(
        callbacks.map(
          callback => callback.callback
        )
      )

      if (callbacks.length > 0) {
        listenerCallbacks[listener.eventName] = callbackURIs
      }
    }))
    const activeCallbacks = (Object.keys(listenerCallbacks).length > 0)
    // if there are no active callbacks for contract no need to listen

    const botIndex = this.contractIndexes[contractAddress]
    if (botIndex) {
      const activeBot = this.activeBots[botIndex]
      if (!activeCallbacks) {
        // stop bot if there are no active callbacks
        activeBot.stop()
      } else {
        // update webhooks
        await activeBot.updateWebhooks(listenerCallbacks)
        if (!activeBot.running)
          activeBot.start()
      }
    } else {
      const abi = (await db.Contracts.findOne({
        where: {
          address: contractAddress
        }
      })).abi

      const newBot = new EventBot(contractAddress, JSON.parse(abi), listenerCallbacks)
      const newIndex = this.activeBots.push(newBot) - 1
      this.contractIndexes[contractAddress] = newIndex

      // start bot if there are active callbacks
      if (activeCallbacks)
        newBot.start()
    }
  }
}

module.exports = BotFactory
