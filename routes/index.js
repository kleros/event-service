const express = require('express')
const Web3 = require('web3')

const controllers = require('../controllers')
const getSQLErrorMessage = require('../utils/errors').getSQLErrorMessage

const router = express.Router()

/*********************************************
*                Contracts                   *
**********************************************/

/**
 * Add a new contract
 * @param {string} address - The contract address
 * @returns {object} The new contract address
 */
router.post('/contracts/:address', async (req, res) => {
  if (req.body.abi == null) return res.status(400).send(
    'Parameter "abi" required'
  )
  try {
    const contract = await controllers.contract.newContract(
      req.params.address,
      req.body.abi
    )
    res.status(201).json(contract)
  } catch (err) {
    res.status(500).send(getSQLErrorMessage(err))
  }
})

/**
 * Get a registered contract
 * @param {string} address - The contract address
 * @returns {object} The registed contract or null if it does not exist
 */
router.get('/contracts/:address', async (req, res) => {
  try {
    const contract = await controllers.contract.getContract(
      req.params.address
    )
    res.status(200).json(contract)
  } catch (err) {
    res.status(500).send(getSQLErrorMessage(err))
  }
})

/**
 * Get all registered contract addresses
 * @returns {string[]} Array of all registered contract addresses (ABI's omitted for brevity)
 */
router.get('/contracts', async (req, res) => {
  try {
    const addresses = await controllers.contract.getContractAddresses()
    res.status(200).json(addresses)
  } catch (err) {
    res.status(500).send(getSQLErrorMessage(err))
  }
})

/**
 * Get all listeners registered on a contract.
 * @param {string} address - The contract address.
 * @returns {object[]} - An array of objects that include the eventName, callback and callbackID of all registered listeners for a contract.
 */
router.get('/contracts/:address/listeners', async (req, res) => {
  try {
    const listener = await controllers.listener.getListenersForContract(
      req.params.address,
    )
    res.status(200).json(listener)
  } catch (err) {
    res.status(500).send(getSQLErrorMessage(err))
  }
})

/**
 * Remove a listener by callback address.
 * @param {string} address - The contract address.
 * @param {string} callbackURI - The registered callback URI.
 * @returns {null} status 202.
 */
router.delete('/contracts/:address/listeners/:eventName/callbacks', async (req, res) => {
  if (req.body.callbackURI == null) return res.status(400).send(
    'Parameter "callbackURI" required'
  )

  try {
    await controllers.listener.deleteCallback(
      req.params.address,
      req.params.eventName,
      req.body.callbackURI
    )

    // restsart/start listener
    const app = require('../index')
    await app.get('botFactory').startListening(req.params.address)

    res.status(202).send()
  } catch (err) {
    res.status(500).send(getSQLErrorMessage(err))
  }
})

/*********************************************
*                Listeners                   *
**********************************************/

/**
 * Add a new listener. You must include contractABI in the body if the contract has not been registered before.
 * @param address
 */
router.post('/contracts/:address/listeners/:eventName/callbacks', async (req, res) => {
  if (req.body.callbackURI == null) return res.status(400).send(
    'Parameter "callbackURI" required'
  )

  const contract = await controllers.contract.getContract(
    req.params.address
  )
  const contractExists = !!contract
  // If contract does not yet exist an abi is required
  if (contractExists === false && req.body.contractABI == null)
    return res.status(400).send(
      'Parameter "contractABI" required because contract has not been registered before.'
    )

  // add contract if it does not exist
  if (!contractExists) {
    // Start at current block so it doesn't bombard users for past notifications if it is an old contract
    print(process.env.PROVIDER_URI)
    const web3 = new Web3(process.env.PROVIDER_URI)
    const currentBlock = await new Promise(
      (reject, resolve) =>
        web3.eth.getBlockNumber((result, err) => {
          if (err) reject(err)
          resolve(result)
        })
      )

    try {
      await controllers.contract.newContract(
        req.params.address,
        req.body.contractABI,
        currentBlock
      )
    } catch (err) {
      return res.status(500).send(getSQLErrorMessage(err))
    }
  }

  // Add listener if it does not exist
  let listener = await controllers.listener.getListener(
    req.params.address,
    req.params.eventName
  )

  if (listener == null) {
    try {
      listener = await controllers.listener.newListener(
        req.params.address,
        req.params.eventName
      )
    } catch (err) {
      return res.status(500).send(getSQLErrorMessage(err))
    }
  }

  // Add callback if it does not exist
  let callback
  try {
    callback = await controllers.callbacks.newCallback(
      listener.id,
      req.body.callbackURI
    )
  } catch (err) {
    return res.status(500).send(getSQLErrorMessage(err))
  }

  // restsart/start listener
  const app = require('../index')
  await app.get('botFactory').startListening(req.params.address)

  return res.status(201).json({
    callbackID: callback.id,
    callbackURI: req.body.callbackURI,
    contractAddress: req.params.address,
    eventName: req.params.eventName
  })
})

module.exports = router
