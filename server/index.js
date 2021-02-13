const express = require('express')
const app = express()
const path = require('path')

app.use(express.json({ limit: '50mb' }))
// app.use(express.static('client'))

app.use('*', (req, res, next) => {
  res.header({
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'POST, PUT, GET, DELETE',
  })
  next()
})

// app.use('/api/listing', listing)

app.get(/^(?!.*api)/, (req, res) => {
  res.send('hi')
  // res.sendFile(path.join(__dirname, 'client', 'index.html'))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
