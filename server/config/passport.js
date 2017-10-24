const { strategy } = require('./passport/jwtStrategy')

module.exports = passport => {
	passport.use(strategy)
}
