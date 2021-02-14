/*global io*/
const socket = io('http://localhost:3001')

socket.on('connect', () => console.log('socket connected'))

const move = loc => {
  socket.emit('move', { uid: localStorage.uid, newLoc: loc })
}

const sendMessage = (room, message, username) => {
  socket.emit('message', { room, message, username })
}

const sendDrawing = (room, tokens, wid, color) => {
  socket.emit('drawing', { room, tokens, wid, color })
}

const clearDrawing = room => {
  socket.emit('clear', room)
}

const createRoom = roomName => {
  socket.emit('newRoom', roomName)
}

const roomRequest = user => {
  if (user === localStorage.uid) return
  socket.emit('roomRequest', { requester: localStorage.uid, invited: user })
}

const acceptRoom = user => {
  socket.emit('acceptRoom', { invited: localStorage.uid, requester: user })
}

export default socket
export {
  move,
  sendMessage,
  sendDrawing,
  createRoom,
  roomRequest,
  acceptRoom,
  clearDrawing
}
