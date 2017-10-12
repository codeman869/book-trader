const express = require('express')
const path = require('path')
const { Pool, Client } = require('pg')

const port =
  process.env.NODE_ENV != 'production' ? 3000 : process.env.PORT || 8080

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
const app = express()

app.use(express.static(path.resolve(__dirname, 'client/build')))
app.get('/api', (req, res) => {
  console.log('API Request')
  res.set('Content-Type', 'application/json')
  res.json({ message: 'Successful' })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client/build/', 'index.html'))
})
async function queryDB() {
  const time = await pool.query('SELECT NOW()')

  console.log(`The time is ${time}`)

  await pool.end()
}
queryDB()

app.listen(port, () => console.log(`Server running on port ${port}`))

module.exports = app
