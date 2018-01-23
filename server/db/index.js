const Sequelize = require('sequelize')

let dbconfig = process.env.DATABASE_URL
let logging = true

if (process.env.NODE_ENV === 'test') {
	dbconfig += '_test'
}

logging = process.env.NODE_ENV === 'development' ? true : false

const sequelize = new Sequelize(dbconfig, { logging })

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
