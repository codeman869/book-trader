const express = require('express')
const path = require('path')

const port = process.env.NODE_ENV != 'production' ? 3000 : process.env.PORT || 8080

const app = express()

app.use(express.static(path.resolve(__dirname, 'client/build')))
app.get('/api', (req, res) => {
    console.log('API Request')
    res.set('Content-Type', 'application/json');
    res.json({message: 'Successful'})
})

app.get('*', (req,res) => {
   res.sendFile(path.resolve(__dirname, 'client/build/', 'index.html')); 
})

app.listen(port, () => console.log(`Server running on port ${port}`))

module.exports = app
