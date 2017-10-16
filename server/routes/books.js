const Router = require('express-promise-router')
const passport = require('passport')

const db = require('../db')
const Book = require('../models/book')

const router = new Router()

/**
 * Expose
 */

router.get('/', async (req, res) => {
  let books = await Book.findAll()

  return res.json(books)
})

router.post(
  '/new',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { firstName, lastName, title, isbn, imageUrl } = req.body
    try {
      await Book.create({
        title,
        authorFirstname: firstName,
        authorLastname: lastName,
        isbn,
        imageUrl
      })
    } catch (e) {
      return res.status(400).json(e)
    }

    return res.sendStatus(201)
  }
)

module.exports = router
