const Sequelize = require('sequelize')
const bCrypt = require('bcrypt-nodejs')

const db = require('../db')
const Book = require('./book')

function createHash(password) {
  console.log('creating hash')
  let hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
  console.log(hash)
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
  }
})

User.prototype.validPassword = function(password) {
  return validPassword(password, this.hashedPassword)
}

//Many to Many Relationship
User.belongsToMany(Book, { as: 'books', through: 'book_owners' })
Book.belongsToMany(User, { as: 'owners', through: 'book_owners' })

/**
 * Expose
 */

module.exports = User
