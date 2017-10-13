const express = require('express')
const path = require('path')

const user = require('./user')

/**
 * Expose
 */

module.exports = app => {
  app.use('/api/user', user)
  app.use(express.static(path.resolve(__dirname, '../../', 'client', 'build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build/', 'index.html'))
  })
}
