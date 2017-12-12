/* global describe
   global it
*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../server')

const should = chai.should()

const apiPrefix = '/api/v1/users'

chai.use(chaiHttp)

describe('User Routes', function() {
	it('GET /', function(done) {
		chai
			.request(server)
			.get(`${apiPrefix}`)
			.end(function(err, res) {
				should.not.exist(err)
				res.should.have.status(200)
				res.should.be.json

				done()
			})
	})
})
