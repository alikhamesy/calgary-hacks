import { useEffect, useState } from 'react'
import fetcher from '../utils/fetcher'
import socket from '../utils/socket'
import { useHistory } from 'react-router-dom'

import Map from '../components/Map'

const Explore = props => {
  const hist = useHistory()
  const [user, setUser] = useState({})
  const [others, setOthers] = useState({})

  useEffect(() => {
    fetcher(`/users?uid=${localStorage.uid}`)
      .then(({ user, others }) => {
        setUser(user)
        setOthers(others)
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
      console.log(uid, user)
      // others[uid].loc = newLoc
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

  return <Map user={user} users={others} />
}

export default Explore
