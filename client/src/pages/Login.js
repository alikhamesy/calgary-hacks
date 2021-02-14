import { useState } from 'react'
import fetcher from '../utils/fetcher'

import { useHistory } from 'react-router-dom'

const Login = () => {
  const hist = useHistory()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const login = event => {
    event.preventDefault()
    fetcher('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user,
        password: pass
      })
    }).then(({ uid }) => {
      localStorage.uid = uid
      hist.push('/Explore')
    })
    return false
  }

  return (
    <div>
      <form onSubmit={login}>
        <label>Username</label>
        <input onChange={e => setUser(e.target.value)} />
        <label>Password</label>
        <input onChange={e => setPass(e.target.value)} type="password" />
        <input value="Login" type="submit" />
      </form>
    </div>
  )
}

export default Login
