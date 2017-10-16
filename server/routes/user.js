const Router = require('express-promise-router')
const passport = require('passport')

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

  let user

  try {
    const hashedPassword = password
    user = await User.create({ username, hashedPassword, email })
  } catch (e) {
    return res.status(400).json(e)
  }

  return res.status(201)
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

  if (!user.validPassword(password)) return badLogin(res)

  const token = sign({
    username: user.username,
    email: user.email
  })

  return res.status(200).json({ message: 'Success', token })
})

router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    res.json({ message: 'Success' })
  }
)

module.exports = router
