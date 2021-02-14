/*global io*/
const socket = io('http://localhost:3001')

socket.on('connect', () => console.log('socket connected'))

const move = loc => {
  socket.emit('move', { uid: localStorage.uid, newLoc: loc })
}

export default socket
export { move }
