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

/**
 * Expose
 */

router.get('/', async (req, res) => {
	const time = await db.query('SELECT NOW()')

	res.json(time)
})

router.post('/new', async (req, res) => {
	const { username, password, passwordConfirmation, email } = req.body

	if (password !== passwordConfirmation)
		return res
			.status(400)
			.json({ error: true, message: "Passwords don't match" })

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
		await user.update({ token: identifier })
	} catch (e) {
		res.status(500).json({ error: true, message: e })
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
		return res.status(500).json({ error: true, message: e })
	}

	user.verified = true
	user.verifyToken = ''

	await user.save()

	return res.status(200).json({ message: 'Account Confirmed', error: false })
})

router.get(
	'/protected',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		res.json({ message: 'Success' })
	}
)

module.exports = router
