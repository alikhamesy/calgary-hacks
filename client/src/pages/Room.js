import { useEffect, useRef, useState } from 'react'
import socket, { sendMessage, sendDrawing, clearDrawing } from '../utils/socket'

import styles from '../css/Room.module.css'

import sendSrc from '../assets/send.svg'
import selectSrc from '../assets/tools/select.svg'
import redoSrc from '../assets/tools/redo.svg'
import undoSrc from '../assets/tools/undo.svg'
import zoominSrc from '../assets/tools/zoomin.svg'
import zoomoutSrc from '../assets/tools/zoomout.svg'
import trashSrc from '../assets/tools/trash.svg'
import pencilSrc from '../assets/tools/pencil.svg'
import imgSrc from '../assets/tools/img.svg'
import editSrc from '../assets/tools/edit.svg'
import eraseSrc from '../assets/tools/erase.svg'
import textSrc from '../assets/tools/text.svg'
import saveSrc from '../assets/tools/save.svg'

const toolsarr = [
  [selectSrc, 'Select'],
  [pencilSrc, 'Pencil'],
  [editSrc, 'Shape'],
  [textSrc, 'Text'],
  [imgSrc, 'Image'],
  [undoSrc, 'Undo'],
  [redoSrc, 'Redo'],
  [eraseSrc, 'Eraser'],
  [trashSrc, 'Clear'],
  [zoominSrc, 'Zoom +'],
  [zoomoutSrc, 'Zoom -'],
  [saveSrc, 'Save']
]

const Room = ({ roomName, username }) => {
  const [messages, setMessages] = useState([])
  const [msg, setMsg] = useState('')
  const [color, setColor] = useState('black')
  const [wid, setWid] = useState(2)
  const canvas = useRef()
  const chatRef = useRef()

  const clear = () => {
    const c = canvas.current
    c.getContext('2d').clearRect(0, 0, c.width, c.height)
  }

  useEffect(() => {
    clear()
  }, [roomName])

  useEffect(() => {
    const canv = canvas?.current
    if (!canv) return
    let prevX = 0
    let prevY = 0
    let currX = 0
    let currY = 0
    let flag = false
    let dot_flag = false

    let w = wid
    let c = color

    const tokens = []

    const ctx = canv.getContext('2d')

    ctx.translate(0.5, 0.5)
    ctx.scale(1, 1)

    const mmove = e => {
      if (flag) {
        prevX = currX
        prevY = currY
        currX = e.clientX - canv.offsetLeft
        currY = e.clientY - canv.offsetTop
        tokens.push([currX, currY])
        draw()
      }
    }

    const mdown = e => {
      prevX = currX
      prevY = currY
      currX = e.clientX - canv.offsetLeft
      currY = e.clientY - canv.offsetTop

      tokens.push([currX, currY])

      flag = true
      dot_flag = true
      if (dot_flag) {
        ctx.beginPath()
        ctx.fillStyle = c
        ctx.fillRect(currX, currY, 2, 2)
        ctx.closePath()
        dot_flag = false
      }
    }

    const mup = e => {
      flag = false
      sendDrawing(roomName, tokens, w, c)
      tokens.length = 0
    }

    const draw = () => {
      ctx.beginPath()
      ctx.moveTo(prevX, prevY)
      ctx.lineTo(currX, currY)
      ctx.strokeStyle = c
      ctx.lineWidth = w
      ctx.stroke()
      ctx.closePath()
    }

    socket.on('drawing', ({ room, tokens, wid, color }) => {
      if (room === roomName && tokens.length > 0) {
        let tw = w
        let tc = c
        w = wid
        c = color

        console.log(w, c)
        if (tokens.length === 1) {
          prevX = tokens[0][0]
          prevY = tokens[0][1]
          currX = tokens[0][0] + 1
          currY = tokens[0][1] + 1
          draw()
        }

        for (let i = 0; i < tokens.length - 1; i++) {
          prevX = tokens[i][0]
          prevY = tokens[i][1]
          currX = tokens[i + 1][0]
          currY = tokens[i + 1][1]
          draw()
        }
        w = tw
        c = tc
      }
    })

    socket.on('clear', room => {
      if (room === roomName) {
        clear()
      }
    })

    canv.addEventListener('mousemove', mmove, false)
    canv.addEventListener('mousedown', mdown, false)
    canv.addEventListener('mouseup', mup, false)
    canv.addEventListener('mouseout', mup, false)

    return () => {
      canv.removeEventListener('mousemove', mmove)
      canv.removeEventListener('mousedown', mdown)
      canv.removeEventListener('mouseup', mup)
      canv.removeEventListener('mouseout', mup)
      socket.off('drawing')
      socket.off('clear')
    }
  }, [roomName, color])

  const onChat = event => {
    event.preventDefault()
    sendMessage(roomName, msg, username)
    setMsg('')

    return false
  }

  useEffect(() => {
    messages.length = 0
    setMessages([...messages])
    socket.on('message', ({ room, message, username }) => {
      if (room === roomName) {
        messages.push({ message, username })
        setMessages([...messages])
      }
    })
    sendMessage(
      roomName,
      `${username ?? 'user'} has joined ${roomName}`,
      username
    )

    return () => {
      socket.off('message')
    }
  }, [roomName])

  useEffect(() => {
    const chat = chatRef?.current
    if (chat) chat.scrollTo(0, chat.scrollHeight)
  }, [messages])

  const toolSelect = tool => {
    switch (tool) {
      case 'Pencil':
        setColor('black')
        setWid(2)
        break
      case 'Eraser':
        setColor('white')
        setWid(20)
        break
      case 'Clear':
        clearDrawing(roomName)
        break
      default:
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.whiteboard}>
        <canvas
          width="700px"
          height="700px"
          ref={canvas}
          className={styles.canvas}
        ></canvas>
        <div className={styles.toolbar}>
          {toolsarr.map(([toolsrc, tool]) => (
            <div
              key={tool}
              className={styles.tool}
              onClick={() => toolSelect(tool)}
            >
              <img src={toolsrc} alt="" />
              <span>{tool}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chat}>
        <div className={styles.messages} ref={chatRef}>
          {messages.map((m, i) => (
            <div key={i} className={styles.message}>
              <div className={styles.author}>{m.username}:</div>
              <div className={styles.content}>{m.message}</div>
            </div>
          ))}
        </div>
        <form className={styles.msgform} onSubmit={onChat}>
          <input
            placeholder="Type a Message"
            onChange={e => setMsg(e.target.value)}
            className={styles.msgbar}
            value={msg}
          />
          <img
            src={sendSrc}
            className={styles.send}
            alt="send"
            onClick={onChat}
          />
        </form>
      </div>
    </div>
  )
}

export default Room
