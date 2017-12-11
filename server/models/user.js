const Sequelize = require('sequelize')
const bCrypt = require('bcrypt-nodejs')
const uuid = require('uuid/v4')

const db = require('../db')
const Book = require('./book')
const Trade = require('./trade')
const {
	sendAccountConfirmEmail,
	sendForgotPasswordEmail
} = require('../services/email')

function createHash(password) {
	let hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
	return hash
}

function validPassword(clearPassword, hashedPassword) {
	return bCrypt.compareSync(clearPassword, hashedPassword)
}

const User = db.define('user', {
	username: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		}
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
			notEmpty: true
		}
	},
	hashedPassword: {
		type: Sequelize.STRING,
		allowNull: false,
		set(val) {
			this.setDataValue('hashedPassword', createHash(val))
		}
	},
	token: {
		type: Sequelize.STRING,
		allowNull: true
	},
	verified: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	verifyToken: {
		type: Sequelize.STRING
	},
	forgotPWToken: {
		type: Sequelize.STRING
	}
})

User.hook('beforeCreate', user => {
	//Generate verify token
	user.verifyToken = uuid()
})

User.hook('afterCreate', user => {
	// Send verify email
	const { email, username, verifyToken } = user

	sendAccountConfirmEmail({ email, username, verifyToken })
})

User.prototype.validPassword = function(password) {
	return validPassword(password, this.hashedPassword)
}

User.prototype.forgotPassword = function() {
	const { email, username } = this
	const token = uuid()
	this.forgotPWToken = token

	sendForgotPasswordEmail({ email, username, token })

	this.save()
}

//Many to Many Relationship
User.belongsToMany(Book, { as: 'books', through: 'book_owners' })
Book.belongsToMany(User, { as: 'owners', through: 'book_owners' })

//One to one relationships
Trade.belongsTo(User, { as: 'owner' })
Trade.belongsTo(User, { as: 'receiver' })
Trade.belongsTo(Book, { as: 'item' })

/**
 * Expose
 */

module.exports = User
