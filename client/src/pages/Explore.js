import { useEffect, useState } from 'react'
import fetcher from '../utils/fetcher'
import socket, { createRoom, acceptRoom } from '../utils/socket'
import { Link, useHistory } from 'react-router-dom'

import Map from '../components/Map'
import Category from '../components/Category'

import styles from '../css/Explore.module.css'

import logoSrc from '../assets/logo.svg'
import homeSrc from '../assets/home.svg'
import mapSrc from '../assets/map.svg'
import searchSrc from '../assets/search.svg'
import profileSrc from '../assets/profile.svg'
import Room from './Room'

const sites = {
  'Simon Fraser University': {
    lat: 49.278256968386984,
    lng: -122.91998964252502
  },
  'University of Toronto': {
    lat: 43.66291496330409,
    lng: -79.39566713073361
  },
  'University of British Columbia': {
    lat: 49.26061218117882,
    lng: -123.24598307292231
  },
  'University of Waterloo': {
    lat: 43.47232430908821,
    lng: -80.5447932288918
  },
  'University of Alberta': {
    lat: 53.52321775834021,
    lng: -113.52632704545402
  },
  'University of Calgary': {
    lat: 51.077624482445465,
    lng: -114.14070573054364
  }
}

const Explore = props => {
  const hist = useHistory()
  const [user, setUser] = useState({})
  const [others, setOthers] = useState({})
  const [room, setRoom] = useState(null)
  const [rooms, setRooms] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    fetcher(`/users?uid=${localStorage.uid}`)
      .then(({ user, others, rooms }) => {
        setUser(user)
        setOthers(others)
        setRooms(rooms)
      })
      .catch(() => {
        hist.push('/')
      })
  }, [hist])

  useEffect(() => {
    socket.on('join', user => {
      setOthers({ ...others, user })
    })

    socket.on('move', ({ uid, user }) => {
      setOthers({
        ...others,
        [uid]: user
      })
    })

    return () => {
      socket.off('move')
      socket.off('join')
    }
  }, [others])

  const siteClick = site => {
    setUser({ ...user, loc: sites[site] })
  }

  const userClick = userToTp => {
    Object.values(others).find(
      usr => usr.username === userToTp && setUser({ ...user, loc: usr.loc })
    )
  }

  const roomClick = room => {
    setRoom(room)
  }

  const newRoom = e => {
    e.preventDefault()
    createRoom(input)
    setRoom(input)
    return false
  }

  useEffect(() => {
    socket.on('newRoom', newName => setRooms([...rooms, newName]))

    socket.on('roomRequest', ({ requester, invited }) => {
      console.log(requester, invited)
      console.log(localStorage.uid)
      if (invited === localStorage.uid) {
        console.log(others)
        const allow = window.confirm(
          `New room request from ${others[requester].displayName}, accept?`
        )
        if (allow) {
          acceptRoom(requester)
        }
      }
    })

    socket.on('acceptRoom', ({ room: newRoom, pair }) => {
      if (pair.includes(localStorage.uid)) {
        setRooms([...rooms, newRoom])
        setRoom(newRoom)
      }
    })

    return () => {
      socket.off('newRoom')
      socket.off('roomRequest')
      socket.off('acceptRoom')
    }
  })

  return (
    <div className={styles.container}>
      <div className={styles.side}>
        <div className={styles.top}>
          <img src={logoSrc} className={styles.logo} alt="" />
          <form className={styles.search} onSubmit={newRoom}>
            <input
              className={styles.searchBar}
              onChange={e => setInput(e.target.value)}
              value={input}
            />
            <img
              src={searchSrc}
              className={styles.searchImg}
              alt=""
              onClick={newRoom}
            />
          </form>
          <Category src={homeSrc} title="Home" onClick={() => setRoom(null)} />
          <Category
            src={mapSrc}
            title="Map"
            items={Object.keys(sites).sort()}
            onClick={siteClick}
          />
          <Category
            title={`Online (${Object.keys(others ?? {}).length + 1})`}
            items={[
              ...Object.values(others ?? {}).map(user => user.username),
              user.username
            ].sort()}
            onClick={userClick}
          />
          <Category title="Saved Rooms" items={rooms} onClick={roomClick} />
        </div>
        <div className={styles.bot}>
          <div className={styles.prof}>
            <img src={profileSrc} className={styles.profile} alt="" />
            <p className={styles.name}>{user.displayName ?? 'Ali'}</p>
          </div>
          <Link className={styles.out} to="/">
            Logout
          </Link>
        </div>
      </div>
      <div className={styles.main}>
        <h1 className={styles.header}>
          {room
            ? `Room ${room}`
            : `Hello ${user?.displayName?.split(' ')[0] ?? 'Ali'} 👋`}
        </h1>
        <div className={styles.wrap}>
          {room ? (
            <Room roomName={room} username={user.username} />
          ) : (
            <Map user={user} users={others} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Explore
