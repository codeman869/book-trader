const express = require('express')
const path = require('path')

const users = require('./user')

/**
 * Expose
 */

module.exports = app => {
  app.use('/api/v1/users', users)
  app.use(express.static(path.resolve(__dirname, '../../', 'client', 'build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build/', 'index.html'))
  })
}
