const express = require('express')
const path = require('path')

const users = require('./user')
const books = require('./books')
const trades = require('./trades')

/**
 * Expose
 */

module.exports = app => {
	app.use('/api/v1/users', users)
	app.use('/api/v1/books', books)
	app.use('/api/v1/trades', trades)
	app.use(express.static(path.resolve(__dirname, '../../', 'client', 'build')))
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../../client/build/', 'index.html'))
	})
}
