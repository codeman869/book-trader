const Router = require('express-promise-router')
const passport = require('passport')
const uuid = require('uuid/v4')

const db = require('../db')
const User = require('../models/user')
const { sign } = require('../services/jwt')

const router = new Router()

function badLogin(res) {
	return res
		.status(401)
		.json({ error: true, message: 'Username not found or incorrect password' })
}

function badRequest(res) {
	return res.status(400).json({ error: true, message: 'Invalid Request' })
}

function serverError(res, message) {
	return res.status(500).json({ error: true, message })
}

function passwordDontMatch(res) {
	return res.status(400).json({ error: true, message: "Passwords don't match" })
}

/**
 * Expose
 */

router.get('/', async (req, res) => {
	const time = await db.query('SELECT NOW()')

	res.json(time)
})

router.post('/new', async (req, res) => {
	const { username, password, passwordConfirmation, email } = req.body

	if (password !== passwordConfirmation) return passwordDontMatch(res)

	try {
		const hashedPassword = password
		await User.create({ username, hashedPassword, email })
	} catch (e) {
		return res.status(400).json(e)
	}

	return res.sendStatus(201)
})

router.post('/login', async (req, res) => {
	const { username, password } = req.body

	let user

	try {
		user = await User.find({ where: { username } })
	} catch (e) {
		return badLogin(res)
	}

	if (!user) return badLogin(res)

	if (!user.verified)
		return res.json({
			message: 'You must verify account before logging in',
			error: true
		})

	if (!user.validPassword(password)) return badLogin(res)

	const identifier = uuid()

	try {
		await user.update({ token: identifier, forgotPWToken: '' })
	} catch (e) {
		return serverError(res, e)
	}

	const token = sign({
		username: user.username,
		email: user.email,
		token: identifier
	})

	return res.status(200).json({ message: 'Success', token })
})

router.get('/verify/:id', async (req, res) => {
	let user

	const { id } = req.params

	try {
		user = await User.find({ where: { verifyToken: id } })
	} catch (e) {
		return serverError(res, e)
	}

	user.verified = true
	user.verifyToken = ''

	await user.save()

	return res.status(200).json({ message: 'Account Confirmed', error: false })
})

router.post('/forgotPassword', async (req, res) => {
	let user

	let { username } = req.body

	if (!username) return badRequest(res)

	try {
		user = await User.find({ where: { username } })
	} catch (e) {
		return serverError(res, e)
	}

	if (!user) return badRequest(res)

	user.forgotPassword()

	return res.status(200).json({ message: 'success', error: false })
})

router.patch('/forgotPassword', async (req, res) => {
	let user
	let { username, password, passwordConfirmation, token } = req.body

	if (!username || !password || !passwordConfirmation || !token)
		return badRequest(res)

	if (password !== passwordConfirmation) return passwordDontMatch(res)

	try {
		user = await User.find({ where: { username, forgotPWToken: token } })
	} catch (e) {
		return serverError(res, e)
	}

	if (!user) return badRequest(res)

	try {
		await user.update({ hashedPassword: password, forgotPWToken: '' })
	} catch (e) {
		return serverError(res, e)
	}

	return res.status(200).json({ error: false, message: 'Success' })
})

router.get(
	'/protected',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		res.json({ message: 'Success' })
	}
)

module.exports = router
