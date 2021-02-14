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

const db = {
  auth: {},
  users: {},
  rooms: []
}

const userMap = {
  'akhamesy@sfu.ca': 'Ali Khamesy',
  'noblet@sfu.ca': 'Noble Tan'
}

const uniRegex = /(?<=@).+?(?=\.ca)/
const uniMap = {
  sfu: {
    lat: 49.278256968386984,
    lng: -122.91998964252502
  },
  'mail.utoronto': {
    lat: 43.66291496330409,
    lng: -79.39566713073361
  },
  'student.ubc': {
    lat: 49.26061218117882,
    lng: -123.24598307292231
  },
  uwaterloo: {
    lat: 43.47232430908821,
    lng: -80.5447932288918
  },
  ualberta: {
    lat: 53.52321775834021,
    lng: -113.52632704545402
  },
  ucalgary: {
    lat: 51.077624482445465,
    lng: -114.14070573054364
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
  db.users[uid] = { loc, username, displayName: userMap[username] }

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
    others,
    rooms: db.rooms
  })
})

let roomid = 0

io.on('connection', socket => {
  socket.on('join', cookie => {
    const uid = db.auth[cookie]
    if (uid) {
      socket.broadcast.emit('join', {})
    }
  })

  socket.on('move', ({ uid, newLoc }) => {
    if (newLoc && uid && db.users[uid]) {
      db.users[uid].loc = newLoc
      socket.broadcast.emit('move', { uid, user: db.users[uid] })
    }
  })

  socket.on('message', ({ message, room, username }) => {
    socket.broadcast.emit('message', { message, room, username })
    socket.emit('message', { message, room, username })
  })

  socket.on('drawing', ({ room, tokens, wid, color }) => {
    socket.broadcast.emit('drawing', { room, tokens, wid, color })
  })

  socket.on('clear', room => {
    socket.broadcast.emit('clear', room)
    socket.emit('clear', room)
  })

  socket.on('newRoom', room => {
    if (db.rooms.includes(room)) return
    db.rooms.push(room)
    socket.broadcast.emit('newRoom', room)
    socket.emit('newRoom', room)
  })

  socket.on('roomRequest', ({ requester, invited }) => {
    socket.broadcast.emit('roomRequest', { requester, invited })
  })

  socket.on('acceptRoom', ({ requester, invited }) => {
    const room = `R-${roomid++}`
    db.rooms.push(room)
    socket.broadcast.emit('acceptRoom', {
      room,
      pair: [requester, invited]
    })
    socket.emit('acceptRoom', {
      room,
      pair: [requester, invited]
    })
  })

  // socket.on('newLine')
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`))
