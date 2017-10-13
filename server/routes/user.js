const Router = require('express-promise-router')

const db = require('../db')

const router = new Router()

/**
 * Expose
 */

router.get('/', async (req, res) => {
  const time = await db.query('SELECT NOW()')

  res.json(time)
})

module.exports = router
