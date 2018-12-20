// kleros-bid-bot@kleros-bid-bot.iam.gserviceaccount.com
const db = require('../models')
const Web3 = require('web3')
const ZeroClientProvider = require('web3-provider-engine/zero')
const axios = require('axios')
// const sgMail = require('@sendgrid/mail')

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
      rpcUrl: 'https://kovan.infura.io'
    })
    this.web3 = new Web3(this.web3Provider)
    // instantiate contract
    this.contractInstance = new this.web3.eth.Contract(this.contractABI, this.contractAddress)
    // last block checked
    this.lastBlock = 0
    // setup sendgrid
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // sgMail.setSubstitutionWrappers('{{', '}}')
  }

  async _init() {
    console.log("IN BOT INIT")
    // get last processed block
    const contractData = await db.Contracts.findOne({
      where: {'address': this.contractAddress}
    })
    this.lastBlock = contractData.lastBlock
    console.log(this.lastBlock)
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
  }

  stop() {
    // will not stop child processes
    this.cycle_stop = true
    clearTimeout(this.timer)
  }

  async fetchEventsCycle() {
    this.timer = setTimeout(async () => {
      await this.checkForEvents()

      if (!this.cycle_stop) this.fetchEventsCycle()
      else this.running = false
    }, 15 * 1000) // every 15 seconds check for new events
  }

  async updateWebhooks(eventWebhooks) {
    // stop bot so there is no race conditions
    this.stop()
    // set new webhook callbacks
    this.eventWebhooks = eventWebhooks
    // restart
    return this.start()
  }

  async checkForEvents() {
    console.log("checking for events")
    const nextBlock = this.lastBlock + 1
    const lastBlock = await new Promise(
      (reject, resolve) =>
        this.web3.eth.getBlockNumber((result, err) => {
          if (err) reject(err)
          resolve(result)
        })
      )
    console.log(`range: ${nextBlock} - ${lastBlock}`)
    // check for new bid events
    if (nextBlock <= lastBlock) {
      const events = await this.contractInstance.getPastEvents(
        'allEvents',
        {
          fromBlock: nextBlock,
          toBlock: lastBlock
        }
      )
      console.log(events.length)
      await Promise.all(events.map(async event => {
        console.log("found event!")
        console.log(event.event)
        const callbacks = this.eventWebhooks[event.event] || []
        await Promise.all(callbacks.map(uri => this.sendCallback(event, uri)))
      }))

      console.log("updating")
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
    return axios.post(callbackUri, event)
  }
}

module.exports = EventForwarder
