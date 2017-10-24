const Sequelize = require('sequelize')

let dbconfig = process.env.DATABASE_URL

const sequelize = new Sequelize(dbconfig)

//test database config
;(async () => {
	try {
		await sequelize.authenticate()
/* eslint-disable */
		console.log('Database Connection established successfully')
	} catch (err) {
		console.warn('Unable to establish database connection: ', err)
		/* eslint-enable */
	}
})()

/**
 * Expose
 */

module.exports = sequelize
