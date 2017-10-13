const { Pool, Client } = require('pg')

//const client = new Client()
let dbconfig

if (process.env.NODE_ENV === 'production') {
  dbconfig = {
    connectionString: process.env.DATABASE_URL
  }
} else {
  dbconfig = {
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD
  }
}

const pool = new Pool(dbconfig)
/*
async function queryDB() {
  const time = await pool.query('SELECT NOW()')

  console.log(`The time is ${time}`)

 // await pool.end()
}
queryDB()
*/

/**
 * Expose
 */

module.exports = {
  query: (text, params) => pool.query(text, params)
}
