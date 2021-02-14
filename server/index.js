const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(express.json({ limit: '50mb' }))
// app.use(express.static('client'))

app.use('*', (req, res, next) => {
  res.header({
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'POST, PUT, GET, DELETE'
  })
  next()
})
app.use(cors())

// app.use('/api/listing', listing)

app.get(/^(?!.*api)/, (req, res) => {
  res.send('hi')
  // res.sendFile(path.join(__dirname, 'client', 'index.html'))
})

io.on('connection', socket => {
  console.log('connection')

  socket.on('move', newLoc => console.log(newLoc))
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`))
