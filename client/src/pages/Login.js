import { useState } from 'react'
import fetcher from '../utils/fetcher'
import { useHistory } from 'react-router-dom'

import styles from '../css/Login.module.css'

import logoSrc from '../assets/logo.svg'

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
    <div className={styles.container}>
      <form className={styles.form} onSubmit={login}>
        <img src={logoSrc} alt="" />
        <label>Email</label>
        <input
          className={styles.input}
          onChange={e => setUser(e.target.value)}
        />
        <label>Password</label>
        <input
          className={styles.input}
          onChange={e => setPass(e.target.value)}
          type="password"
        />
        <input className={styles.btn} value="Login" type="submit" />
      </form>
    </div>
  )
}

export default Login
