import React from 'react'
import { AuthContext } from '../App'
import { createApi, API_BASE } from '../api'

export default function Profile() {
  const { token, user, login } = React.useContext(AuthContext)
  const [name, setName] = React.useState(user?.name || '')
  const [resumeUrl, setResumeUrl] = React.useState(user?.resumeUrl || '')
  const [logoUrl, setLogoUrl] = React.useState(user?.logoUrl || '')
  const [message, setMessage] = React.useState('')

  function onFileChange(kind) {
    return async (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_BASE}/uploads/${kind}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (kind === 'resume') setResumeUrl(data.url)
      if (kind === 'logo') setLogoUrl(data.url)
    }
  }

  async function save() {
    try {
      const api = createApi(token)
      const { data } = await api.put('/users/me', { name, resumeUrl, logoUrl })
      login(localStorage.getItem('token'), data)
      setMessage('Saved')
    } catch (e) {
      setMessage('Failed to save')
    }
  }

  if (!user) return <div>Login first</div>

  return (
    <div style={{maxWidth:500}}>
      <h2>Profile</h2>
      <div>
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} />
      </div>
      {user.role === 'student' && (
        <div>
          <label>Resume</label>
          <input type="file" onChange={onFileChange('resume')} />
          {resumeUrl && <div><a href={`${API_BASE.replace(/\/api$/, '')}${resumeUrl}`} target="_blank">View resume</a></div>}
        </div>
      )}
      {user.role === 'company' && (
        <div>
          <label>Logo</label>
          <input type="file" onChange={onFileChange('logo')} />
          {logoUrl && <img src={`${API_BASE.replace(/\/api$/, '')}${logoUrl}`} alt="logo" style={{height:48}} />}
        </div>
      )}
      <button onClick={save}>Save</button>
      {message && <div>{message}</div>}
    </div>
  )
}
