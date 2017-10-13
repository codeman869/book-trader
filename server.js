const express = require('express')
const path = require('path')
const fs = require('fs')

const db = require('./server/db')
const setUpRoutes = require('./server/routes')

const port =
  process.env.NODE_ENV != 'production' ? 3000 : process.env.PORT || 8080

const app = express()

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
