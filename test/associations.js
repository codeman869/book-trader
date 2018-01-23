/* global describe
   global it
   global before
   global after
*/
const chai = require('chai')
const should = chai.should()

const db = require('../server/db')
const Book = require('../server/models/book')
const User = require('../server/models/user')
const Trade = require('../server/models/trade')

const username = 'fred1234'
const email = 'fred@example.com'
const password = 'abcd1234'

const title = 'Cooking with Pooh'
const authorFirstname = 'Fredrick'
const authorLastname = 'Willson'
const isbn = '12345'

describe('Association Tests', function() {
	let user, book

	before(async function() {
		user = new User()
		user.username = username
		user.email = email
		user.hashedPassword = password

		await user.save()

		book = new Book({ title, authorFirstname, authorLastname, isbn })

		await book.save()
	})

	after(async function() {
		await db.query(
			`DELETE FROM users WHERE "username" = '${username}' OR "username" = '${username}2'`
		)
	})

	it('allows a user to add multiple books', async function() {
		await user.setBooks([book])

		let books, error

		try {
			books = await user.getBooks()
		} catch (e) {
			error = e
		}

		should.not.exist(error)
		books.should.be.an('array').with.length(1)
	})

	it('allows a user to set up a trade', async function() {
		//create a new user

		let error, queryTrade

		let user2 = new User()

		user2.username = `${username}2`
		user2.email = 'test@nowhere.com'
		user2.hashedPassword = password

		await user2.save()

		let trade = new Trade()

		await trade.save()

		await trade.setOwner(user)
		await trade.setItem(book)
		await trade.setReceiver(user2)

		try {
			queryTrade = await db.query(
				`SELECT * from trades WHERE "ownerId" = ${user.id}`
			)
		} catch (e) {
			error = e
		}

		should.not.exist(error)
		//console.log(queryTrade)

		queryTrade.should.be.an('array').with.length(2)
	})
})
