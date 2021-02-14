const express = require('express')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())

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

const dbschema = {
  auth: {
    username: 'uid'
  },
  users: {
    uid: {
      loc: {
        lat: 0,
        lng: 0
      },
      username: ''
    }
  }
}

const db = {
  auth: {},
  users: {}
}

const uniRegex = /(?<=@).+?(?=\.ca)/
const uniMap = {
  sfu: {
    lat: 49.278256968386984,
    lng: -122.91998964252502
  }
}

app.post('/login', (req, res) => {
  const { username } = req.body
  if (db.auth[username]) return res.json({ uid: db.auth[username] })

  const [uni] = username.match(uniRegex) ?? [null]
  if (!uni || !uniMap[uni]) return res.sendStatus(400)

  const loc = uniMap[uni]

  const uid = uuidv4()

  db.auth[username] = uid
  db.users[uid] = { loc, username }

  res.json({ uid })
})

app.get('/users', (req, res) => {
  const uid = req.query.uid
  const user = db.users[uid]

  if (!user) return res.sendStatus(400)
  const others = {}

  Object.entries(db.users).forEach(([key, value]) => {
    if (key !== uid) others[key] = value
  })
  res.json({
    user,
    others
  })
})

io.on('connection', socket => {
  socket.on('join', cookie => {
    const uid = db.auth[cookie]
    if (uid) {
      socket.broadcast.emit('join', {})
    }
  })

  socket.on('move', ({ uid, newLoc }) => {
    console.log(`got move for ${uid}`)
    if (newLoc && uid) {
      db.users[uid].loc = newLoc
      socket.broadcast.emit('move', { uid, user: db.users[uid] })
    }
  })

  // socket.on('newLine')
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`))
