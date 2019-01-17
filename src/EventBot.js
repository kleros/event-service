// kleros-bid-bot@kleros-bid-bot.iam.gserviceaccount.com
const db = require('../models')
const Web3 = require('web3')
const ZeroClientProvider = require('web3-provider-engine/zero')
const axios = require('axios')

/** This will watch for events that have not been processed yet and send a webhook
*/
class EventForwarder {
  constructor(
    contractAddress,
    contractABI,
    eventWebhooks
  ) {
    this.contractAddress = contractAddress
    this.contractABI = contractABI
    this.eventWebhooks = eventWebhooks
    // this.emailLookupEndpoint = emailLookupEndpoint // FIXME needed?
    // timing params
    this.running = false
    this.cycleStop = false
    this.timer
    // web3
    this.web3Provider = ZeroClientProvider({
      rpcUrl: process.env.PROVIDER_URI
    })
    this.web3 = new Web3(this.web3Provider)
    // instantiate contract
    this.contractInstance = new this.web3.eth.Contract(this.contractABI, this.contractAddress)
    // last block checked
    this.lastBlock = 0
  }

  async _init() {
    // get last processed block
    const contractData = await db.Contracts.findOne({
      where: {'address': this.contractAddress}
    })
    this.lastBlock = contractData.lastBlock
  }

  /** Entry Point
  */
  async start() {
    await this._init()
    // start cycle
    this.checkForEvents()
    // run on a cycle to keep alive
    this.fetchEventsCycle()
    this.running = true
    this.cycle_stop = false
  }

  stop() {
    // will not stop child processes
    this.running = false
    this.cycle_stop = true
    clearTimeout(this.timer)
  }

  async fetchEventsCycle() {
    this.timer = setTimeout(async () => {
      try {
        await this.checkForEvents()

        if (!this.cycle_stop) this.fetchEventsCycle()
      } catch (err) {
        console.error(err)
        running = false
      }
    }, 15 * 1000) // every 15 seconds check for new events
  }

  async updateWebhooks(eventWebhooks) {
    // set new webhook callbacks
    this.eventWebhooks = eventWebhooks
  }

  async checkForEvents() {
    const nextBlock = this.lastBlock + 1
    const lastBlock = await new Promise(
      (reject, resolve) =>
        this.web3.eth.getBlockNumber((result, err) => {
          if (err) reject(err)
          resolve(result)
        })
      )

    // check for new bid events
    if (nextBlock <= lastBlock) {
      const events = await this.contractInstance.getPastEvents(
        'allEvents',
        {
          fromBlock: nextBlock,
          toBlock: lastBlock
        }
      )

      await Promise.all(events.map(async event => {
        const callbacks = this.eventWebhooks[event.event] || []
        try {
          await Promise.all(callbacks.map(uri => this.sendCallback(event, uri)))
        } catch (err) {
          console.error(err)
        }
      }))

      // update last block in db
      await db.Contracts.update({'lastBlock': lastBlock}, {
        where: {
          address: this.contractAddress
        }
      })
      this.lastBlock = lastBlock
    }
  }

  async sendCallback(event, callbackUri) {
    const response = await axios.post(callbackUri, event)
    if (process.env.NODE_ENV == 'development')
      console.log(response.data)
    if (!response.data.sent) {
      console.log(response.data.reason)
    }
  }
}

module.exports = EventForwarder
