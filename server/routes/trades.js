const Router = require('express-promise-router')
const passport = require('passport')
const Op = require('sequelize').Op

const Trade = require('../models/trade')
const User = require('../models/user')

const router = new Router()

/**
 * Expose
 */

router.get('/', async (req, res) => {
	let trades

	try {
		trades = await Trade.findAll({
			where: { [Op.or]: [{ finalized: false }, { finalized: null }] }
		})
	} catch (e) {
		return res.status(500).json({ error: true, message: e })
	}

	return res.json(trades)
})

router.post(
	'/new',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { username, bookid } = req.body

		let user
		try {
			user = await User.findOne({ where: { username } })
		} catch (e) {
			return res.status(400).json({ error: true, message: e })
		}
		try {
			await Trade.create({
				ownerId: user.id,
				itemId: bookid,
				receiverId: req.user.id
			})
		} catch (e) {
			return res.status(500).json({ error: true, message: e })
		}

		return res.sendStatus(201)
	}
)

router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { id } = req.params
		let trade
		try {
			trade = await Trade.findById(id)
		} catch (e) {
			return res.status(400).json({ error: true, message: e })
		}

		try {
			await trade.destroy()
		} catch (e) {
			return res.status(500).json({ error: true, message: e })
		}

		return res.sendStatus(200)
	}
)

router.put(
	'/:id/approve',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { id } = req.params

		let trade

		try {
			trade = await Trade.findById(id)
		} catch (e) {
			return res.status(400).json({ error: true, message: e })
		}

		if (trade.ownerId === req.user.id) {
			try {
				await trade.update({ finalized: true })
			} catch (e) {
				return res.status(500).json({ error: true, message: e })
			}

			return res.json(trade)
		} else {
			return res.sendStatus(401)
		}
	}
)

module.exports = router
