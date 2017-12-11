const Email = require('email-templates')

const transportConfig = require('./config/emailConfig')

const from = 'BookTrader@codydeckard.com'

function sendAccountConfirmEmail(newUser) {
	const email = new Email({
		message: {
			from
		},
		transport: transportConfig
	})

	email.send({
		template: 'signup',
		message: {
			to: newUser.email
		},
		locals: {
			name: newUser.username,
			link: newUser.link
		}
	})
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
	sendAccountConfirmEmail
}
