import React from 'react'
import { useNavigate } from 'react-router-dom'
import { createApi } from '../api'

export default function Register() {
  const [role, setRole] = React.useState('student')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [message, setMessage] = React.useState('')
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setMessage('')
    try {
      const api = createApi()
      await api.post('/auth/register', { name, email, password, role })
      setMessage('Registered! You can now login.')
      setTimeout(()=>navigate('/login'), 800)
    } catch (e) {
      setMessage(e.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div style={{maxWidth:450}}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="company">Company</option>
          </select>
        </div>
        <button type="submit">Create account</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  )
}
