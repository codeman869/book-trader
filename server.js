const express = require('express')
const path = require('path')
const fs = require('fs')
const passport = require('passport')

const db = require('./server/db')
const setUpRoutes = require('./server/routes')
const setUpExpress = require('./server/config/express')
const setUpPassport = require('./server/config/passport')

const port =
  process.env.NODE_ENV != 'production' ? 3000 : process.env.PORT || 8080

const app = express()

// Set up passport
setUpPassport(passport)
app.use(passport.initialize())

// Set up express
setUpExpress(app)

// Set up routes
setUpRoutes(app)

//bootstrap models
const modelDir = path.join(__dirname, 'server', 'models')
fs
  .readdirSync(modelDir)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(path.join(modelDir, file)))

//create tables
db.sync()

app.listen(port, () => console.log(`Server running on port ${port}`))

module.exports = app
