const morgan = require('morgan')
const bodyParser = require('body-parser')

module.exports = app => {
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('tiny'))
	}

	app.use(bodyParser.json())
}
