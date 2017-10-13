const Sequelize = require('sequelize')

const db = require('../db')
const Book = require('./book')

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
    allowNull: false
  }
})

//Many to Many Relationship
User.belongsToMany(Book, { as: 'books', through: 'book_owners' })
Book.belongsToMany(User, { as: 'owners', through: 'book_owners' })

/**
 * Expose
 */

module.exports = User
