const express = require('express')
const controllers = require('../controllers')
const getSQLErrorMessage = require('../utils/errors').getSQLErrorMessage

const router = express.Router()

/*********************************************
*                Projects                    *
**********************************************/

router.post('/projects/:name', async (req, res) => {
  if (req.params.name == null) return res.status(400).send(
    'Parameter "name" required'
  )

  try {
    const newProject = await controllers.project.newProject(req.params.name)
    res.status(201).json(newProject)
  } catch (err) {
    res.status(500).send(getSQLErrorMessage(err))
  }
})

router.get('/projects/:name', async (req, res) => {
  if (req.params.name == null) return res.status(400).send(
    'Parameter "name" required'
  )

  const project = await controllers.project.getProject(req.params.name)
  res.status(200).json(project)
})

router.get('/projects', async (req, res) => {
  const projects = await controllers.project.getProjects()
  res.status(200).json(projects)
})

/*********************************************
*                Contracts                   *
**********************************************/

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

router.get('/contracts', async (req, res) => {
  try {
    const addresses = await controllers.contract.getContractAddresses()
    res.status(200).json(addresses)
  } catch (err) {
    res.status(500).send(getSQLErrorMessage(err))
  }
})

/*********************************************
*                Listeners                   *
**********************************************/

router.post('/contracts/:address/listeners/:eventName', async (req, res) => {
  if (req.body.callback == null) return res.status(400).send(
    'Parameter "callback" required'
  )

  try {
    const listener = await controllers.listener.newListener(
      req.params.projectId,
      req.params.address,
      req.params.eventName,
      req.body.callback
    )
    res.status(201).json(listener)
  } catch (err) {
    res.status(500).send(getSQLErrorMessage(err))
  }

})

router.get('/contracts/:address/listeners/:eventName', async (req, res) => {
  try {
    const listener = await controllers.listener.getListener(
      req.params.projectId,
      req.params.address,
      req.params.eventName
    )
    res.status(200).json(listener)
  } catch (err) {
    res.status(500).send(getSQLErrorMessage(err))
  }
})

router.delete('/contracts/:address/listeners/:eventName', async (req, res) => {
  try {
    await controllers.listener.deleteListener(
      req.params.projectId,
      req.params.address,
      req.params.eventName
    )
    res.status(202).send()
  } catch (err) {
    res.status(500).send(getSQLErrorMessage(err))
  }
})

module.exports = router
