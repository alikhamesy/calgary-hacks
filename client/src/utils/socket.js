/*global io*/
const socket = io('http://localhost:3001')

socket.on('connect', () => console.log('coonected'))

const move = loc => {
  socket.emit('move', loc)
}

export default socket
export { move }
