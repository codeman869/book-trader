/* global describe
   global it
   global before
   global beforeEach
*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../server')
const db = require('../server/db')
const User = require('../server/models/user')

const should = chai.should()

const apiPrefix = '/api/v1/users'
let password = 'password1234'
let otherpassword = 'password12345'
let username = 'username'
let email = 'noreply@example.com'
let newUser = new User()
let unverifiedUser = new User()

chai.use(chaiHttp)

before(function(done) {
	setTimeout(async () => {
		await db.query('DELETE FROM users;')

		newUser.hashedPassword = password
		newUser.username = username
		newUser.email = email
		newUser.verified = true
		await newUser.save()

		unverifiedUser.username = `${username}-unverified`
		unverifiedUser.hashedPassword = password
		unverifiedUser.email = 'testemail@example.com'
		unverifiedUser.verifyToken = 'xyz'
		await unverifiedUser.save()
		done()
	}, 500)
})

beforeEach(async () => {
	await db.query(`DELETE FROM users WHERE username = '${username}1'`)
})

describe(`GET ${apiPrefix}`, function() {
	it('returns a json response of SELECT NOW();', function(done) {
		chai
			.request(server)
			.get(`${apiPrefix}`)
			.end(function(err, res) {
				should.not.exist(err)
				res.should.have.status(200)
				res.should.be.json

				done()
			})
	})
})

describe(`POST ${apiPrefix}/new`, function() {
	it("Returns status 400 if the passwords don't match", function(done) {
		chai
			.request(server)
			.post(`${apiPrefix}/new`)
			.send({
				username: `${username}1`,
				email,
				password,
				passwordConfirmation: otherpassword
			})
			.end((err, res) => {
				err.should.exist
				res.should.have.status(400)
				res.should.be.json
				done()
			})
	})

	it('Returns a status 400 if an invalid email is used', function(done) {
		chai
			.request(server)
			.post(`${apiPrefix}/new`)
			.send({
				username: `${username}1`,
				email: '1234',
				password,
				passwordConfirmation: password
			})
			.end((err, res) => {
				err.should.exist
				res.should.have.status(400)
				res.should.be.json
				done()
			})
	})

	it('Returns a status 201 if successful', function(done) {
		chai
			.request(server)
			.post(`${apiPrefix}/new`)
			.send({
				username: `${username}1`,
				email: 'test@nowhere.com',
				password,
				passwordConfirmation: password
			})
			.end((err, res) => {
				should.not.exist(err)
				res.should.have.status(201)
				done()
			})
	})
})

describe(`POST ${apiPrefix}/login`, function() {
	it('Returns a status 401 for invalid username', function(done) {
		chai
			.request(server)
			.post(`${apiPrefix}/login`)
			.send({ username: `${username}1`, password })
			.end((err, res) => {
				err.should.exist
				res.should.have.status(401)
				res.should.be.json
				done()
			})
	})

	it('Returns a status 401 for an invalid password', function(done) {
		chai
			.request(server)
			.post(`${apiPrefix}/login`)
			.send({ username, password: `${password}1` })
			.end((err, res) => {
				err.should.exist
				res.should.have.status(401)
				res.should.be.json
				done()
			})
	})

	it('Does not allow unverified users to login', function(done) {
		chai
			.request(server)
			.post(`${apiPrefix}/login`)
			.send({ username: unverifiedUser.username, password })
			.end((err, res) => {
				err.should.exist
				res.should.have.status(401)
				res.should.be.json
				done()
			})
	})

	it('Returns a status 200 for a successful login', function(done) {
		chai
			.request(server)
			.post(`${apiPrefix}/login`)
			.send({ username, password })
			.end((err, res) => {
				should.not.exist(err)
				res.should.have.status(200)
				res.should.be.json
				res.body.should.have.keys('token', 'message')
				done()
			})
	})
})

describe(`GET ${apiPrefix}/verify/:token`, function() {
	it('verifies an account when the token is present', function(done) {
		chai
			.request(server)
			.get(`${apiPrefix}/verify/${unverifiedUser.verifyToken}`)
			.end((err, res) => {
				//prettier-ignore
				(async function() {
					let results = await db.query(
						`SELECT * FROM users WHERE username = '${unverifiedUser.username}' LIMIT 1;`
					)
					let testUser = results[0][0]
					should.not.exist(err)
					res.should.have.status(200)
					res.should.be.json
					testUser.should.include({ verified: true })
					done()
				})()
			})
	})

	it('does not verify an account when an invalid token is present', function(
		done
	) {
		chai
			.request(server)
			.get(`${apiPrefix}/verify/badtoken`)
			.end((err, res) => {
				err.should.exist
				res.should.have.status(500)
				done()
			})
	})
})

describe(`POST ${apiPrefix}/forgotPassword`, function() {
	it('Creates a token for resetting your password', function(done) {
		chai
			.request(server)
			.post(`${apiPrefix}/forgotPassword`)
			.send({ username })
			.end((err, res) => {
				should.not.exist(err)
				res.should.be.json
				res.should.have.status(200)
				done()
			})
	})

	it("Sends a status 400 if the username isn't present", function(done) {
		chai
			.request(server)
			.post(`${apiPrefix}/forgotPassword`)
			.send({ test: '1234' })
			.end((err, res) => {
				err.should.exist
				res.should.have.status(400)
				res.should.be.json
				done()
			})
	})

	it('Sends a status 400 if the username is incorrect', function(done) {
		chai
			.request(server)
			.post(`${apiPrefix}/forgotPassword`)
			.send({ username: `${username}1` })
			.end((err, res) => {
				err.should.exist
				res.should.have.status(400)
				res.should.be.json
				done()
			})
	})
})

describe(`PATCH ${apiPrefix}/forgotPassword`, function() {
	it("Sends a status 400 when passwords don't match", function(done) {
		chai
			.request(server)
			.patch(`${apiPrefix}/forgotPassword`)
			.send({ username, password, passwordConfirmation: `${password}1` })
			.end((err, res) => {
				err.should.exist
				res.should.have.status(400)
				res.should.be.json
				done()
			})
	})

	it("Sends a status 400 when username and reset token don't correspond", function(
		done
	) {
		//prettier-ignore
		(async function() {
			let token = 'abcd1234'

			await db.query(
				`UPDATE users SET "forgotPWToken" = '${token}' WHERE username = '${username}';`
			)

			chai
				.request(server)
				.patch(`${apiPrefix}/forgotPassword`)
				.send({
					username,
					password,
					passwordConfirmation: password,
					token: `${token}1`
				})
				.end((err, res) => {
					err.should.exist
					res.should.have.status(400)
					res.should.be.json
					done()
				})
		})()
	})

	it('Changes the users password when presented with a reset token', function(
		done
	) {
		//prettier-ignore
		(async function() {
			let token = 'abcd1234'

			await db.query(
				`UPDATE users SET "forgotPWToken" = '${token}' WHERE username = '${username}';`
			)

			let result = await db.query(
				`SELECT "hashedPassword" from users WHERE username = '${username}';`
			)

			let oldPassword = result[0][0]

			chai
				.request(server)
				.patch(`${apiPrefix}/forgotPassword`)
				.send({
					username,
					token,
					password: `${password}1`,
					passwordConfirmation: `${password}1`
				})
				.end((err, res) => {
					(async function() {
						result = await db.query(
							`SELECT "hashedPassword" from users WHERE username = '${username}';`
						)
						let newPassword = result[0][0]

						newPassword.should.not.deep.equal(oldPassword)
						should.not.exist(err)
						res.should.have.status(200)
						res.should.be.json
						done()
					})()
				})
		})()
	})
})
