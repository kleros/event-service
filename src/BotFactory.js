const db = require('../models')
const EmailBot = require('./EmailBot')

class BotFactory {
  constructor() {
    this.instantiated = false
    this.activeBots = []
    this.contractIndexes = {}
  }

  async start() {
    console.log("start")
    const contracts = await db.Contracts.findAll({
      attributes: ['address']
    })

    contracts.map(contract => {
      this.startBot(contract.address)
    })
  }

  async startBot(contractAddress) {
    console.log("BotFactory -- Start")
    // find all unique events for contract
    const listeners = await db.Listeners.findAll({
      attributes: ['eventName', 'callback'],
      where: {
        contractAddress
      }
    })
    console.log(listeners.length)

    const eventWebhooks = {}
    await Promise.all(listeners.map(listener => {
      // add array for
      if (!eventWebhooks[listener.eventName]) eventWebhooks[listener.eventName] = []
      eventWebhooks[listener.eventName].push(listener.callback)
    }))
    console.log(eventWebhooks)

    const botIndex = this.contractIndexes[contractAddress]
    if (botIndex) {
      const activeBot = this.activeBots[botIndex]
      await activeBot.updateWebhooks(eventWebhooks)
    } else {
      const abi = (await db.Contracts.findOne({
        where: {
          address: contractAddress
        }
      })).abi
      const newBot = new EmailBot(contractAddress, abi, eventWebhooks)
      newBot.start()
      const newIndex = this.activeBots.push(newBot) - 1
      this.contractIndexes[contractAddress] = newIndex
    }
  }

  // stopBot = async (contractAddress) => {}
}

module.exports = BotFactory
