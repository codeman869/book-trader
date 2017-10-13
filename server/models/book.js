const Sequelize = require('sequelize')

const db = require('../db')

const Book = db.define(
  'book',
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    isbn: {
      type: Sequelize.INTEGER,
      unique: true
    },
    authorFirstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    authorLastname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['isbn']
      }
    ]
  }
)

/**
 * Expose
 */

module.exports = Book
