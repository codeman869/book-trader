/* global describe
   global it
   global beforeEach
*/
const chai = require('chai')
const should = chai.should()

const db = require('../server/db')
const Book = require('../server/models/book')

const isbn = '12345'
const authorFirstname = 'Frank'
const authorLastname = 'Thompson'
const title = 'Cooking with Pooh'

describe('Book model tests', function() {
	beforeEach(async function() {
		await db.query('DELETE FROM books')
	})

	it('Should respect ISBNs as unique', async function() {
		let newBook, newBook2, error

		newBook = new Book()

		newBook.authorFirstname = authorFirstname
		newBook.authorLastname = authorLastname
		newBook.isbn = isbn
		newBook.title = title

		try {
			await newBook.save()
		} catch (e) {
			error = e
		}

		should.not.exist(error)

		newBook2 = new Book()

		newBook2.authorFirstname = 'Fred'
		newBook2.authorLastname = 'Wilson'
		newBook2.isbn = isbn
		newBook2.title = 'The ABCs of Javascript'

		try {
			await newBook2.save()
		} catch (e) {
			error = e
		}

		should.exist(error)
		error.should.include({ name: 'SequelizeUniqueConstraintError' })
	})

	it('Should not allow a blank title', async function() {
		let newBook = new Book()
		let error
		newBook.authorFirstname = 'Fred'
		newBook.authorLastname = 'Wilson'
		newBook.isbn = '1234'

		try {
			await newBook.save()
		} catch (e) {
			error = e
		}

		should.exist(error)
		error.should.include({ name: 'SequelizeValidationError' })
	})

	it('Should not allow a blank author first name', async function() {
		let newBook, error

		newBook = new Book()
		newBook.title = title
		newBook.isbn = isbn
		newBook.authorLastname = authorLastname

		try {
			await newBook.save()
		} catch (e) {
			error = e
		}

		should.exist(error)
		error.should.include({ name: 'SequelizeValidationError' })
	})

	it('Should not allow a blank author last name', async function() {
		let newBook, error

		newBook = new Book()
		newBook.title = title
		newBook.isbn = isbn
		newBook.authorFirstname = authorFirstname

		try {
			await newBook.save()
		} catch (e) {
			error = e
		}

		should.exist(error)
		error.should.include({ name: 'SequelizeValidationError' })
	})
})
