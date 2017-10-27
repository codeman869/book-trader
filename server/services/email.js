const Email = require('email-templates')

const transportConfig = require('./config/emailConfig')

function sendEmail() {
	const email = new Email({
		message: {
			from: 'BookTrader@codydeckard.com'
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

module.exports = sendEmail
