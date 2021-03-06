const Email = require('email-templates')

const transportConfig = require('./config/emailConfig')

const from = 'BookTrader@codydeckard.com'
//Construct server link
const server =
	process.env.NODE_ENV === 'production'
		? 'https://buch-trader.herokuapp.com'
		: 'https://books-codeman869.c9users.io'

function sendAccountConfirmEmail(newUser) {
	let link = `${server}/api/v1/users/verify/${newUser.verifyToken}`
	const email = new Email({
		message: {
			from
		},
		transport: transportConfig
	})
	if (process.env.NODE_ENV !== 'test') {
		email.send({
			template: 'signup',
			message: {
				to: newUser.email
			},
			locals: {
				name: newUser.username,
				link
			}
		})
	} else {
		/* eslint-disable */
		console.log(`Account confirm email sent to ${newUser.email}`)
		/* eslint-enable */
	}
}

function sendForgotPasswordEmail(user) {
	const { token } = user
	let link = `${server}/api/v1/users/forgotPassword/${token}`
	const email = new Email({
		message: {
			from
		},
		transport: transportConfig
	})

	if (process.env.NODE_ENV !== 'test') {
		email.send({
			template: 'forgotpassword',
			message: {
				to: user.email
			},
			locals: {
				name: user.username,
				link
			}
		})
	} else {
		/* eslint-disable */
		console.log(`Password reset email sent to ${user.email}`)
		/* eslint-enable */
	}
}

function sendTestEmail() {
	const email = new Email({
		message: {
			from
		},
		transport: transportConfig
	})

	email
		.send({
			template: 'mars',
			message: {
				to: 'me@codydeckard.com'
			},
			locals: {
				name: 'Elon'
			}
		})
		/* eslint-disable */
		.then(() => console.log('Email Sent Successfully'))
		.catch(e => console.log(e))
	/* eslint-enable */
}

module.exports = {
	sendTestEmail,
	sendAccountConfirmEmail,
	sendForgotPasswordEmail
}
