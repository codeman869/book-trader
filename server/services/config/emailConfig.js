const postmark = require('postmark')

const apiKey = process.env.POSTMARK || 'apikey'

let client = new postmark.Client(apiKey)

function parser(input) {
	let output = {}

	output.From = input.data.from
	output.To = input.data.to
	output.HtmlBody = input.data.html
	output.TextBody = input.data.text
	output.Subject = input.data.subject

	return output
}

/**
 * Expose
 */

module.exports = {
	name: 'Postmark',
	version: '1.0.0',
	/* eslint-disable */
	send: (mail, callback) => {
		let parsed = parser(mail)
		client
			.sendEmail(parsed)
			.then(() => console.log('Email sent successfully!'))
			.catch(e => console.log(e))
	}
	/* eslint-enable */
}
