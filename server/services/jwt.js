const jwt = require('jsonwebtoken')

const { options } = require('../config/passport/jwtStrategy')

function sign(payload) {
	return jwt.sign(payload, options.secretOrKey, {
		expiresIn: '2 days'
	})
}

module.exports = {
	sign
}
