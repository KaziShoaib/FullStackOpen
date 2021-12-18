import React from 'react'
import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
            username:
          <input
            id='username'
            type='text'
            value={username}
            name='username'
            onChange={(event) => setUsername(event.target.value) }
          />
        </div>
        <div>
            password:
          <input
            id='password'
            type='password'
            value={password}
            name='password'
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button id='loginButton' type='submit'>log in</button>
      </form>
    </div>
  )
}

export default LoginForm