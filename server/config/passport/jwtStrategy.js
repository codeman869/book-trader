const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../../models/user')

let options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTKey || 'catsareawesome'
}

const strategy = new JwtStrategy(options, async (jwt_payload, done) => {
  const { username } = jwt_payload
  let user

  try {
    user = await User.findOne({
      where: {
        username
      }
    })
  } catch (e) {
    return done(e)
  }

  if (!user) return null, null

  return null, user
})

module.exports = {
  strategy,
  options
}
