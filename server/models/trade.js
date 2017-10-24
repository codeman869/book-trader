const Sequelize = require('sequelize')
const db = require('../db')

const Trade = db.define('trade', {
	finalized: Sequelize.BOOLEAN
})

/**
 * Expose
 */

module.exports = Trade
