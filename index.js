const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const router = require('./routes')
const BotFactory = require('./src/BotFactory')
// This will be our application entry. We'll setup our server here.
const http = require('http')
// Set up the express app
const app = express()
// Log requests to the console.
app.use(logger('dev'))
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// Routes
app.use(router)
// Setup a default catch-all route that sends back a welcome message in JSON format.
const port = parseInt(process.env.PORT, 10) || 8000
app.set('port', port)
const server = http.createServer(app)
server.listen(port)

// set up Bot factory
const botFactory = new BotFactory()
// botFactory.start()
app.set('botFactory', botFactory)
module.exports = app
