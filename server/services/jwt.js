const jwt = require('jsonwebtoken')
const { options } = require('../config/passport/jwtStrategy')

function sign(payload) {
  return jwt.sign(payload, options.secretOrKey)
}

module.exports = {
  sign
}
