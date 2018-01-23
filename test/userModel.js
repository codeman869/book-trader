/* global describe
   global it
   global beforeEach
*/
const chai = require('chai')

const db = require('../server/db')
const User = require('../server/models/user')

const { username, password, email } = require('./userRoutes')

const testUsername = `${username}1`
const testEmail = 'noreplytest@example.com'

const should = chai.should()

describe('User Model Tests', function() {
	beforeEach(async function() {
		await db.query(
			`DELETE FROM users WHERE "username" = '${testUsername}' OR "email" = '${testEmail}'`
		)
	})

	it('Should not store clear text passwords', async function() {
		let newUser = new User()
		const password = 'password1234'

		newUser.username = testUsername
		newUser.email = testEmail
		newUser.hashedPassword = password

		await newUser.save()

		newUser.hashedPassword.should.not.equal(password)
	})

	it('Should not allow duplicate usernames', async function() {
		let newUser = new User()
		newUser.username = username
		newUser.hashedPassword = password
		newUser.email = testEmail
		var error

		try {
			await newUser.save()
		} catch (e) {
			error = e
		}

		should.exist(error)
		error.should.include({ name: 'SequelizeUniqueConstraintError' })
	})

	it('Should not allow duplicate email addresses', async function() {
		let newUser = new User()
		newUser.username = testUsername
		newUser.hashedPassword = password
		newUser.email = email
		var error

		try {
			await newUser.save()
		} catch (e) {
			error = e
		}

		should.exist(error)
		error.should.include({ name: 'SequelizeUniqueConstraintError' })
	})

	it('Should default to a nonverified status and have a verification token', async function() {
		let newUser = new User()
		newUser.username = testUsername
		newUser.hashedPassword = password
		newUser.email = testEmail

		await newUser.save()

		newUser = await User.find({ where: { username: testUsername } })

		newUser.verified.should.be.false
		newUser.verifyToken.should.exist
	})

	it('Should generate a unique password reset token', async function() {
		let user = await User.find({ where: { username } })

		await user.forgotPassword()

		user.forgotPWToken.should.exist
	})
})
