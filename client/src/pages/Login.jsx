import React from 'react'
import { useNavigate } from 'react-router-dom'
import { createApi } from '../api'
import { AuthContext } from '../App'

export default function Login() {
  const [email, setEmail] = React.useState('alice@college.edu')
  const [password, setPassword] = React.useState('password123')
  const [error, setError] = React.useState('')
  const navigate = useNavigate()
  const { login } = React.useContext(AuthContext)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const api = createApi()
      const { data } = await api.post('/auth/login', { email, password })
      login(data.token, data.user)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div style={{maxWidth:400}}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
