const express = require('express')
const path = require('path')

const setUpRoutes = require('./server/routes')

const port =
  process.env.NODE_ENV != 'production' ? 3000 : process.env.PORT || 8080

const app = express()

setUpRoutes(app)

/*
app.get('/api', (req, res) => {
  console.log('API Request')
  res.set('Content-Type', 'application/json')
  res.json({ message: 'Successful' })
})
*/

app.listen(port, () => console.log(`Server running on port ${port}`))

module.exports = app
